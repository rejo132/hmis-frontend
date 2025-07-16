import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Dashboard from '../components/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { login } from '../slices/authSlice';
import { within } from '@testing-library/react';

describe('Dashboard Component', () => {
  beforeEach(() => {
    store.dispatch({
      type: 'patients/fetchPatients/fulfilled',
      payload: {
        patients: [{ id: 1, name: 'John Doe', dob: '1990-01-01', contact: '1234567890' }],
        page: 1,
        pages: 1,
      },
    });
    store.dispatch({
      type: 'appointments/fetchAppointments/fulfilled',
      payload: {
        appointments: [
          { id: 1, patient_id: '1', patient_name: 'John Doe', appointment_time: '2025-07-17T10:00', status: 'Scheduled' },
        ],
        page: 1,
        pages: 1,
      },
    });
    store.dispatch({
      type: 'bills/fetchBills/fulfilled',
      payload: {
        bills: [
          { id: 1, patient_id: '1', patient_name: 'John Doe', amount: '100', description: 'Consultation', payment_status: 'Pending' },
        ],
        page: 1,
        pages: 1,
      },
    });
    store.dispatch({
      type: 'records/fetchRecords/fulfilled',
      payload: {
        records: [
          { id: 1, patient_id: '1', patient_name: 'John Doe', diagnosis: 'Flu', prescription: 'Rest', vital_signs: 'Normal' },
        ],
      },
    });
  });

  test('renders dashboard for Admin with mock data', async () => {
    store.dispatch(login({ user: { username: 'admin', role: 'Admin' }, token: 'mock-admin-token' }));
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add patient/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /generate bill/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /patients/i })).toBeInTheDocument();
      const patientTable = screen.getByRole('table', { name: /patients/i });
      expect(within(patientTable).getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Consultation')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('renders dashboard for Doctor with mock data', async () => {
    store.dispatch(login({ user: { username: 'doctor', role: 'Doctor' }, token: 'mock-doctor-token' }));
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add medical record/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /medical records/i })).toBeInTheDocument();
      expect(screen.getByText('Flu')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add patient/i })).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('renders dashboard for Nurse with mock data', async () => {
    store.dispatch(login({ user: { username: 'nurse', role: 'Nurse' }, token: 'mock-nurse-token' }));
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /medical records/i })).toBeInTheDocument();
      expect(screen.getByText('Flu')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add patient/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add medical record/i })).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });
});