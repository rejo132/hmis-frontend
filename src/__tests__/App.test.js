import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import App from '../App';
import { login } from '../slices/authSlice';

describe('App Component', () => {
  test('renders login page when not authenticated', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('renders dashboard for authenticated Admin', async () => {
    store.dispatch(login({ user: { username: 'admin', role: 'Admin' }, token: 'mock-admin-token' }));
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});