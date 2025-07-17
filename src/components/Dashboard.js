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
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
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

          {/* Navigation Links */}
          {user.role === 'Admin' && (
            <div className="mb-6 flex space-x-4">
              <NavLink to="/patients/new" className="text-blue-500 hover:underline">Add Patient</NavLink>
              <NavLink to="/appointments/new" className="text-blue-500 hover:underline">Add Appointment</NavLink>
              <NavLink to="/bills/new" className="text-blue-500 hover:underline">Add Bill</NavLink>
            </div>
          )}
          {(user.role === 'Admin' || user.role === 'Doctor') && (
            <NavLink to="/records/new" className="text-blue-500 hover:underline mb-6 block">Add Record</NavLink>
          )}

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
                    <th className ="border p-2">Description</th>
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