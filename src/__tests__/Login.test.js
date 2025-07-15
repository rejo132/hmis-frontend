import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';
import Login from '../components/Login';

test('renders login form', () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});