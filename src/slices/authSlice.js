import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(${process.env.REACT_APP_API_URL}/login, { username, password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk('auth/register', async ({ username, password, role }, { rejectWithValue }) => {
  try {
    const response = await axios.post(${process.env.REACT_APP_API_URL}/register, { username, password, role });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, role: null, error: null },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
    }
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.error = null;
    },
    [login.rejected]: (state, action) => {
      state.error = action.payload.error;
    },
    [register.fulfilled]: (state) => {
      state.error = null;
    },
    [register.rejected]: (state, action) => {
      state.error = action.payload.error;
    }
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;