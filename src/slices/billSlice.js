import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createBill = createAsyncThunk(
  'bills/createBill',
  async (billData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/bills`,
        billData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBill = createAsyncThunk(
  'bills/updateBill',
  async ({ id, payment_status }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/bills/${id}`,
        { payment_status },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBills = createAsyncThunk(
  'bills/fetchBills',
  async (page = 1, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/bills?page=${page}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const billSlice = createSlice({
  name: 'bills',
  initialState: {
    bills: [],
    page: 1,
    pages: 1,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBill.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(updateBill.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.bills.findIndex((bill) => bill.id === action.payload.id);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(fetchBills.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills = action.payload.bills;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  },
});

export default billSlice.reducer;