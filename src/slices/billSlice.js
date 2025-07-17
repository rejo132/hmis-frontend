import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBills = createAsyncThunk(
  'bills/fetchBills',
  async (page, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`http://localhost:5000/bills?page=${page}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Fetch bills response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch bills failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createBill = createAsyncThunk(
  'bills/createBill',
  async (billData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post('http://localhost:5000/bills', billData, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Create bill response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Create bill failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const billSlice = createSlice({
  name: 'bills',
  initialState: {
    bills: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills = action.payload.bills;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.error = null;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.bills.push(action.payload);
      });
  },
});

export default billSlice.reducer;