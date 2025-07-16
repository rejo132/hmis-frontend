import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPatients } from '../slices/patientSlice';
import { fetchAppointments } from '../slices/appointmentSlice';
import { fetchBills } from '../slices/billSlice';
import { fetchRecords } from '../slices/recordSlice';
import { logout } from '../slices/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { patients, page: patientPage, pages: patientPages } = useSelector((state) => state.patients);
  const { appointments, page: appointmentPage, pages: appointmentPages } = useSelector((state) => state.appointments);
  const { bills, page: billPage, pages: billPages } = useSelector((state) => state.bills);
  const { records } = useSelector((state) => state.records);

  useEffect(() => {
    dispatch(fetchPatients(patientPage));
    dispatch(fetchAppointments(appointmentPage));
    dispatch(fetchBills(billPage));
    dispatch(fetchRecords());
  }, [dispatch, patientPage, appointmentPage, billPage]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mb-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      {user.role === 'Admin' && (
        <>
          <Link to="/patients/add">
            <button className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Add Patient
            </button>
          </Link>
          <Link to="/appointments/add">
            <button className="mb-4 ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Schedule Appointment
            </button>
          </Link>
          <Link to="/bills/add">
            <button className="mb-4 ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Generate Bill
            </button>
          </Link>
          <h2 className="text-2xl font-bold mb-4">Patients</h2>
          <table className="w-full mb-6 border-collapse" aria-label="Patients">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">DOB</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="p-2 border">{patient.name}</td>
                  <td className="p-2 border">{patient.dob}</td>
                  <td className="p-2 border">{patient.contact}</td>
                  <td className="p-2 border">
                    <Link to={`/patients/edit/${patient.id}`}>
                      <button className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-6">
            <button
              onClick={() => dispatch(fetchPatients(patientPage - 1))}
              disabled={patientPage === 1}
              className="mr-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {patientPage} of {patientPages}</span>
            <button
              onClick={() => dispatch(fetchPatients(patientPage + 1))}
              disabled={patientPage === patientPages}
              className="ml-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Appointments</h2>
          <table className="w-full mb-6 border-collapse" aria-label="Appointments">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="p-2 border">{appointment.patient_name}</td>
                  <td className="p-2 border">{appointment.appointment_time}</td>
                  <td className="p-2 border">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-6">
            <button
              onClick={() => dispatch(fetchAppointments(appointmentPage - 1))}
              disabled={appointmentPage === 1}
              className="mr-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {appointmentPage} of {appointmentPages}</span>
            <button
              onClick={() => dispatch(fetchAppointments(appointmentPage + 1))}
              disabled={appointmentPage === appointmentPages}
              className="ml-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Bills</h2>
          <table className="w-full border-collapse" aria-label="Bills">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td className="p-2 border">{bill.patient_name}</td>
                  <td className="p-2 border">{bill.amount}</td>
                  <td className="p-2 border">{bill.description}</td>
                  <td className="p-2 border">{bill.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-6">
            <button
              onClick={() => dispatch(fetchBills(billPage - 1))}
              disabled={billPage === 1}
              className="mr-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {billPage} of {billPages}</span>
            <button
              onClick={() => dispatch(fetchBills(billPage + 1))}
              disabled={billPage === billPages}
              className="ml-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
      {(user.role === 'Doctor' || user.role === 'Nurse') && (
        <>
          <Link to="/appointments/add">
            <button className="mb-4 ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Schedule Appointment
            </button>
          </Link>
          {user.role === 'Doctor' && (
            <Link to="/records/add">
              <button className="mb-4 ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Add Medical Record
              </button>
            </Link>
          )}
          <h2 className="text-2xl font-bold mb-4">Patients</h2>
          <table className="w-full mb-6 border-collapse" aria-label="Patients">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">DOB</th>
                <th className="p-2 border">Contact</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="p-2 border">{patient.name}</td>
                  <td className="p-2 border">{patient.dob}</td>
                  <td className="p-2 border">{patient.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-6">
            <button
              onClick={() => dispatch(fetchPatients(patientPage - 1))}
              disabled={patientPage === 1}
              className="mr-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {patientPage} of {patientPages}</span>
            <button
              onClick={() => dispatch(fetchPatients(patientPage + 1))}
              disabled={patientPage === patientPages}
              className="ml-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Appointments</h2>
          <table className="w-full mb-6 border-collapse" aria-label="Appointments">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="p-2 border">{appointment.patient_name}</td>
                  <td className="p-2 border">{appointment.appointment_time}</td>
                  <td className="p-2 border">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-6">
            <button
              onClick={() => dispatch(fetchAppointments(appointmentPage - 1))}
              disabled={appointmentPage === 1}
              className="mr-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {appointmentPage} of {appointmentPages}</span>
            <button
              onClick={() => dispatch(fetchAppointments(appointmentPage + 1))}
              disabled={appointmentPage === appointmentPages}
              className="ml-2 p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Medical Records</h2>
          <table className="w-full border-collapse" aria-label="Medical Records">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Diagnosis</th>
                <th className="p-2 border">Prescription</th>
                <th className="p-2 border">Vital Signs</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="p-2 border">{record.patient_name}</td>
                  <td className="p-2 border">{record.diagnosis}</td>
                  <td className="p-2 border">{record.prescription}</td>
                  <td className="p-2 border">{record.vital_signs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Dashboard;