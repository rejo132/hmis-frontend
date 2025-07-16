import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import BillForm from '../components/BillForm';
import { BrowserRouter } from 'react-router-dom';

describe('BillForm Component', () => {
  test('renders bill form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BillForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Generate Bill')).toBeInTheDocument();
    expect(screen.getByLabelText('Patient')).toBeInTheDocument();
  });

  test('submits bill data', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BillForm />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Consultation' } });
    fireEvent.click(screen.getByText('Generate Bill'));
    // Add assertions for dispatch or navigation
  });
});