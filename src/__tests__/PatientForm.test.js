import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';
import PatientForm from '../components/PatientForm';

test('renders patient form', () => {
  render(
    <Provider store={store}>
      <PatientForm />
    </Provider>
  );
  expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Contact')).toBeInTheDocument();
});