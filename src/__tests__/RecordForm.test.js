import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import RecordForm from '../components/RecordForm';
import { BrowserRouter } from 'react-router-dom';
import { login } from '../slices/authSlice';
import { act } from 'react-dom/test-utils';

describe('RecordForm Component', () => {
  beforeEach(() => {
    store.dispatch(login({ user: { username: 'doctor', role: 'Doctor' }, token: 'mock-doctor-token' }));
    store.dispatch({
      type: 'patients/fetchPatients/fulfilled',
      payload: {
        patients: [{ id: 1, name: 'John Doe' }],
        page: 1,
        pages: 1,
      },
    });
  });

  test('renders record form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RecordForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /add medical record/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Patient')).toBeInTheDocument();
    expect(screen.getByLabelText('Diagnosis')).toBeInTheDocument();
    expect(screen.getByLabelText('Vital Signs')).toBeInTheDocument();
  });

  test('submits record data', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RecordForm />
        </BrowserRouter>
      </Provider>
    );
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Diagnosis'), { target: { value: 'Flu' } });
      fireEvent.change(screen.getByLabelText('Vital Signs'), { target: { value: 'Normal' } });
      fireEvent.click(screen.getByRole('button', { name: /add record/i }));
    });
    await waitFor(() => {
      expect(store.getState().records.records).toContainEqual(
        expect.objectContaining({ diagnosis: 'Flu', patient_id: '1', vital_signs: 'Normal' })
      );
    }, { timeout: 2000 });
  });
});