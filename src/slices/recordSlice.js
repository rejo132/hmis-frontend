import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async (page = 1, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/records?page=${page}`,
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

export const addRecord = createAsyncThunk(
  'records/addRecord',
  async (recordData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/records`,
        recordData,
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
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.records = action.payload.records;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
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
        state.error = action.payload.message;
      });
  },
});

export default recordSlice.reducer;