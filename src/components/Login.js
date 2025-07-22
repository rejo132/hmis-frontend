// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(formData)).unwrap();
      toast.success('Login successful');
      // Role-based redirect
      const role = result.user.role;
      if (role === 'Admin') {
        navigate('/dashboard');
      } else if (role === 'Patient') {
        navigate('/patient-portal');
      } else if (role === 'Doctor') {
        navigate('/doctor-portal');
      } else if (role === 'Nurse') {
        navigate('/vitals');
      } else if (role === 'Lab') {
        navigate('/lab-orders');
      } else if (role === 'Receptionist') {
        navigate('/reception');
      } else if (role === 'Billing') {
        navigate('/billing');
      } else if (role === 'IT') {
        navigate('/users/roles');
      } else if (role === 'Accountant') {
        navigate('/finance');
      } else if (role === 'Pharmacist') {
        navigate('/inventory');
      } else {
        navigate('/dashboard'); // Fallback
      }
    } catch (err) {
      toast.error(`Login failed: ${err.message || 'Unknown error'}`);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'succeeded' && user) {
      const role = user.role;
      if (role === 'Admin') {
        navigate('/dashboard');
      } else if (role === 'Patient') {
        navigate('/patient-portal');
      } else if (role === 'Doctor') {
        navigate('/doctor-portal');
      } else if (role === 'Nurse') {
        navigate('/vitals');
      } else if (role === 'Lab') {
        navigate('/lab-orders');
      } else if (role === 'Receptionist') {
        navigate('/reception');
      } else if (role === 'Billing') {
        navigate('/billing');
      } else if (role === 'IT') {
        navigate('/users/roles');
      } else if (role === 'Accountant') {
        navigate('/finance');
      } else if (role === 'Pharmacist') {
        navigate('/inventory');
      } else {
        navigate('/dashboard');
      }
    }
  }, [status, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={status === 'loading'}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;