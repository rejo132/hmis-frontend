import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import PatientForm from '../components/PatientForm';
import { BrowserRouter } from 'react-router-dom';

describe('PatientForm Component', () => {
  test('renders add patient form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PatientForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Add Patient')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  test('submits patient data', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PatientForm />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.click(screen.getByText('Add Patient'));
    // Add assertions for dispatch or navigation
  });
});