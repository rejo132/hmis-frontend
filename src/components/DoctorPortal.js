import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';

const DoctorPortal = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (user && (user.role === 'Admin' || user.role === 'Doctor')) {
      // Fetch patients
      fetch('http://localhost:5000/patients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setPatients(data.patients);
          toast.success('Patients Loaded');
        })
        .catch((err) => toast.error('Failed to load patients'));

      // Fetch appointments
      fetch('http://localhost:5000/appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAppointments(data.appointments);
          toast.success('Appointments Loaded');
        })
        .catch((err) => toast.error('Failed to load appointments'));

      // Fetch records
      fetch('http://localhost:5000/records', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setRecords(data.records);
          toast.success('Records Loaded');
        })
        .catch((err) => toast.error('Failed to load records'));
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, navigate]);

  const handleReviewTest = (recordId) => {
    toast.success(`Review Initiated for Record ${recordId}`);
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Doctor Portal</h2>
      <div className="mb-8">
        <NavLink to="/records/new" className="btn-primary inline-flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Note
        </NavLink>
      </div>
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4">Patient Cases</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left">Patient ID</th>
                <th className="border border-gray-200 p-3 text-left">Name</th>
                <th className="border border-gray-200 p-3 text-left">Diagnosis</th>
                <th className="border border-gray-200 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) =>
                records
                  .filter((r) => r.patient_id === patient.id)
                  .map((record, index) => (
                    <tr key={`${patient.id}-${record.id}`} className={`table-row ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="border border-gray-200 p-3">{patient.id}</td>
                      <td className="border border-gray-200 p-3">{patient.name}</td>
                      <td className="border border-gray-200 p-3">{record.diagnosis}</td>
                      <td className="border border-gray-200 p-3">
                        <button
                          onClick={() => handleReviewTest(record.id)}
                          className="btn-primary"
                        >
                          Review Test
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left">ID</th>
                <th className="border border-gray-200 p-3 text-left">Patient ID</th>
                <th className="border border-gray-200 p-3 text-left">Time</th>
                <th className="border border-gray-200 p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id} className={`table-row ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="border border-gray-200 p-3">{appt.id}</td>
                  <td className="border border-gray-200 p-3">{appt.patient_id}</td>
                  <td className="border border-gray-200 p-3">{appt.appointment_time}</td>
                  <td className="border border-gray-200 p-3">{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortal;