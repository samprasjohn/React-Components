import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';

const Form = ({ fields, validationSchema, onSubmit, initialValues, customComponents }) => {
  const renderField = (field) => {
    const { name, label, type, component, ...rest } = field;

    const Component = customComponents[component] || Field;

    return (
      <div key={name} style={{ marginBottom: '1em' }}>
        <label htmlFor={name} style={{ display: 'block', marginBottom: '0.5em' }}>{label}</label>
        <Component type={type} name={name} {...rest} />
      </div>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object(validationSchema)}
      onSubmit={onSubmit}
    >
      {({ resetForm }) => (
        <FormikForm>
          {fields.map(renderField)}
          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => resetForm()}>Reset</button>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

Form.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      component: PropTypes.string,
    })
  ).isRequired,
  validationSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  customComponents: PropTypes.object,
};

export default Form;

//EXAMPLE//////////////////////////////////
import React from 'react';
import Form from './Form';
import Select from './Select'; // Assuming you created the Select component earlier
import { DatePickerField } from './DatePickerField'; // Example custom date picker component

const formFields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'age', label: 'Age', type: 'number' },
  {
    name: 'gender',
    label: 'Gender',
    component: 'select',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    name: 'birthdate',
    label: 'Birthdate',
    component: 'datepicker',
  },
];

const validationSchema = {
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  age: Yup.number().required('Age is required').min(1, 'Age must be at least 1'),
  gender: Yup.string().required('Gender is required'),
  birthdate: Yup.date().required('Birthdate is required'),
};

const initialValues = {
  name: '',
  email: '',
  age: '',
  gender: '',
  birthdate: '',
};

const handleSubmit = (values) => {
  console.log('Form Submitted', values);
};

const customComponents = {
  select: Select, // Custom Select component
  datepicker: DatePickerField, // Custom DatePicker component
};

const MyForm = () => (
  <Form
    fields={formFields}
    validationSchema={validationSchema}
    initialValues={initialValues}
    onSubmit={handleSubmit}
    customComponents={customComponents}
  />
);

export default MyForm;
