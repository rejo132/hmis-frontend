import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (page = 1, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/appointments?page=${page}`,
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

export const scheduleAppointment = createAsyncThunk(
  'appointments/scheduleAppointment',
  async (appointmentData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments`,
        appointmentData,
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

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    page: 1,
    pages: 1,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload.appointments;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(scheduleAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(scheduleAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments.push(action.payload);
      })
      .addCase(scheduleAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  },
});

export default appointmentSlice.reducer;