import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import recordReducer from './slices/recordSlice';
import billReducer from './slices/billSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
    records: recordReducer,
    bills: billReducer,
  },
});

export default store;