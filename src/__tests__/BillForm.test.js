import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import BillForm from '../components/BillForm';
import { BrowserRouter } from 'react-router-dom';
import { login } from '../slices/authSlice';
import { act } from 'react-dom/test-utils';

describe('BillForm Component', () => {
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

  test('renders bill form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BillForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /generate bill/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Patient')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  test('submits bill data', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BillForm />
        </BrowserRouter>
      </Provider>
    );
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Consultation' } });
      fireEvent.click(screen.getByRole('button', { name: /generate bill/i }));
    });
    await waitFor(() => {
      expect(store.getState().bills.bills).toContainEqual(
        expect.objectContaining({ amount: '100', patient_id: '1', description: 'Consultation' })
      );
    }, { timeout: 2000 });
  });
});