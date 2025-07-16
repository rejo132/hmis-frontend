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

    // Covers both label and placeholder cases
    expect(screen.getByText('Add Patient')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contact')).toBeInTheDocument();
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

    // You can add specific assertions here if dispatch or redirect logic is testable
    // Example (if using jest.mock): expect(mockDispatch).toHaveBeenCalledWith(...)
  });
});
