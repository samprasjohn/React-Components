import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, useField } from 'formik';

const Input = ({
  label,
  type = 'text',
  name,
  placeholder,
  style,
  inputStyle,
  errorStyle,
  successStyle,
  ...props
}) => {
  const [field, meta] = useField(name);
  
  const getInputStyle = () => {
    if (meta.touched && meta.error) {
      return { ...inputStyle, ...errorStyle };
    } else if (meta.touched && !meta.error) {
      return { ...inputStyle, ...successStyle };
    }
    return inputStyle;
  };

  return (
    <div style={{ marginBottom: '1em', ...style }}>
      {label && <label htmlFor={name} style={{ display: 'block', marginBottom: '0.5em' }}>{label}</label>}
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...field}
        {...props}
        style={getInputStyle()}
      />
      {meta.touched && meta.error && (
        <div style={{ color: 'red', marginTop: '0.5em', ...errorStyle }}>
          <ErrorMessage name={name} />
        </div>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  errorStyle: PropTypes.object,
  successStyle: PropTypes.object,
};

export default Input;
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from './Input';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  age: Yup.number().required('Age is required').min(1, 'Age must be at least 1'),
});

const MyForm = () => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    age: '',
  };

  const handleSubmit = (values) => {
    console.log('Form Submitted', values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Input
          label="Username"
          name="username"
          placeholder="Enter your username"
          style={{ marginBottom: '1em' }}
          inputStyle={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
          errorStyle={{
            borderColor: 'red',
          }}
          successStyle={{
            borderColor: 'green',
          }}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          inputStyle={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
          errorStyle={{
            borderColor: 'red',
          }}
          successStyle={{
            borderColor: 'green',
          }}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          inputStyle={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
          errorStyle={{
            borderColor: 'red',
          }}
          successStyle={{
            borderColor: 'green',
          }}
        />

        <Input
          label="Age"
          type="number"
          name="age"
          placeholder="Enter your age"
          inputStyle={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
          errorStyle={{
            borderColor: 'red',
          }}
          successStyle={{
            borderColor: 'green',
          }}
        />

        <button type="submit" style={{ padding: '10px 15px', borderRadius: '4px', backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </Form>
    </Formik>
  );
};

export default MyForm;
