import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (page, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`http://localhost:5000/patients?page=${page}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Fetch patients response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch patients failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const addPatient = createAsyncThunk(
  'patients/addPatient',
  async (patientData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post('http://localhost:5000/patients', patientData, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Add patient response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Add patient failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`http://localhost:5000/patients/${id}`, patientData, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token || ''}`,
        },
      });
      console.log('Update patient response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Update patient failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload.patients;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.error = null;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      });
  },
});

export default patientSlice.reducer;