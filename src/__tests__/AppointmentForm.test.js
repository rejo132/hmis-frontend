import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import AppointmentForm from '../components/AppointmentForm';
import { BrowserRouter } from 'react-router-dom';

describe('AppointmentForm Component', () => {
  test('renders appointment form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Schedule Appointment')).toBeInTheDocument();
    expect(screen.getByLabelText('Patient')).toBeInTheDocument();
  });

  test('submits appointment data', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentForm />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Appointment Time'), { target: { value: '2025-07-17T10:00' } });
    fireEvent.click(screen.getByText('Schedule'));
    // Add assertions for dispatch or navigation
  });
});