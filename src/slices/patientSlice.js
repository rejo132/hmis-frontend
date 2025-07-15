import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async ({ page }, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/patients?page=${page}`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

export const addPatient = createAsyncThunk(
  'patients/addPatient',
  async (patientData, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/patients`,
      patientData,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/patients/${id}`,
      patientData,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    total: 0,
    pages: 0,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchPatients.fulfilled]: (state, action) => {
      state.patients = action.payload.patients;
      state.total = action.payload.total;
      state.pages = action.payload.pages;
      state.error = null;
    },
    [fetchPatients.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [addPatient.fulfilled]: (state) => {
      state.error = null;
    },
    [addPatient.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [updatePatient.fulfilled]: (state) => {
      state.error = null;
    },
    [updatePatient.rejected]: (state, action) => {
      state.error = action.error.message;
    },
  },
});

export default patientSlice.reducer;
