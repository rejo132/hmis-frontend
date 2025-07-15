import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createBill = createAsyncThunk(
  'bills/createBill',
  async (billData, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/bills`,
      billData,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

export const updateBill = createAsyncThunk(
  'bills/updateBill',
  async ({ id, billData }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/bills/${id}`,
      billData,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

const billSlice = createSlice({
  name: 'bills',
  initialState: { error: null },
  reducers: {},
  extraReducers: {
    [createBill.fulfilled]: (state) => {
      state.error = null;
    },
    [createBill.rejected]: (state, action) => {
      state.error = action.payload?.error || action.error.message;
    },
    [updateBill.fulfilled]: (state) => {
      state.error = null;
    },
    [updateBill.rejected]: (state, action) => {
      state.error = action.payload?.error || action.error.message;
    },
  },
});

export default billSlice.reducer;
