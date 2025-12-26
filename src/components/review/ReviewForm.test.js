import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from './ReviewForm';
import { renderWithProviders, mockFetch } from '../../utils/test-utils';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.location.reload
delete window.location;
window.location = { reload: jest.fn() };

// Mock alert
global.alert = jest.fn();

describe('ReviewForm Component', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const loggedInState = {
    userSlice: {
      isLoggedIn: true,
      username: 'testuser',
      _id: '123',
    },
    addressSlice: {
      address: '123 Test St, New York, NY',
    },
    reviewSlice: {
      username: '',
      address: '',
      review_id: '',
      review_body: '',
      rating: null,
    },
  };

  const loggedOutState = {
    userSlice: {
      isLoggedIn: false,
      username: '',
      _id: '',
    },
    addressSlice: {
      address: '123 Test St, New York, NY',
    },
    reviewSlice: {
      username: '',
      address: '',
      review_id: '',
      review_body: '',
      rating: null,
    },
  };

  test('renders login prompt when user is not logged in', () => {
    renderWithProviders(<ReviewForm />, { preloadedState: loggedOutState });
    
    expect(screen.getByPlaceholderText(/sign in to leave a review/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('renders review form when user is logged in', () => {
    renderWithProviders(<ReviewForm />, { preloadedState: loggedInState });
    
    expect(screen.getByPlaceholderText(/leave a review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('allows typing in review textbox when logged in', () => {
    renderWithProviders(<ReviewForm />, { preloadedState: loggedInState });
    
    const textbox = screen.getByPlaceholderText(/leave a review/i);
    fireEvent.change(textbox, { target: { name: 'review_body', value: 'Great apartment!' } });
    
    expect(textbox).toHaveValue('Great apartment!');
  });

  test('prevents submission without rating', async () => {
    const stateWithoutRating = {
      ...loggedInState,
      reviewSlice: {
        ...loggedInState.reviewSlice,
        rating: null,
      },
    };
    renderWithProviders(<ReviewForm />, { preloadedState: stateWithoutRating });
    
    const textbox = screen.getByPlaceholderText(/leave a review/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(textbox, { target: { name: 'review_body', value: 'Test review' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Provide a star rating');
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('submits review successfully with rating and text', async () => {
    localStorageMock.setItem('token', 'test-token');
    
    const stateWithRating = {
      ...loggedInState,
      reviewSlice: {
        ...loggedInState.reviewSlice,
        rating: 5,
      },
    };
    
    const mockResponse = {
      status: 200,
      message: 'Review added successfully',
    };
    
    mockFetch(mockResponse, true);
    
    renderWithProviders(<ReviewForm />, { preloadedState: stateWithRating });
    
    const textbox = screen.getByPlaceholderText(/leave a review/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(textbox, { target: { name: 'review_body', value: 'Amazing place!' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/review/postReview'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Review added');
    });
  });

  test('normalizes address by removing ", USA" suffix', async () => {
    localStorageMock.setItem('token', 'test-token');
    
    const stateWithUSASuffix = {
      ...loggedInState,
      addressSlice: {
        address: '123 Test St, New York, NY, USA',
      },
      reviewSlice: {
        ...loggedInState.reviewSlice,
        rating: 4,
      },
    };
    
    const mockResponse = { status: 200 };
    mockFetch(mockResponse, true);
    
    renderWithProviders(<ReviewForm />, { preloadedState: stateWithUSASuffix });
    
    const textbox = screen.getByPlaceholderText(/leave a review/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(textbox, { target: { name: 'review_body', value: 'Test' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const callArgs = global.fetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.address).toBe('123 Test St, New York, NY');
      expect(body.address).not.toContain('USA');
    });
  });

  test('handles API error 400', async () => {
    localStorageMock.setItem('token', 'test-token');
    
    const stateWithRating = {
      ...loggedInState,
      reviewSlice: {
        ...loggedInState.reviewSlice,
        rating: 3,
      },
    };
    
    const errorResponse = {
      status: 400,
      message: 'Invalid review data',
    };
    
    mockFetch(errorResponse, false);
    
    renderWithProviders(<ReviewForm />, { preloadedState: stateWithRating });
    
    const textbox = screen.getByPlaceholderText(/leave a review/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(textbox, { target: { name: 'review_body', value: 'Test' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid review data');
    });
  });

  test('handles API error 403', async () => {
    localStorageMock.setItem('token', 'test-token');
    
    const stateWithRating = {
      ...loggedInState,
      reviewSlice: {
        ...loggedInState.reviewSlice,
        rating: 5,
      },
    };
    
    const errorResponse = {
      status: 403,
      message: 'Unauthorized',
    };
    
    mockFetch(errorResponse, false);
    
    renderWithProviders(<ReviewForm />, { preloadedState: stateWithRating });
    
    const textbox = screen.getByPlaceholderText(/leave a review/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(textbox, { target: { name: 'review_body', value: 'Test' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Unauthorized');
    });
  });
});

