import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (page, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`http://localhost:5000/appointments?page=${page}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Fetch appointments response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch appointments failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const scheduleAppointment = createAsyncThunk(
  'appointments/scheduleAppointment',
  async (appointmentData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post('http://localhost:5000/appointments', appointmentData, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Schedule appointment response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Schedule appointment failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload.appointments;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.error = null;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(scheduleAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      });
  },
});

export default appointmentSlice.reducer;