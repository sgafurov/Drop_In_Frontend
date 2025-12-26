import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Rating from './Rating';
import { renderWithProviders } from '../../utils/test-utils';

describe('Rating Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders 5 star buttons', () => {
    renderWithProviders(<Rating />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });

  test('displays all stars as unselected initially', () => {
    renderWithProviders(<Rating />);
    const stars = screen.getAllByRole('button');
    stars.forEach((star) => {
      expect(star).toHaveClass('off');
    });
  });

  test('updates rating when star is clicked', () => {
    const { store } = renderWithProviders(<Rating />);
    const stars = screen.getAllByRole('button');
    
    // Click the 3rd star (index 2 = rating 3)
    fireEvent.click(stars[2]);
    // Trigger mouseLeave to sync hover with rating (component behavior: onMouseLeave sets hover to rating)
    fireEvent.mouseLeave(stars[2]);
    
    // After clicking and mouseLeave, hover matches rating, so first 3 stars should be on
    const updatedStars = screen.getAllByRole('button');
    expect(updatedStars[0]).toHaveClass('on');
    expect(updatedStars[1]).toHaveClass('on');
    expect(updatedStars[2]).toHaveClass('on');
    expect(updatedStars[3]).toHaveClass('off');
    expect(updatedStars[4]).toHaveClass('off');
    
    // Verify rating was saved to Redux
    expect(store.getState().reviewSlice.rating).toBe(3);
  });

  test('saves rating to Redux when clicked', async () => {
    const { store } = renderWithProviders(<Rating />);
    const stars = screen.getAllByRole('button');
    
    fireEvent.click(stars[3]); // Click 4th star (index 3 = rating 4)
    
    // Wait for useEffect to run and save to Redux
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify rating was saved to Redux
    expect(store.getState().reviewSlice.rating).toBe(4);
  });

  test('initializes from Redux state if available', () => {
    const preloadedState = {
      reviewSlice: {
        rating: 3,
        username: '',
        address: '',
        review_id: '',
        review_body: '',
      },
    };
    renderWithProviders(<Rating />, { preloadedState });
    
    const stars = screen.getAllByRole('button');
    // First 3 stars should be on
    expect(stars[0]).toHaveClass('on');
    expect(stars[1]).toHaveClass('on');
    expect(stars[2]).toHaveClass('on');
    expect(stars[3]).toHaveClass('off');
  });

  test('initializes from prop if provided', async () => {
    const { store } = renderWithProviders(<Rating initialRating={5} />);
    
    // Wait for useEffect to run and update state
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const stars = screen.getAllByRole('button');
    stars.forEach((star) => {
      expect(star).toHaveClass('on');
    });
    
    // Verify rating was saved to Redux
    expect(store.getState().reviewSlice.rating).toBe(5);
  });

  test('updates hover state on mouse enter', () => {
    renderWithProviders(<Rating />);
    const stars = screen.getAllByRole('button');
    
    fireEvent.mouseEnter(stars[3]); // Hover over 4th star
    
    // First 4 stars should be on when hovering
    expect(stars[0]).toHaveClass('on');
    expect(stars[1]).toHaveClass('on');
    expect(stars[2]).toHaveClass('on');
    expect(stars[3]).toHaveClass('on');
    expect(stars[4]).toHaveClass('off');
  });

  test('resets hover state on mouse leave', () => {
    renderWithProviders(<Rating />);
    const stars = screen.getAllByRole('button');
    
    // Click 2nd star (index 1 = rating 2), then hover over 4th
    fireEvent.click(stars[1]);
    fireEvent.mouseEnter(stars[3]);
    fireEvent.mouseLeave(stars[3]);
    
    // Should reset to clicked rating (2 stars on)
    const updatedStars = screen.getAllByRole('button');
    expect(updatedStars[0]).toHaveClass('on');
    expect(updatedStars[1]).toHaveClass('on');
    expect(updatedStars[2]).toHaveClass('off');
  });
});

