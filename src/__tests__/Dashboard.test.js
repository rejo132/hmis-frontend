import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Dashboard from '../components/Dashboard';
import { BrowserRouter } from 'react-router-dom';

describe('Dashboard Component', () => {
  test('renders dashboard for Admin', () => {
    store.getState().auth.user = { role: 'Admin' };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Add Patient')).toBeInTheDocument();
    expect(screen.getByText('Generate Bill')).toBeInTheDocument();
  });

  test('renders dashboard for Doctor', () => {
    store.getState().auth.user = { role: 'Doctor' };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Add Medical Record')).toBeInTheDocument();
    expect(screen.queryByText('Add Patient')).not.toBeInTheDocument();
  });
});