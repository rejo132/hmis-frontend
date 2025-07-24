// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../slices/authSlice';
import toast from 'react-hot-toast';
import Register from './Register';
import { Typewriter } from 'react-simple-typewriter';

// LiveClock component
const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n) => n.toString().padStart(2, '0');
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const date = now.toLocaleDateString();
  return (
    <div className="text-right text-xs text-white/80 font-mono mb-2 select-none">
      <span>{date} </span>
      <span>
        {hours}
        <span className="animate-blink">:</span>
        {minutes}
        <span className="animate-blink">:</span>
        {seconds}
      </span>
    </div>
  );
};

// Add animated gradient CSS
const animatedGradientStyle = {
  background: 'linear-gradient(270deg, #1e3a8a, #2563eb, #9333ea, #f59e42, #1e3a8a)',
  backgroundSize: '1200% 1200%',
  animation: 'gradientMove 16s ease infinite',
};

// Role selector data
const roles = [
  { key: 'Admin', label: 'Admin', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2h16v-2c0-2.663-5.33-4-8-4z" /></svg> },
  { key: 'Doctor', label: 'Doctor', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7a4 4 0 118 0v4a4 4 0 11-8 0V7zm8 8a4 4 0 01-8 0" /></svg> },
  { key: 'Nurse', label: 'Nurse', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7" /></svg> },
  { key: 'Lab Tech', label: 'Lab', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 018 0v2M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2h-2a2 2 0 00-2-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 00-2 2H5a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg> },
  { key: 'Receptionist', label: 'Reception', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { key: 'Patient', label: 'Patient', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 018 0v2" /></svg> },
  { key: 'Billing', label: 'Billing', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin', // Default role for login
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={animatedGradientStyle}>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blink { animation: blink 1s steps(2, start) infinite; }
        @keyframes blink { to { visibility: hidden; } }
      `}</style>
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-warning-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      {/* Main Content: Responsive Two-Column Layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left Side - Branding & Welcome + Hero Animation */}
        <div className="flex-1 text-center lg:text-left space-y-8 mb-10 lg:mb-0 flex flex-col items-center lg:items-start">
          {/* Hero SVG Animation */}
          <div className="mb-2">
            {/* Example: animated heartbeat SVG */}
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,20 10,20 15,10 25,30 35,5 45,35 55,15 65,25 70,20 80,20" stroke="#fff" strokeWidth="3" fill="none">
                <animate attributeName="points" dur="2s" repeatCount="indefinite"
                  values="0,20 10,20 15,10 25,30 35,5 45,35 55,15 65,25 70,20 80,20;
                          0,20 10,20 15,30 25,10 35,35 45,5 55,25 65,15 70,20 80,20;
                          0,20 10,20 15,10 25,30 35,5 45,35 55,15 65,25 70,20 80,20" />
              </polyline>
            </svg>
          </div>
          {/* Typing Effect Welcome */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mt-4">
            <Typewriter words={["Welcome to MediCure"]} loop={false} cursor cursorStyle="_" typeSpeed={70} deleteSpeed={50} delaySpeed={1000} />
          </h1>
          <p className="text-lg text-white/80 max-w-lg mx-auto lg:mx-0">
            Advanced healthcare management platform designed to streamline hospital operations and enhance patient care.
          </p>
        </div>
        {/* Right Side - Login/Register Card */}
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto">
          {/* Live Clock */}
          <LiveClock />
          <div className="glass-card p-8 space-y-6 shadow-2xl rounded-2xl border border-white/20 backdrop-blur-lg bg-white/20 dark:bg-gray-900/30 w-full">
            {/* Tabs for Login/Register */}
            <div className="flex justify-center mb-6">
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition-all ${!showRegister ? 'bg-primary-600 text-white shadow' : 'bg-white/30 text-primary-700'}`}
                onClick={() => setShowRegister(false)}
              >
                Login
              </button>
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition-all ${showRegister ? 'bg-primary-600 text-white shadow' : 'bg-white/30 text-primary-700'}`}
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
            {/* Role Selector (only for login) */}
            {!showRegister && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {roles.map((role) => (
                  <button
                    key={role.key}
                    type="button"
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full border transition-all text-xs font-semibold ${formData.role === role.key ? 'bg-primary-600 text-white border-primary-700 shadow' : 'bg-white/30 text-primary-700 border-primary-200 hover:bg-primary-100'}`}
                    onClick={() => setFormData({ ...formData, role: role.key })}
                  >
                    {role.icon}
                    <span>{role.label}</span>
                  </button>
                ))}
              </div>
            )}
            {/* Login Form */}
            {!showRegister && (
              <>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
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
              </>
            )}
            {/* Register Form - styled like login card */}
            {showRegister && (
              <div className="w-full">
                <Register />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
