import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPatients } from '../slices/patientSlice';
import { fetchAppointments } from '../slices/appointmentSlice';
import { fetchBills } from '../slices/billSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { patients, page, pages } = useSelector((state) => state.patients);
  const { appointments } = useSelector((state) => state.appointments);
  const { bills } = useSelector((state) => state.bills);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPatients(page));
    dispatch(fetchAppointments(page));
    if (user.role === 'Admin') {
      dispatch(fetchBills(page));
    }
  }, [dispatch, page, user.role]);

  const handlePageChange = (newPage) => {
    dispatch(fetchPatients(newPage));
    dispatch(fetchAppointments(newPage));
    if (user.role === 'Admin') {
      dispatch(fetchBills(newPage));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {user.role === 'Admin' && (
        <button
          onClick={() => navigate('/patients/add')}
          className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Patient
        </button>
      )}
      <button
        onClick={() => navigate('/appointments/add')}
        className="mb-4 ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Schedule Appointment
      </button>
      {user.role === 'Doctor' && (
        <button
          onClick={() => navigate('/records/add')}
          className="mb-4 ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Medical Record
        </button>
      )}
      {user.role === 'Admin' && (
        <button
          onClick={() => navigate('/bills/add')}
          className="mb-4 ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Generate Bill
        </button>
      )}

      <h2 className="text-2xl font-bold mb-4">Patients</h2>
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">DOB</th>
            <th className="p-2 border">Contact</th>
            {user.role === 'Admin' && <th className="p-2 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="p-2 border">{patient.name}</td>
              <td className="p-2 border">{patient.dob}</td>
              <td className="p-2 border">{patient.contact}</td>
              {user.role === 'Admin' && (
                <td className="p-2 border">
                  <button
                    onClick={() => navigate(`/patients/edit/${patient.id}`)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="mr-2 p-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pages}
          className="ml-2 p-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <table className="w-full mb-6 border-collapse">
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

      {user.role === 'Admin' && (
        <>
          <h2 className="text-2xl font-bold mb-4">Bills</h2>
          <table className="w-full border-collapse">
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
        </>
      )}
    </div>
  );
};

export default Dashboard;