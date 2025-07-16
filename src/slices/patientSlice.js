import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (page = 1, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `http://localhost:5000/api/patients?page=${page}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch patients' });
    }
  }
);

export const addPatient = createAsyncThunk(
  'patients/addPatient',
  async (patientData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `http://localhost:5000/api/patients`,
        patientData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add patient' });
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, ...patientData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `http://localhost:5000/api/patients/${id}`,
        patientData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update patient' });
    }
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    page: 1,
    pages: 1,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload.patients;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch patients';
      })
      .addCase(addPatient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients.push(action.payload);
      })
      .addCase(addPatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add patient';
      })
      .addCase(updatePatient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.patients.findIndex((patient) => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to update patient';
      });
  },
});

export default patientSlice.reducer;