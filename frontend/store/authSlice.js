import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the authentication slice.
 * @type {{user: Object|null, token: string|null}}
 */
const initialState = {
  user: null,
  token: null,
};

/**
 * Redux slice for managing user authentication state.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
