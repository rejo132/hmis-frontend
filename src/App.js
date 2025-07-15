import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';
import RecordForm from './components/RecordForm';
import BillForm from './components/BillForm';
import { logout } from './slices/authSlice';

const App = () => {
  const { token, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-100">
      {token && (
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-white text-2xl">HMIS</h1>
            <button onClick={() => dispatch(logout())} className="text-white">Logout</button>
          </div>
        </nav>
      )}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard">
          {token ? <Dashboard role={role} /> : <Redirect to="/login" />}
        </Route>
        <Route path="/patient/new">
          {token && role === 'Admin' ? <PatientForm /> : <Redirect to="/login" />}
        </Route>
        <Route path="/appointment/new">
          {token && role === 'Admin' ? <AppointmentForm /> : <Redirect to="/login" />}
        </Route>
        <Route path="/record/new">
          {token && role === 'Doctor' ? <RecordForm /> : <Redirect to="/login" />}
        </Route>
        <Route path="/bill/new">
          {token && role === 'Admin' ? <BillForm /> : <Redirect to="/login" />}
        </Route>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
      </Switch>
    </div>
  );
};

export default App;