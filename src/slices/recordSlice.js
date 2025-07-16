import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async (page = 1, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `http://localhost:5000/api/records?page=${page}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch records' });
    }
  }
);

export const addRecord = createAsyncThunk(
  'records/addRecord',
  async (recordData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `http://localhost:5000/api/records`,
        recordData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add record' });
    }
  }
);

const recordSlice = createSlice({
  name: 'records',
  initialState: {
    records: [],
    page: 1,
    pages: 1,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.records = action.payload.records;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch records';
      })
      .addCase(addRecord.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.records.push(action.payload);
      })
      .addCase(addRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add record';
      });
  },
});

export default recordSlice.reducer;