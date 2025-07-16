import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';
import RecordForm from './components/RecordForm';
import BillForm from './components/BillForm';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/patients/add"
          element={
            user && user.role === 'Admin' ? (
              <PatientForm />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/patients/edit/:id"
          element={
            user && user.role === 'Admin' ? (
              <PatientForm />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/appointments/add"
          element={user ? <AppointmentForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/records/add"
          element={
            user && user.role === 'Doctor' ? (
              <RecordForm />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/bills/add"
          element={
            user && user.role === 'Admin' ? (
              <BillForm />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;