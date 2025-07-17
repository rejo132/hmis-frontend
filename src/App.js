import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';
import BillForm from './components/BillForm';
import RecordForm from './components/RecordForm';

const App = () => {
  const { user, status } = useSelector((state) => state.auth || {});
  console.log('App.js: user=', user, 'authStatus=', status); // Debug log

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/"
            element={status === 'succeeded' && user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={status === 'succeeded' && user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/patients/new"
            element={status === 'succeeded' && user && user.role === 'Admin' ? <PatientForm /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/appointments/new"
            element={status === 'succeeded' && user ? <AppointmentForm /> : <Navigate to="/" />}
          />
          <Route
            path="/bills/new"
            element={status === 'succeeded' && user && user.role === 'Admin' ? <BillForm /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/records/new"
            element={status === 'succeeded' && user && (user.role === 'Admin' || user.role === 'Doctor') ? <RecordForm /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;