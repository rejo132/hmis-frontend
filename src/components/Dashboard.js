import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPatients } from '../slices/patientSlice';
import { fetchAppointments } from '../slices/appointmentSlice';

const Dashboard = ({ role }) => {
  const dispatch = useDispatch();
  const { patients, total, pages, error: patientError } = useSelector((state) => state.patients);
  const { appointments, error: appointmentError } = useSelector((state) => state.appointments);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchPatients({ page }));
    dispatch(fetchAppointments({ page }));
  }, [page, dispatch]);

  const handleSearch = () => {
    // Implement search logic if needed (e.g., filter patients by name)
    dispatch(fetchPatients({ page: 1 }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Dashboard ({role})</h2>
      {(patientError || appointmentError) && (
        <p className="text-red-500">{patientError || appointmentError}</p>
      )}
      {role === 'Admin' && (
        <div className="mb-8">
          <Link to="/patient/new" className="bg-blue-600 text-white p-2 rounded mr-2">
            Add Patient
          </Link>
          <Link to="/appointment/new" className="bg-blue-600 text-white p-2 rounded mr-2">
            Schedule Appointment
          </Link>
          <Link to="/bill/new" className="bg-blue-600 text-white p-2 rounded">
            Create Bill
          </Link>
        </div>
      )}
      {role === 'Doctor' && (
        <div className="mb-8">
          <Link to="/record/new" className="bg-blue-600 text-white p-2 rounded">
            Add Medical Record
          </Link>
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl mb-2">Patients</h3>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white p-2 rounded">
          Search
        </button>
        <ul>
          {patients.map((patient) => (
            <li key={patient.id} className="p-2 border-b">
              {patient.name} - {patient.dob} - {patient.contact}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-blue-600 text-white p-2 rounded mr-2"
          >
            Previous
          </button>
          <span>Page {page} of {pages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            disabled={page === pages}
            className="bg-blue-600 text-white p-2 rounded ml-2"
          >
            Next
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl mb-2">Appointments</h3>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} className="p-2 border-b">
              Patient ID: {appointment.patient_id}, Doctor ID: {appointment.doctor_id}, Time: {appointment.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;