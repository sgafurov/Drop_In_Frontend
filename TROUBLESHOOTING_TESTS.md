# Troubleshooting "No Tests Found" Issue

If you're seeing "No tests found" when running `npm test`, try these solutions:

## Quick Fixes

### 1. Clear Jest Cache
```bash
npm test -- --clearCache
```

### 2. Run Tests with Explicit Pattern
```bash
npm test -- --testPathPattern="Rating.test.js"
```

### 3. Check Test File Locations
Jest (via react-scripts) looks for tests in:
- Files ending in `.test.js` or `.test.jsx`
- Files ending in `.spec.js` or `.spec.jsx`
- Files in `__tests__` folders

All test files should be in the `src/` directory or subdirectories.

### 4. Verify Test File Syntax
Make sure all test files:
- Start with `import` or `require` statements
- Have at least one `test()` or `it()` call
- Are valid JavaScript/JSX

### 5. Run Tests in Non-Watch Mode
```bash
npm test -- --watchAll=false
```

### 6. Check for Import Errors
If there are import errors, Jest might skip the file. Check the console for:
- Module not found errors
- Syntax errors
- Missing dependencies

## Verify Test Discovery

Run this to see which tests Jest finds:
```bash
npm test -- --listTests
```

## Common Issues

### Issue: Tests in wrong directory
**Solution**: All `.test.js` files must be in `src/` or its subdirectories

### Issue: Missing dependencies
**Solution**: Run `npm install` to ensure all test dependencies are installed

### Issue: Syntax errors in test files
**Solution**: Check each test file for JavaScript syntax errors

### Issue: Jest cache corruption
**Solution**: Clear cache with `npm test -- --clearCache`

## Test Files That Should Be Found

- ✅ `src/App.test.js`
- ✅ `src/components/review/Rating.test.js`
- ✅ `src/components/review/ReviewForm.test.js`
- ✅ `src/components/login-signup/Login.test.js`
- ✅ `src/store/userSlice.test.js`
- ✅ `src/store/addressSlice.test.js`
- ✅ `src/store/reviewSlice.test.js`
- ✅ `src/utils/test-utils.test.js`

## If Still Not Working

1. **Check package.json** - Ensure `react-scripts` is installed
2. **Check node_modules** - Try `rm -rf node_modules && npm install`
3. **Check Jest version** - react-scripts includes Jest, but verify it's working
4. **Run a simple test** - Try the `test-utils.test.js` file first to verify Jest works

## Manual Verification

Create a simple test file `src/simple.test.js`:
```javascript
test('simple test', () => {
  expect(1 + 1).toBe(2);
});
```

Then run:
```bash
npm test -- simple.test.js
```

If this works, the issue is with the other test files (likely import errors).

