import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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