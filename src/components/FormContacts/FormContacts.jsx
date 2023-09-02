import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContacts, getContactsStorage } from 'redux/contactsSlice';
import { useForm, Controller } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormError } from '../FormError/FormError';
import {
  Container,
  Title,
  ContainerForm,
  LabelInput,
  InputField,
  BtnAddContacts,
} from './FormContacts.styled';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';

const notifyOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};
const phoneRegExp = /^\+38\s\(\d{3}\)\s(\d{3})-(\d{2})-(\d{2})$/;

const validationSchema = yup.object().shape({
  firstName: yup.string().label('First Name').trim().min(3).max(10).required(),
  lastName: yup.string().label('Last Name').trim().min(3).max(10).required(),
  email: yup.string().email().label('Email').required(),
  mobilePhone: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Mobile Phone is required'),
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  mobilePhone: '',
};

const FormContacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(getContactsStorage);
  const {
    handleSubmit,
    control,
    reset,
    formState,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState.isSubmitSuccessful, reset]);

  const createContact = ({ firstName, lastName, email, mobilePhone }) => {
    const normalName = firstName.toLowerCase();
    const checkName = contacts.some(
      ({ firstName }) => firstName.toLowerCase() === normalName
    );
    if (checkName) {
      toast.error(`${firstName} is already in your phonebook`, notifyOptions);
      return;
    }

    const newContact = {
      id: nanoid(),
      firstName,
      lastName,
      email,
      mobilePhone,
    };

    dispatch(addContacts(newContact));
  };

  return (
    <Container>
      <Title>Phonebook</Title>
      <ContainerForm onSubmit={handleSubmit(createContact)}>
        <Controller
          name="firstName"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput htmlFor="firstName">
              First Name
              <InputField
                name="firstName"
                autoComplete="off"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                autoFocus
                $mode={errors.firstName}
                $capitalize
                type="text"
                placeholder="Enter First Name"
              />
              {errors.firstName && (
                <FormError message={errors?.firstName.message} />
              )}
            </LabelInput>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput htmlFor="lastName">
              Last Name
              <InputField
                name="lastName"
                autoComplete="off"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                $mode={errors.lastName}
                $capitalize
                type="text"
                placeholder="Enter Last Name"
              />
              {errors.lastName && (
                <FormError message={errors?.lastName.message} />
              )}
            </LabelInput>
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput htmlFor="email">
              Email
              <InputField
                name="email"
                autoComplete="off"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                $mode={errors.email}
                type="email"
                placeholder="Enter Email"
              />
              {errors.email && <FormError message={errors?.email.message} />}
            </LabelInput>
          )}
        />
        <Controller
          name="mobilePhone"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput htmlFor="mobilePhone">
              Mobile Phone
              <PatternFormat
                name="mobilePhone"
                customInput={InputField}
                type="tel"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                format="+38 (###) ###-##-##"
                allowEmptyFormatting
                mask="_"
                onValueChange={value => setValue(value.formattedValue)}
                autoComplete="off"
              />
              {errors.mobilePhone && (
                <FormError message={errors?.mobilePhone.message} />
              )}
            </LabelInput>
          )}
        />

        <BtnAddContacts type="submit" disabled={isSubmitting || !isValid}>
          submit
        </BtnAddContacts>
      </ContainerForm>
    </Container>
  );
};

export default FormContacts;
