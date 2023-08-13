import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    token: localStorage.getItem('token') || null,
    role: null,
    isVerified: false
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { token, role, isVerified } = action.payload;
      state.user = {
        token,
        role,
        isVerified,
      };
      localStorage.setItem('token', token); 
    },
    clearUser: (state) => {
      state.user = {
        token: null,
        role: null,
        isVerified: false
      };
      localStorage.removeItem('token'); 
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

