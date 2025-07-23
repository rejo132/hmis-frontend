// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
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
      } else if (role === 'Lab Tech') {
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
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const role = user.role;
      if (role === 'Admin') {
        navigate('/dashboard');
      } else if (role === 'Patient') {
        navigate('/patient-portal');
      } else if (role === 'Doctor') {
        navigate('/doctor-portal');
      } else if (role === 'Nurse') {
        navigate('/vitals');
      } else if (role === 'Lab Tech') {
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
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-warning-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      {/* Centered Login Card Only */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 flex items-center justify-center">
        <div className="w-full">
          <div className="glass-card p-8 space-y-6 shadow-2xl rounded-2xl border border-white/20 backdrop-blur-lg bg-white/20 dark:bg-gray-900/30">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                  <p className="text-gray-600 dark:text-gray-400">Sign in to continue to your dashboard</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Username</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your username"
                        required
                        aria-label="Username"
                      />
                    </div>
                  </div>
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your password"
                        required
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                      Forgot password?
                    </button>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>
            {/* Demo Credentials - visually distinct */}
            <details className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-inner" open>
              <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">Demo Credentials</summary>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Admin:</span> admin/admin123
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Doctor:</span> doctor/doctor123
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Nurse:</span> nurse/nurse123
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Patient:</span> patient/patient123
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Lab:</span> lab/lab123
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Billing:</span> billing/billing123
                      </p>
                    </div>
                  </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
