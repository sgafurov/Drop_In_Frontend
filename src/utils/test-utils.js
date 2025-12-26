// Test utilities for React Testing Library with Redux
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import addressSlice from '../store/addressSlice';
import userSlice from '../store/userSlice';
import reviewSlice from '../store/reviewSlice';

// Helper to create a test store with initial state
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      addressSlice,
      userSlice,
      reviewSlice,
    },
    preloadedState,
  });
}

// Custom render function that includes Redux Provider and Router
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock fetch helper
export function mockFetch(response, ok = true) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
      status: response.status || (ok ? 200 : 400),
    })
  );
}

// Mock localStorage helper
export function mockLocalStorage() {
  const store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
}

