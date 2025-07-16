import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';
import BillForm from './components/BillForm';
import RecordForm from './components/RecordForm';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/patients/new"
          element={user && user.role === 'Admin' ? <PatientForm /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/appointments/new"
          element={user ? <AppointmentForm /> : <Navigate to="/" />}
        />
        <Route
          path="/bills/new"
          element={user && user.role === 'Admin' ? <BillForm /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/records/new"
          element={user && (user.role === 'Doctor' || user.role === 'Nurse') ? <RecordForm /> : <Navigate to="/dashboard" />}
        />
      </Routes>
    </Router>
  );
};

export default App;