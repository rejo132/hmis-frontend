import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import RecordForm from '../components/RecordForm';
import { BrowserRouter } from 'react-router-dom';

describe('RecordForm Component', () => {
  test('renders record form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RecordForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Add Medical Record')).toBeInTheDocument();
    expect(screen.getByLabelText('Patient')).toBeInTheDocument();
  });

  test('submits record data', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RecordForm />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Diagnosis'), { target: { value: 'Flu' } });
    fireEvent.click(screen.getByText('Add Record'));
    // Add assertions for dispatch or navigation
  });
});