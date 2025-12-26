import addressSlice, { setAddress, setCoords } from './addressSlice';

describe('addressSlice', () => {
  const initialState = {
    address: '',
    lat: null,
    lng: null,
  };

  test('should return initial state', () => {
    expect(addressSlice(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle setAddress', () => {
    const address = '123 Test St, New York, NY';
    const actual = addressSlice(initialState, setAddress(address));
    
    expect(actual.address).toBe(address);
    expect(actual.lat).toBe(null);
    expect(actual.lng).toBe(null);
  });

  test('should handle setCoords', () => {
    const coords = {
      lat: 40.7128,
      lng: -74.0060,
    };
    const actual = addressSlice(initialState, setCoords(coords));
    
    expect(actual.lat).toBe(40.7128);
    expect(actual.lng).toBe(-74.0060);
    expect(actual.address).toBe('');
  });

  test('should handle setAddress and setCoords together', () => {
    let state = addressSlice(initialState, setAddress('123 Test St'));
    state = addressSlice(state, setCoords({ lat: 40.7128, lng: -74.0060 }));
    
    expect(state.address).toBe('123 Test St');
    expect(state.lat).toBe(40.7128);
    expect(state.lng).toBe(-74.0060);
  });
});

