# Testing Guide

This document outlines the automated regression testing setup for the Drop-In Frontend application.

## Test Suite Overview

### 1. **Component Unit Tests**
   - **Rating Component** (`Rating.test.js`)
     - Star selection functionality
     - localStorage persistence
     - Hover state management
     - Initialization from props/localStorage
   
   - **ReviewForm Component** (`ReviewForm.test.js`)
     - Form validation (rating required)
     - Logged in/out states
     - API submission
     - Address normalization
     - Error handling (400, 403)
   
   - **Login Component** (`Login.test.js`)
     - Form input handling
     - API calls
     - Navigation after successful login
     - Error handling (400, 500)
     - Loading states

### 2. **Redux Store Tests**
   - **userSlice.test.js** - User state management
   - **addressSlice.test.js** - Address and coordinates
   - **reviewSlice.test.js** - Review data management

### 3. **Integration Tests**
   - **App.test.js** - Main app component with routing and initialization

## Test Utilities

Created `src/utils/test-utils.js` with helper functions:
- `renderWithProviders()` - Renders components with Redux and Router
- `createTestStore()` - Creates test Redux store
- `mockFetch()` - Mocks API calls
- `mockLocalStorage()` - Mocks localStorage

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode (default):
```bash
npm test -- --watch
```

### Run tests once:
```bash
npm test -- --watchAll=false
```

### Run specific test file:
```bash
npm test -- Rating.test.js
```

### Run with coverage:
```bash
npm test -- --coverage --watchAll=false
```

## Test Coverage

Current test files:
- ✅ `src/components/review/Rating.test.js`
- ✅ `src/components/review/ReviewForm.test.js`
- ✅ `src/components/login-signup/Login.test.js`
- ✅ `src/store/userSlice.test.js`
- ✅ `src/store/addressSlice.test.js`
- ✅ `src/store/reviewSlice.test.js`
- ✅ `src/App.test.js`

## What's Tested

### Component Behavior
- User interactions (clicks, form inputs)
- State updates
- Conditional rendering
- API calls and responses
- Error handling
- Navigation

### Redux Store
- Action creators
- Reducer logic
- State mutations
- Initial state

### Integration
- Component + Redux integration
- Component + Router integration
- localStorage interactions
- API mocking

## Next Steps (Optional Enhancements)

1. **E2E Tests** - Add Cypress or Playwright for full user flows
2. **Visual Regression** - Add Percy or Chromatic for UI testing
3. **CI/CD Integration** - Run tests on every commit/PR
4. **Additional Component Tests**:
   - SignUp component
   - Reviews component
   - UserDashboard component
   - ApartmentView component
5. **Performance Tests** - Test component render times
6. **Accessibility Tests** - Add @testing-library/jest-dom a11y matchers

## Best Practices

1. **Test user behavior, not implementation details**
2. **Use data-testid sparingly** - Prefer accessible queries
3. **Mock external dependencies** (APIs, localStorage)
4. **Keep tests isolated** - Each test should be independent
5. **Use descriptive test names** - "should do X when Y"
6. **Test error cases** - Not just happy paths

## Troubleshooting

If tests fail:
1. Check that all dependencies are installed: `npm install`
2. Clear Jest cache: `npm test -- --clearCache`
3. Check for console errors in test output
4. Verify mocks are set up correctly
5. Ensure test utilities are imported correctly

