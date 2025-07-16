import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import AppointmentForm from '../components/AppointmentForm';
import { BrowserRouter } from 'react-router-dom';
import { login } from '../slices/authSlice';
import { act } from 'react-dom/test-utils';

describe('AppointmentForm Component', () => {
  beforeEach(() => {
    store.dispatch(login({ user: { username: 'admin', role: 'Admin' }, token: 'mock-admin-token' }));
    store.dispatch({
      type: 'patients/fetchPatients/fulfilled',
      payload: {
        patients: [{ id: 1, name: 'John Doe' }],
        page: 1,
        pages: 1,
      },
    });
  });

  test('renders appointment form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /schedule appointment/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Patient')).toBeInTheDocument();
    expect(screen.getByLabelText('Appointment Time')).toBeInTheDocument();
  });

  test('submits appointment data', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentForm />
        </BrowserRouter>
      </Provider>
    );
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Appointment Time'), { target: { value: '2025-07-17T10:00' } });
      fireEvent.click(screen.getByRole('button', { name: /schedule appointment/i }));
    });
    await waitFor(() => {
      expect(store.getState().appointments.appointments).toContainEqual(
        expect.objectContaining({ patient_id: '1', appointment_time: '2025-07-17T10:00' })
      );
    }, { timeout: 2000 });
  });
});