import reviewSlice, { setReview } from './reviewSlice';

describe('reviewSlice', () => {
  const initialState = {
    username: '',
    address: '',
    review_id: '',
    review_body: '',
    rating: null,
  };

  test('should return initial state', () => {
    expect(reviewSlice(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle setReview', () => {
    const reviewData = {
      username: 'testuser',
      address: '123 Test St, New York, NY',
      review_id: 'review-123',
      review_body: 'Great apartment!',
      rating: 5,
    };

    const actual = reviewSlice(initialState, setReview(reviewData));
    
    expect(actual).toEqual(reviewData);
  });

  test('should update existing review', () => {
    const existingState = {
      username: 'olduser',
      address: 'Old Address',
      review_id: 'old-id',
      review_body: 'Old review',
      rating: 3,
    };

    const newReviewData = {
      username: 'newuser',
      address: 'New Address',
      review_id: 'new-id',
      review_body: 'New review',
      rating: 5,
    };

    const actual = reviewSlice(existingState, setReview(newReviewData));
    expect(actual).toEqual(newReviewData);
  });
});

