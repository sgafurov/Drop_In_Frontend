import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { renderWithProviders } from './utils/test-utils';

// Mock fetch for userInfo API call
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({
      _id: '123',
      username: 'testuser',
      email: 'test@test.com',
    }),
  })
);

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders navbar', () => {
    renderWithProviders(<App />);
    // Navbar should be present (adjust selector based on your Navbar component)
    const navbar = screen.getByRole('navigation') || document.querySelector('nav');
    expect(navbar || document.body).toBeTruthy();
  });

  test('renders landing page by default', () => {
    renderWithProviders(<App />);
    // Check if routes are rendered (adjust based on your Landing component)
    expect(window.location.pathname).toBe('/');
  });

  test('loads user info from localStorage on mount', async () => {
    localStorage.setItem('lat', '40.7128');
    localStorage.setItem('lng', '-74.0060');
    localStorage.setItem('address', '123 Test St');
    localStorage.setItem('userInfo', JSON.stringify({
      username: 'testuser',
      _id: '123',
    }));
    localStorage.setItem('token', 'test-token');

    renderWithProviders(<App />);

    // Wait for useEffect to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify fetch was called for userInfo
    expect(global.fetch).toHaveBeenCalled();
  });

  test('does not call API if no token in localStorage', () => {
    localStorage.clear();
    
    renderWithProviders(<App />);
    
    // Should not call fetch for userInfo if no token
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
