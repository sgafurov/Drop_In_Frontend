import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserReviews from './UserReviews';
import { renderWithProviders } from '../../utils/test-utils';

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

// Mock window.confirm
global.confirm = jest.fn();

// Mock alert
global.alert = jest.fn();


describe('UserReviews Component - Delete Functionality', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    global.confirm.mockReturnValue(true); // Default to confirming deletion
    global.fetch = jest.fn();
  });

  const mockUserInfo = {
    username: 'testuser',
    _id: '123',
  };

  const mockReviews = [
    {
      body: 'Great apartment!',
      author: 'testuser',
      timestamp: '2024-01-15T10:00:00.000Z',
      address: '123 Test St, New York, NY',
      _id: 'review1',
      review_id: 'review1',
      rating: 5,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    },
    {
      body: 'Nice place to live',
      author: 'testuser',
      timestamp: '2024-01-10T10:00:00.000Z',
      address: '456 Another St, New York, NY',
      _id: 'review2',
      review_id: 'review2',
      rating: 4,
      createdAt: '2024-01-10T10:00:00.000Z',
      updatedAt: '2024-01-10T10:00:00.000Z',
    },
  ];

  const initialState = {
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

  test('renders delete button for each review', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    // Mock getUserReviews response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    // Wait for reviews to render
    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete review');
    expect(deleteButtons.length).toBe(2);
  });

  test('shows confirmation dialog when delete button is clicked', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Delete review');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this review? This action cannot be undone."
    );
  });

  test('does not delete review when user cancels confirmation', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(false); // User cancels

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Delete review');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    // Should not call delete API
    const deleteCalls = global.fetch.mock.calls.filter(call =>
      call[0].includes('/review/deleteReview')
    );
    expect(deleteCalls.length).toBe(0);
  });

  test('successfully deletes review when confirmed', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });

    // Mock deleteReview response
    const deleteResponse = { message: 'Review deleted successfully' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(deleteResponse)),
      json: () => Promise.resolve(deleteResponse),
    });

    // Mock getUserReviews after deletion (to refresh list)
    const remainingReviews = [mockReviews[1]]; // Remove first review
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(remainingReviews)),
      json: () => Promise.resolve(remainingReviews),
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/review/deleteReview'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Review deleted successfully');
    });
  });

  test('sends correct payload when deleting review', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });

    // Mock deleteReview response
    const deleteResponse = { message: 'Review deleted successfully' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(deleteResponse)),
      json: () => Promise.resolve(deleteResponse),
    });

    // Mock getUserReviews after deletion
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify([mockReviews[1]])),
      json: () => Promise.resolve([mockReviews[1]]),
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      const deleteCall = global.fetch.mock.calls.find(call =>
        call[0].includes('/review/deleteReview')
      );
      expect(deleteCall).toBeDefined();
      const body = JSON.parse(deleteCall[1].body);
      expect(body).toEqual({ review_id: 'review1' });
    });
  });

  test('handles 400 error when deleting review', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });

    // Mock deleteReview error response
    const errorResponse = {
      status: 400,
      message: 'Invalid request',
    };
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify(errorResponse)),
      json: () => Promise.resolve(errorResponse),
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid request');
    });
  });

  test('handles 403 error when deleting review', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });

    // Mock deleteReview error response
    const errorResponse = {
      status: 403,
      message: 'You can only delete your own reviews',
    };
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: () => Promise.resolve(JSON.stringify(errorResponse)),
      json: () => Promise.resolve(errorResponse),
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('You can only delete your own reviews');
    });
  });

  test('handles 404 error when deleting review', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });

    // Mock deleteReview error response
    const errorResponse = {
      status: 404,
      message: 'Review not found',
    };
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve(JSON.stringify(errorResponse)),
      json: () => Promise.resolve(errorResponse),
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Review not found');
    });
  });

  test('handles non-JSON error response when deleting review', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });

    // Mock deleteReview with HTML error response (non-JSON)
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve('<html><body>404 Not Found</body></html>'),
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Review not found');
    });
  });

  test('refreshes review list after successful deletion', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
      expect(screen.getByText('Nice place to live')).toBeInTheDocument();
    });

    // Mock deleteReview response
    const deleteResponse = { message: 'Review deleted successfully' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(deleteResponse)),
      json: () => Promise.resolve(deleteResponse),
    });

    // Mock getUserReviews after deletion (should return only remaining review)
    const remainingReviews = [mockReviews[1]];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(remainingReviews)),
      json: () => Promise.resolve(remainingReviews),
    });

    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      // Should call getUserReviews again after deletion
      const getUserReviewsCalls = global.fetch.mock.calls.filter(call =>
        call[0].includes('/review/getUserReviews')
      );
      expect(getUserReviewsCalls.length).toBeGreaterThan(1);
    });
  });

  test('resets edit state when deleting a review that is being edited', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReviews)),
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });

    // Click edit button first
    const editButton = screen.getAllByTitle('Edit review')[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit your review...')).toBeInTheDocument();
    });

    // Mock deleteReview response
    const deleteResponse = { message: 'Review deleted successfully' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(deleteResponse)),
      json: () => Promise.resolve(deleteResponse),
    });

    // Mock getUserReviews after deletion
    const remainingReviews = [mockReviews[1]];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(remainingReviews)),
      json: () => Promise.resolve(remainingReviews),
    });

    // Now click delete button
    const deleteButton = screen.getAllByTitle('Delete review')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Review deleted successfully');
    });

    // Edit form should no longer be visible after deletion
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Edit your review...')).not.toBeInTheDocument();
    });
  });

  test('handles missing review ID gracefully', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');
    global.confirm.mockReturnValue(true);

    // Mock getUserReviews with review that has missing ID
    const reviewWithoutId = {
      body: 'Test review',
      author: 'testuser',
      address: '123 Test St',
      _id: '',
      review_id: '',
      rating: 5,
      timestamp: '2024-01-15T10:00:00.000Z',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify([reviewWithoutId])),
      json: () => Promise.resolve([reviewWithoutId]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Test review')).toBeInTheDocument();
    });

    // Delete button should still be present (component uses fallback logic)
    const deleteButton = screen.getByTitle('Delete review');
    expect(deleteButton).toBeInTheDocument();

    // Clicking delete with missing ID should show error
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Error: Review ID not found. Please try again.');
    });
  });
});

describe('UserReviews Component - Initial Load & Data Fetching', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const mockUserInfo = {
    username: 'testuser',
    _id: '123',
  };

  const initialState = {
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

  test('loads reviews from backend on mount when user is logged in', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    
    const mockReviews = [
      {
        review_body: 'Great apartment!',
        username: 'testuser',
        address: '123 Test St, New York, NY',
        _id: 'review1',
        review_id: 'review1',
        rating: 5,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/review/getUserReviews'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'testuser' }),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Great apartment!')).toBeInTheDocument();
    });
  });

  test('displays empty state when user has no reviews', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText("You haven't written any reviews yet.")).toBeInTheDocument();
      expect(screen.getByText("Start reviewing apartments to see them here!")).toBeInTheDocument();
    });
  });

  test('handles error when fetching reviews fails', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    const errorResponse = {
      status: 400,
      message: 'Failed to fetch reviews',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(errorResponse),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to fetch reviews');
    });
  });

  test('does not fetch reviews when user is not logged in', () => {
    // No userInfo in localStorage
    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('prioritizes updatedAt timestamp over createdAt when review was modified', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    const mockReview = {
      review_body: 'Updated review',
      username: 'testuser',
      address: '123 Test St',
      _id: 'review1',
      review_id: 'review1',
      rating: 5,
      createdAt: '2024-01-10T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z', // Different from createdAt
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Updated review')).toBeInTheDocument();
    });

    // Should display formatted timestamp (using updatedAt)
    // The format is "Jan 15, 2024 at 10:00 AM" or similar
    await waitFor(() => {
      const timestampElements = screen.getAllByText(/Jan 15, 2024|Jan 10, 2024/);
      // Should show Jan 15 (updatedAt) not Jan 10 (createdAt)
      const hasJan15 = timestampElements.some(el => el.textContent.includes('Jan 15'));
      expect(hasJan15).toBe(true);
    });
  });
});

describe('UserReviews Component - Edit Functionality', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const mockUserInfo = {
    username: 'testuser',
    _id: '123',
  };

  const mockReview = {
    review_body: 'Original review',
    username: 'testuser',
    address: '123 Test St, New York, NY',
    _id: 'review1',
    review_id: 'review1',
    rating: 4,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  };

  const initialState = {
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

  test('enters edit mode when edit button is clicked', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });

    const editButton = screen.getByTitle('Edit review');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit your review...')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  test('populates edit form with existing review data', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });

    const editButton = screen.getByTitle('Edit review');
    fireEvent.click(editButton);

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('Edit your review...');
      expect(textarea).toHaveValue('Original review');
    });
  });

  test('allows editing review text', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });

    const editButton = screen.getByTitle('Edit review');
    fireEvent.click(editButton);

    const textarea = await screen.findByPlaceholderText('Edit your review...');
    
    // Use fireEvent.change with proper event structure
    fireEvent.change(textarea, { 
      target: { 
        name: 'body', 
        value: 'Updated review text' 
      } 
    });

    // Wait for the value to update
    await waitFor(() => {
      expect(textarea).toHaveValue('Updated review text');
    }, { timeout: 3000 });
  });

  test('cancels edit and returns to view mode', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });

    const editButton = screen.getByTitle('Edit review');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit your review...')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Edit your review...')).not.toBeInTheDocument();
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });
  });

  test('successfully updates review', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });

    const editButton = screen.getByTitle('Edit review');
    fireEvent.click(editButton);

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('Edit your review...');
      fireEvent.change(textarea, { target: { name: 'body', value: 'Updated review' } });
    });

    // Mock updateReview response
    const updatedReview = {
      ...mockReview,
      review_body: 'Updated review',
      updatedAt: '2024-01-16T10:00:00.000Z',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(updatedReview),
    });

    // Mock getUserReviews after update
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([updatedReview]),
    });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/review/updateReview'),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Review updated successfully');
    });
  });

  test('prevents saving review without rating', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    // Create a review with rating 0 to test validation
    const reviewWithoutRating = {
      ...mockReview,
      rating: 0,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([reviewWithoutRating]),
    });

    const stateWithNullRating = {
      ...initialState,
      reviewSlice: {
        ...initialState.reviewSlice,
        rating: null,
      },
    };

    renderWithProviders(<UserReviews />, { preloadedState: stateWithNullRating });

    await waitFor(() => {
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });

    const editButton = screen.getByTitle('Edit review');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit your review...')).toBeInTheDocument();
    });

    // The component will have set rating to 0 from the review
    // We need to ensure Redux rating is also null/0 for the validation to trigger
    // Since handleEditClick sets Redux rating to review.rating (which is 0),
    // and handleUpdateReview checks: rating !== null ? parseInt(rating) : editFormData.rating
    // If rating is 0, it will pass parseInt(0) which is 0, triggering the validation
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Please provide a star rating');
    });
  });

  test('prevents saving review with empty body', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });

    const editButton = screen.getByTitle('Edit review');
    fireEvent.click(editButton);

    const textarea = await screen.findByPlaceholderText('Edit your review...');
    
    // Change to only whitespace
    fireEvent.change(textarea, { 
      target: { 
        name: 'body', 
        value: '   ' 
      } 
    });

    // Wait for the value to update
    await waitFor(() => {
      expect(textarea).toHaveValue('   ');
    }, { timeout: 3000 });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Review body cannot be empty');
    });

    // Verify that updateReview API was not called
    const updateCalls = global.fetch.mock.calls.filter(call =>
      call[0] && call[0].includes('/review/updateReview')
    );
    expect(updateCalls.length).toBe(0);
  });

  test('handles update review error', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));
    localStorageMock.setItem('token', 'test-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Original review')).toBeInTheDocument();
    });

    const editButton = screen.getByTitle('Edit review');
    fireEvent.click(editButton);

    // Mock updateReview error
    const errorResponse = {
      status: 403,
      message: 'You can only update your own reviews',
    };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () => Promise.resolve(errorResponse),
    });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('You can only update your own reviews');
    });
  });
});

describe('UserReviews Component - Sorting', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const mockUserInfo = {
    username: 'testuser',
    _id: '123',
  };

  const mockReviews = [
    {
      review_body: 'Older review',
      username: 'testuser',
      address: '123 Test St',
      _id: 'review1',
      review_id: 'review1',
      rating: 4,
      createdAt: '2024-01-10T10:00:00.000Z',
      updatedAt: '2024-01-10T10:00:00.000Z',
    },
    {
      review_body: 'Newer review',
      username: 'testuser',
      address: '456 Test St',
      _id: 'review2',
      review_id: 'review2',
      rating: 5,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    },
  ];

  const initialState = {
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

  test('displays sort button when reviews exist', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Sort by Newest')).toBeInTheDocument();
    });
  });

  test('sorts reviews by newest when sort button is clicked', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    // Return reviews in reverse order (newer first) to test sorting
    const reviewsInReverseOrder = [mockReviews[1], mockReviews[0]];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(reviewsInReverseOrder),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Sort by Newest')).toBeInTheDocument();
      expect(screen.getByText('Newer review')).toBeInTheDocument();
      expect(screen.getByText('Older review')).toBeInTheDocument();
    });

    // Verify initial order (might be in any order from backend)
    const initialReviews = screen.getAllByText(/Older review|Newer review/);
    const initialFirstReview = initialReviews[0].textContent;

    const sortButton = screen.getByText('Sort by Newest');
    fireEvent.click(sortButton);

    await waitFor(() => {
      expect(screen.getByText('✓ Sorted by Newest')).toBeInTheDocument();
    });

    // After sorting, newer review should be first
    const sortedReviews = screen.getAllByText(/Older review|Newer review/);
    expect(sortedReviews[0]).toHaveTextContent('Newer review');
    expect(sortedReviews[1]).toHaveTextContent('Older review');
  });

  test('does not show sort button when no reviews exist', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.queryByText('Sort by Newest')).not.toBeInTheDocument();
    });
  });
});

describe('UserReviews Component - Display & Rendering', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const mockUserInfo = {
    username: 'testuser',
    _id: '123',
  };

  const initialState = {
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

  test('displays review address', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    const mockReview = {
      review_body: 'Great place',
      username: 'testuser',
      address: '123 Test St, New York, NY',
      _id: 'review1',
      review_id: 'review1',
      rating: 5,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('123 Test St, New York, NY')).toBeInTheDocument();
    });
  });

  test('filters out empty reviews', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    const mockReviews = [
      {
        review_body: 'Valid review',
        username: 'testuser',
        address: '123 Test St',
        _id: 'review1',
        review_id: 'review1',
        rating: 5,
        createdAt: '2024-01-15T10:00:00.000Z',
      },
      {
        review_body: '', // Empty review
        username: 'testuser',
        address: '456 Test St',
        _id: 'review2',
        review_id: 'review2',
        rating: 4,
        createdAt: '2024-01-10T10:00:00.000Z',
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockReviews),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      expect(screen.getByText('Valid review')).toBeInTheDocument();
      expect(screen.queryByText('456 Test St')).not.toBeInTheDocument();
    });
  });

  test('displays formatted timestamp', async () => {
    localStorageMock.setItem('userInfo', JSON.stringify(mockUserInfo));

    const mockReview = {
      review_body: 'Test review',
      username: 'testuser',
      address: '123 Test St',
      _id: 'review1',
      review_id: 'review1',
      rating: 5,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockReview]),
    });

    renderWithProviders(<UserReviews />, { preloadedState: initialState });

    await waitFor(() => {
      // Should display formatted date like "Jan 15, 2024 at 10:00 AM"
      const timestamp = screen.getByText(/Jan 15, 2024/i);
      expect(timestamp).toBeInTheDocument();
    });
  });
});

