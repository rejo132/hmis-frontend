import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async ({ page }, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/appointments?page=${page}`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

export const scheduleAppointment = createAsyncThunk(
  'appointments/scheduleAppointment',
  async (appointmentData, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/appointments`,
      appointmentData,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    total: 0,
    pages: 0,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchAppointments.fulfilled]: (state, action) => {
      state.appointments = action.payload.appointments;
      state.total = action.payload.total;
      state.pages = action.payload.pages;
      state.error = null;
    },
    [fetchAppointments.rejected]: (state, action) => {
      state.error = action.payload?.error || action.error.message;
    },
    [scheduleAppointment.fulfilled]: (state) => {
      state.error = null;
    },
    [scheduleAppointment.rejected]: (state, action) => {
      state.error = action.payload?.error || action.error.message;
    },
  },
});

export default appointmentSlice.reducer;
