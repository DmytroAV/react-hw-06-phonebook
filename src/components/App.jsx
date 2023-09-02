import { useDispatch, useSelector } from 'react-redux';
import { deleteContacts, getContactsStorage } from 'redux/contactsSlice';
import { addFilters, getFilters } from 'redux/filtersSlice';
import FormContacts from './FormContacts/FormContacts';
import { ContactsList } from './ContactsList/ContactsList';
import { Message } from './Message/Message';
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const contacts = useSelector(getContactsStorage);
  const filters = useSelector(getFilters);

  const addFilterContacts = () => {
    const normalFilter = filters.toLowerCase().trim();
    if (contacts) {
      return contacts.filter(({ firstName }) =>
        firstName.toLowerCase().includes(normalFilter)
      );
    }
    return;
  };

  const filteredContacts = addFilterContacts();

  return (
    <>
      <StyleSheetManager
        shouldForwardProp={isPropValid}
        disableVendorPrefixes={false}
      >
        <GlobalStyle />
        <div className="container">
          <FormContacts />
          {contacts ? (
            <ContactsList
              items={filteredContacts}
              onChange={e => dispatch(addFilters(e.target.value))}
              onDelete={id => dispatch(deleteContacts(id))}
              value={filters}
            />
          ) : (
            <Message message="There are no contacts in your phonebook. Please add your first contact!" />
          )}
          <ToastContainer />
        </div>
      </StyleSheetManager>
    </>
  );
}

export default App;
