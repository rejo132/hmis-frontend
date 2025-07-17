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

  // Mock metrics for new features
  const metrics = {
    appointmentsToday: appointments.length,
    newPatients: patients.filter((p) => new Date(p.dob).getFullYear() === new Date().getFullYear()).length,
    labResultsPending: records.filter((r) => !r.results).length,
    revenue: `KES ${bills.reduce((sum, b) => sum + (b.payment_status === 'Paid' ? parseFloat(b.amount) : 0), 0).toLocaleString()}`,
    availableBeds: 50 - (patients.length % 50), // Mock
    equipmentInUse: Math.floor(Math.random() * 10), // Mock
    lowStockItems: Math.floor(Math.random() * 5), // Mock
  };

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
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {user && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Welcome, {user.username} ({user.role})</h3>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h4 className="font-bold">Appointments Today</h4>
              <p className="text-2xl">{metrics.appointmentsToday}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h4 className="font-bold">New Patients</h4>
              <p className="text-2xl">{metrics.newPatients}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h4 className="font-bold">Lab Results Pending</h4>
              <p className="text-2xl">{metrics.labResultsPending}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h4 className="font-bold">Revenue</h4>
              <p className="text-2xl">{metrics.revenue}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h4 className="font-bold">Available Beds</h4>
              <p className="text-2xl">{metrics.availableBeds}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h4 className="font-bold">Equipment in Use</h4>
              <p className="text-2xl">{metrics.equipmentInUse}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h4 className="font-bold">Low Stock Items</h4>
              <p className="text-2xl">{metrics.lowStockItems}</p>
            </div>
          </div>

          {/* Navigation Links */}
          {user.role === 'Admin' && (
            <div className="mb-6 flex flex-wrap space-x-4">
              <NavLink to="/patients/new" className="text-blue-500 hover:underline">Add Patient</NavLink>
              <NavLink to="/appointments/new" className="text-blue-500 hover:underline">Add Appointment</NavLink>
              <NavLink to="/bills/new" className="text-blue-500 hover:underline">Add Bill</NavLink>
              <NavLink to="/employees" className="text-blue-500 hover:underline">Manage Employees</NavLink>
              <NavLink to="/beds" className="text-blue-500 hover:underline">Manage Beds</NavLink>
              <NavLink to="/assets" className="text-blue-500 hover:underline">Manage Assets</NavLink>
              <NavLink to="/inventory" className="text-blue-500 hover:underline">Manage Inventory</NavLink>
            </div>
          )}
          {(user.role === 'Admin' || user.role === 'Doctor') && (
            <div className="mb-6 flex flex-wrap space-x-4">
              <NavLink to="/records/new" className="text-blue-500 hover:underline">Add Record</NavLink>
              <NavLink to="/lab-orders" className="text-blue-500 hover:underline">Order Lab Test</NavLink>
              <NavLink to="/radiology" className="text-blue-500 hover:underline">Order Radiology</NavLink>
            </div>
          )}
          <NavLink to="/reports" className="text-blue-500 hover:underline mb-6 block">View Reports</NavLink>
          <NavLink to="/communications" className="text-blue-500 hover:underline mb-6 block">Communication Settings</NavLink>

          {/* Patients Table */}
          {user.role === 'Admin' && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Patients</h4>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">DOB</th>
                    <th className="border p-2">Contact</th>
                    <th className="border p-2">Address</th>
                    <th className="border p-2">Medical History</th>
                    <th className="border p-2">Allergies</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="border p-2">{patient.id}</td>
                      <td className="border p-2">{patient.name}</td>
                      <td className="border p-2">{patient.dob}</td>
                      <td className="border p-2">{patient.contact}</td>
                      <td className="border p-2">{patient.address}</td>
                      <td className="border p-2">{patient.medical_history}</td>
                      <td className="border p-2">{patient.allergies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination(currentPatientPage, patientPages, setCurrentPatientPage)}
            </div>
          )}

          {/* Appointments Table */}
          {(user.role === 'Admin' || user.role === 'Doctor') && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Appointments</h4>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Patient ID</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="border p-2">{appointment.id}</td>
                      <td className="border p-2">{appointment.patient_id}</td>
                      <td className="border p-2">{appointment.appointment_time}</td>
                      <td className="border p-2">{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination(currentAppointmentPage, appointmentPages, setCurrentAppointmentPage)}
            </div>
          )}

          {/* Records Table */}
          {(user.role === 'Admin' || user.role === 'Doctor' || user.role === 'Nurse') && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Records</h4>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Patient ID</th>
                    <th className="border p-2">Diagnosis</th>
                    <th className="border p-2">Vital Signs</th>
                    <th className="border p-2">Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="border p-2">{record.id}</td>
                      <td className="border p-2">{record.patient_id}</td>
                      <td className="border p-2">{record.diagnosis}</td>
                      <td className="border p-2">{record.vital_signs}</td>
                      <td className="border p-2">{record.prescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination(currentRecordPage, recordPages, setCurrentRecordPage)}
            </div>
          )}

          {/* Bills Table */}
          {user.role === 'Admin' && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Bills</h4>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Patient ID</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id}>
                      <td className="border p-2">{bill.id}</td>
                      <td className="border p-2">{bill.patient_id}</td>
                      <td className="border p-2">{bill.amount}</td>
                      <td className="border p-2">{bill.description}</td>
                      <td className="border p-2">{bill.payment_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination(currentBillPage, billPages, setCurrentBillPage)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;