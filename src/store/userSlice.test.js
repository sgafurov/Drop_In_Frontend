import userSlice, {
  setUserInfo,
  setUsername,
  setEmail,
  setIsLoggedIn,
  logoutUser,
} from './userSlice';

describe('userSlice', () => {
  const initialState = {
    _id: '',
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    address: '',
    user_type: '',
    isLoggedIn: false,
  };

  test('should return initial state', () => {
    expect(userSlice(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle setUserInfo', () => {
    const userData = {
      _id: '123',
      username: 'testuser',
      email: 'test@test.com',
      firstname: 'Test',
      lastname: 'User',
      address: '123 Test St',
      user_type: 'tenant',
    };

    const actual = userSlice(initialState, setUserInfo(userData));
    
    expect(actual).toEqual({
      ...userData,
      isLoggedIn: true,
    });
  });

  test('should handle setUsername', () => {
    const actual = userSlice(initialState, setUsername('newusername'));
    expect(actual.username).toBe('newusername');
  });

  test('should handle setEmail', () => {
    const actual = userSlice(initialState, setEmail('newemail@test.com'));
    expect(actual.email).toBe('newemail@test.com');
  });

  test('should handle setIsLoggedIn', () => {
    const actual = userSlice(initialState, setIsLoggedIn({ isLoggedIn: true }));
    expect(actual.isLoggedIn).toBe(true);
  });

  test('should handle logoutUser', () => {
    const loggedInState = {
      _id: '123',
      username: 'testuser',
      email: 'test@test.com',
      firstname: 'Test',
      lastname: 'User',
      address: '123 Test St',
      user_type: 'tenant',
      isLoggedIn: true,
    };

    const actual = userSlice(loggedInState, logoutUser());
    expect(actual).toEqual(initialState);
  });
});

