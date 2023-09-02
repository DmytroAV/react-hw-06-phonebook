import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
// import contactsInitialState from '../components/json/contacts.json';

const initialState = {
  items: [],
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContacts(state, action) {
      state.items.push(action.payload)
    },
    deleteContacts(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload)
    }
  }
});


const persistConfig = {
  key: 'contacts',
  version: 1,
  storage,
}

export const contactsReducer = persistReducer(persistConfig, contactsSlice.reducer);

export const { addContacts, deleteContacts } = contactsSlice.actions;

export const getContactsStorage = state => state.contacts.items;


