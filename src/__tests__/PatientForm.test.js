import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import PatientForm from '../components/PatientForm';
import { BrowserRouter } from 'react-router-dom';
import { login } from '../slices/authSlice';

describe('PatientForm Component', () => {
  beforeEach(() => {
    store.dispatch(login({ user: { username: 'admin', role: 'Admin' }, token: 'mock-admin-token' }));
  });

  test('renders patient form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PatientForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /add patient/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact')).toBeInTheDocument();
  });

  test('submits patient data', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PatientForm />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('Contact'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /add patient/i }));
    await waitFor(() => {
      expect(store.getState().patients.patients).toContainEqual(
        expect.objectContaining({ name: 'John Doe', dob: '1990-01-01', contact: '1234567890' })
      );
    }, { timeout: 2000 });
  });
});