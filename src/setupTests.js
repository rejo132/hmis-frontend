import { server } from './mocks/server';
import '@testing-library/jest-dom';

// Start the mock server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test to ensure clean state
afterEach(() => {
  server.resetHandlers();
});

// Close the server after all tests
afterAll(() => {
  server.close();
});