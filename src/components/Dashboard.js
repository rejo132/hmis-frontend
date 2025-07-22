import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { fetchPatients } from '../slices/patientSlice';
import { fetchAppointments } from '../slices/appointmentSlice';
import { fetchRecords } from '../slices/recordSlice';
import { fetchBills } from '../slices/billSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status: authStatus } = useSelector((state) => state.auth);
  const { patients, pages: patientPages } = useSelector((state) => state.patients);
  const { appointments, pages: appointmentPages } = useSelector((state) => state.appointments);
  const { records, pages: recordPages } = useSelector((state) => state.records);
  const { bills, pages: billPages } = useSelector((state) => state.bills);

  const [currentPatientPage, setCurrentPatientPage] = useState(1);
  const [currentAppointmentPage, setCurrentAppointmentPage] = useState(1);
  const [currentRecordPage, setCurrentRecordPage] = useState(1);
  const [currentBillPage, setCurrentBillPage] = useState(1);

  // Enhanced metrics with better calculations
  const metrics = {
    patientsToday: appointments.filter(apt => 
      new Date(apt.appointment_time).toDateString() === new Date().toDateString()
    ).length,
    appointmentsToday: appointments.filter(apt => 
      new Date(apt.appointment_time).toDateString() === new Date().toDateString()
    ).length,
    bedOccupancy: Math.min(Math.round((patients.length / 50) * 100), 100),
    revenueCollected: bills.reduce((sum, b) => sum + (b.payment_status === 'Paid' ? parseFloat(b.amount) : 0), 0),
    revenuePercentage: Math.round((bills.filter(b => b.payment_status === 'Paid').length / Math.max(bills.length, 1)) * 100),
    labResultsPending: records.filter((r) => !r.results).length,
    availableBeds: 50 - (patients.length % 50),
    equipmentInUse: Math.floor(Math.random() * 10),
    lowStockItems: Math.floor(Math.random() * 5),
  };

  // Mock chart data for admissions vs discharges
  const admissionData = [
    { month: 'Jan', admissions: 120, discharges: 110 },
    { month: 'Feb', admissions: 140, discharges: 125 },
    { month: 'Mar', admissions: 180, discharges: 150 },
    { month: 'Apr', admissions: 160, discharges: 170 },
    { month: 'May', admissions: 190, discharges: 180 },
    { month: 'Jun', admissions: 200, discharges: 185 },
  ];

  // Mock department workload data
  const departmentData = [
    { name: 'Cardiology', workload: 85 },
    { name: 'Emergency', workload: 75 },
    { name: 'Neurology', workload: 90 },
    { name: 'Orthopedics', workload: 70 },
  ];

  // Recent activity data
  const recentActivities = [
    { 
      id: 1, 
      date: '07/24/2023', 
      time: '6:03 PM', 
      description: 'Patient Admitted', 
      details: 'Admitted',
      type: 'admission'
    },
    { 
      id: 2, 
      date: '07/24/2023', 
      time: '2:45 PM', 
      description: 'Appointment Scheduled', 
      details: 'J. Smith',
      type: 'appointment'
    },
    { 
      id: 3, 
      date: '07/24/2023', 
      time: '5:45 AM', 
      description: 'Bill Generated', 
      details: 'Discharge',
      type: 'billing'
    },
    { 
      id: 4, 
      date: '07/24/2023', 
      time: '9:00 AM', 
      description: 'Discharge Notification', 
      details: 'Alert',
      type: 'discharge'
    },
  ];

  useEffect(() => {
    if (authStatus === 'succeeded' && user) {
      dispatch(fetchPatients(currentPatientPage));
      dispatch(fetchAppointments(currentAppointmentPage));
      dispatch(fetchRecords(currentRecordPage));
      dispatch(fetchBills(currentBillPage));
    } else if (authStatus !== 'loading') {
      navigate('/login');
    }
  }, [authStatus, user, currentPatientPage, currentAppointmentPage, currentRecordPage, currentBillPage, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderPagination = (currentPage, totalPages, setPage) => {
    return (
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md disabled:opacity-50 hover:bg-white/90 transition-all duration-200"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-medical-100 text-medical-800 rounded-lg font-medium">
          {`Page ${currentPage} of ${totalPages}`}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md disabled:opacity-50 hover:bg-white/90 transition-all duration-200"
        >
          Next
        </button>
      </div>
    );
  };

  const getActivityIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'admission':
        return <svg className={`${iconClass} text-success-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>;
      case 'appointment':
        return <svg className={`${iconClass} text-medical-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>;
      case 'billing':
        return <svg className={`${iconClass} text-warning-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
        </svg>;
      case 'discharge':
        return <svg className={`${iconClass} text-danger-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>;
      default:
        return <svg className={`${iconClass} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6 ml-0 md:ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Hospital Management Dashboard
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Welcome back, {user?.username} ({user?.role})</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {user && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Patients Today */}
            <div className="metric-card bg-gradient-to-br from-medical-50 to-medical-100 border-medical-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-medical-500 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m-9-5.197v.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-medical-800">{metrics.patientsToday}</p>
                      <p className="text-medical-600 font-medium">Patients - Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="metric-card bg-gradient-to-br from-success-50 to-success-100 border-success-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-success-500 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-success-800">{metrics.appointmentsToday}</p>
                      <p className="text-success-600 font-medium">Appointments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bed Occupancy */}
            <div className="metric-card bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-warning-500 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-warning-800">{metrics.bedOccupancy}%</p>
                      <p className="text-warning-600 font-medium">Bed Occupancy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="metric-card bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-800">KES {metrics.revenueCollected.toLocaleString()}</p>
                      <p className="text-indigo-600 font-medium">Revenue Collected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Admissions vs Discharges Chart */}
            <div className="chart-container">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Admissions vs. Discharges</h3>
              <div className="h-64">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Chart axes */}
                  <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7eb" strokeWidth="2"/>
                  <line x1="40" y1="180" x2="380" y2="180" stroke="#e5e7eb" strokeWidth="2"/>
                  
                  {/* Y-axis labels */}
                  <text x="30" y="25" className="text-xs fill-gray-600">200</text>
                  <text x="30" y="65" className="text-xs fill-gray-600">150</text>
                  <text x="30" y="105" className="text-xs fill-gray-600">100</text>
                  <text x="30" y="145" className="text-xs fill-gray-600">50</text>
                  <text x="35" y="185" className="text-xs fill-gray-600">0</text>
                  
                  {/* Data points and lines */}
                  <polyline
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="3"
                    points="60,100 110,80 160,40 210,60 260,30 310,20"
                  />
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    points="60,110 110,90 160,70 210,50 260,40 310,35"
                  />
                  
                  {/* X-axis labels */}
                  <text x="55" y="195" className="text-xs fill-gray-600">Jan</text>
                  <text x="105" y="195" className="text-xs fill-gray-600">Feb</text>
                  <text x="155" y="195" className="text-xs fill-gray-600">Mar</text>
                  <text x="205" y="195" className="text-xs fill-gray-600">Apr</text>
                  <text x="255" y="195" className="text-xs fill-gray-600">May</text>
                  <text x="305" y="195" className="text-xs fill-gray-600">Jun</text>
                </svg>
              </div>
            </div>

            {/* Department Workload Chart */}
            <div className="chart-container">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Department Workload</h3>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={dept.name} className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium text-gray-700">{dept.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-medical-500' :
                          index === 1 ? 'bg-success-500' :
                          index === 2 ? 'bg-warning-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${dept.workload}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-bold text-gray-700">{dept.workload}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="chart-container">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => (
                    <tr key={activity.id} className="activity-item border-b border-gray-100 last:border-b-0">
                      <td className="py-4 px-4 text-gray-600">{activity.date}</td>
                      <td className="py-4 px-4 text-gray-600">{activity.time}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {getActivityIcon(activity.type)}
                          <span className="font-medium text-gray-800">{activity.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`status-badge ${
                          activity.type === 'admission' ? 'status-completed' :
                          activity.type === 'appointment' ? 'status-pending' :
                          activity.type === 'discharge' ? 'status-cancelled' : 'status-pending'
                        }`}>
                          {activity.details}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          {user.role === 'Admin' && (
            <div className="chart-container">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <NavLink to="/patients/new" className="flex flex-col items-center p-4 bg-medical-50 hover:bg-medical-100 rounded-xl transition-all duration-200 group">
                  <div className="p-3 bg-medical-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-medical-700">Add Patient</span>
                </NavLink>
                
                <NavLink to="/appointments/new" className="flex flex-col items-center p-4 bg-success-50 hover:bg-success-100 rounded-xl transition-all duration-200 group">
                  <div className="p-3 bg-success-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-success-700">Schedule</span>
                </NavLink>

                <NavLink to="/bills/new" className="flex flex-col items-center p-4 bg-warning-50 hover:bg-warning-100 rounded-xl transition-all duration-200 group">
                  <div className="p-3 bg-warning-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-warning-700">Add Bill</span>
                </NavLink>

                <NavLink to="/employees" className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-200 group">
                  <div className="p-3 bg-indigo-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5m-2-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-indigo-700">Employees</span>
                </NavLink>

                <NavLink to="/beds" className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 group">
                  <div className="p-3 bg-purple-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-purple-700">Manage Beds</span>
                </NavLink>

                <NavLink to="/reports" className="flex flex-col items-center p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-all duration-200 group">
                  <div className="p-3 bg-pink-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-pink-700">Reports</span>
                </NavLink>
              </div>
            </div>
          )}

          {/* Data Tables Section - Only show if user has permission */}
          {user.role === 'Admin' && (
            <>
              {/* Patients Table */}
              <div className="chart-container">
                <h4 className="text-xl font-bold text-gray-800 mb-6">Recent Patients</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">DOB</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Contact</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Address</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Medical History</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Allergies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.slice(0, 5).map((patient) => (
                        <tr key={patient.id} className="table-row border-b border-gray-100 last:border-b-0">
                          <td className="py-4 px-4 font-medium text-gray-900">{patient.id}</td>
                          <td className="py-4 px-4 text-gray-800">{patient.name}</td>
                          <td className="py-4 px-4 text-gray-600">{patient.dob}</td>
                          <td className="py-4 px-4 text-gray-600">{patient.contact}</td>
                          <td className="py-4 px-4 text-gray-600">{patient.address}</td>
                          <td className="py-4 px-4 text-gray-600">{patient.medical_history}</td>
                          <td className="py-4 px-4 text-gray-600">{patient.allergies}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {renderPagination(currentPatientPage, patientPages, setCurrentPatientPage)}
                </div>
              </div>

              {/* Bills Table */}
              <div className="chart-container">
                <h4 className="text-xl font-bold text-gray-800 mb-6">Recent Bills</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Patient ID</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Description</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.slice(0, 5).map((bill) => (
                        <tr key={bill.id} className="table-row border-b border-gray-100 last:border-b-0">
                          <td className="py-4 px-4 font-medium text-gray-900">{bill.id}</td>
                          <td className="py-4 px-4 text-gray-800">{bill.patient_id}</td>
                          <td className="py-4 px-4 font-medium text-gray-900">KES {parseFloat(bill.amount).toLocaleString()}</td>
                          <td className="py-4 px-4 text-gray-600">{bill.description}</td>
                          <td className="py-4 px-4">
                            <span className={`status-badge ${
                              bill.payment_status === 'Paid' ? 'status-completed' :
                              bill.payment_status === 'Pending' ? 'status-pending' : 'status-cancelled'
                            }`}>
                              {bill.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {renderPagination(currentBillPage, billPages, setCurrentBillPage)}
                </div>
              </div>
            </>
          )}

          {/* Appointments Table */}
          {(user.role === 'Admin' || user.role === 'Doctor') && (
            <div className="chart-container">
              <h4 className="text-xl font-bold text-gray-800 mb-6">Today's Appointments</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Patient ID</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Time</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((appointment) => (
                      <tr key={appointment.id} className="table-row border-b border-gray-100 last:border-b-0">
                        <td className="py-4 px-4 font-medium text-gray-900">{appointment.id}</td>
                        <td className="py-4 px-4 text-gray-800">{appointment.patient_id}</td>
                        <td className="py-4 px-4 text-gray-600">{appointment.appointment_time}</td>
                        <td className="py-4 px-4">
                          <span className={`status-badge ${
                            appointment.status === 'Completed' ? 'status-completed' :
                            appointment.status === 'Scheduled' ? 'status-pending' : 'status-cancelled'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination(currentAppointmentPage, appointmentPages, setCurrentAppointmentPage)}
              </div>
            </div>
          )}

          {/* Records Table */}
          {(user.role === 'Admin' || user.role === 'Doctor' || user.role === 'Nurse') && (
            <div className="chart-container">
              <h4 className="text-xl font-bold text-gray-800 mb-6">Recent Medical Records</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Patient ID</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Diagnosis</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Vital Signs</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Prescription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.slice(0, 5).map((record) => (
                      <tr key={record.id} className="table-row border-b border-gray-100 last:border-b-0">
                        <td className="py-4 px-4 font-medium text-gray-900">{record.id}</td>
                        <td className="py-4 px-4 text-gray-800">{record.patient_id}</td>
                        <td className="py-4 px-4 text-gray-600">{record.diagnosis}</td>
                        <td className="py-4 px-4 text-gray-600">{record.vital_signs}</td>
                        <td className="py-4 px-4 text-gray-600">{record.prescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination(currentRecordPage, recordPages, setCurrentRecordPage)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;