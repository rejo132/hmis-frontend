import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addRecord = createAsyncThunk(
  'records/addRecord',
  async (recordData, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/records`,
      recordData,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

const recordSlice = createSlice({
  name: 'records',
  initialState: { error: null },
  reducers: {},
  extraReducers: {
    [addRecord.fulfilled]: (state) => {
      state.error = null;
    },
    [addRecord.rejected]: (state, action) => {
      state.error = action.payload?.error || action.error.message;
    },
  },
});

export default recordSlice.reducer;
