import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async (page, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`http://localhost:5000/records?page=${page}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Fetch records response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch records failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const addRecord = createAsyncThunk(
  'records/addRecord',
  async (recordData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post('http://localhost:5000/records', recordData, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Add record response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Add record failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const recordSlice = createSlice({
  name: 'records',
  initialState: {
    records: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.records = action.payload.records;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.error = null;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(addRecord.fulfilled, (state, action) => {
        state.records.push(action.payload);
      });
  },
});

export default recordSlice.reducer;