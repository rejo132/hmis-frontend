import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addPatient } from '../slices/patientSlice';
import { scheduleAppointment } from '../slices/appointmentSlice';
import axios from 'axios';

const ReceptionManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { status: patientStatus, error: patientError } = useSelector((state) => state.patients || {});
  const { status: appointmentStatus, error: appointmentError } = useSelector((state) => state.appointments || {});
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    dob: '',
    gender: '',
    appointmentDate: '',
    appointmentTime: '',
    doctorId: '',
  });
  const [queue, setQueue] = useState([]);
  const [checkedIn, setCheckedIn] = useState({});

  useEffect(() => {
    // Allow both Admin and Receptionist roles
    if (user && user.role !== 'Receptionist' && user.role !== 'Admin') {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (patientError) toast.error(`Error: ${patientError}`);
    if (appointmentError) toast.error(`Error: ${appointmentError}`);
  }, [patientError, appointmentError]);

  useEffect(() => {
    async function fetchQueue() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/api/queue', { headers: { Authorization: `Bearer ${token}` } });
        setQueue(res.data.queue);
      } catch (err) {
        // handle error
      }
    }
    fetchQueue();
  }, []);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/api/employees', { headers: { Authorization: `Bearer ${token}` } });
        setDoctors(res.data.employees.filter(e => e.role === 'Doctor'));
      } catch (err) {}
    }
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addPatient({
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender,
        contact: '', // Add default contact
        address: '', // Add default address
        registered_by: user.username,
      })).unwrap();
      // Add to queue
      const token = localStorage.getItem('access_token');
      await axios.post('/api/queue', { patient_id: formData.patientId, name: formData.name }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Patient registered and added to queue');
      setFormData({ ...formData, patientId: '', name: '', dob: '', gender: '' });
    } catch (err) {
      toast.error(`Failed to register patient: ${err}`);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(scheduleAppointment({
        patient_id: parseInt(formData.patientId),
        doctor_id: parseInt(formData.doctorId),
        appointment_time: `${formData.appointmentDate}T${formData.appointmentTime}:00Z`,
        status: 'Scheduled',
        created_by: user.username,
      })).unwrap();
      toast.success('Appointment scheduled successfully');
      setFormData({ ...formData, appointmentDate: '', appointmentTime: '', doctorId: '' });
    } catch (err) {
      toast.error(`Failed to schedule appointment: ${err}`);
    }
  };

  const handleCheckIn = async (patientId) => {
    setCheckedIn((prev) => ({ ...prev, [patientId]: true }));
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('/api/checkin', { patient_id: patientId }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {}
  };

  const handleCheckOut = async (patientId) => {
    setCheckedIn((prev) => ({ ...prev, [patientId]: false }));
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('/api/checkout', { patient_id: patientId }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {}
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Receptionist</span>
        <span className="text-gray-700">Available actions: Register patients, schedule appointments, view check-in/out, access basic patient demographics.</span>
      </div>
      <h2 className="text-2xl font-bold mb-4">Reception Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Register Patient</h3>
          <form onSubmit={handlePatientSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={patientStatus === 'loading'}
            >
              Register Patient
            </button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Schedule Appointment</h3>
          <form onSubmit={handleAppointmentSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="number"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.username}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={appointmentStatus === 'loading'}
            >
              Schedule Appointment
            </button>
          </form>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Patient Queue</h3>
        <ul className="space-y-2">
          {queue.length === 0 ? (
            <li className="text-gray-500">No patients in queue.</li>
          ) : (
            queue.map((patient) => (
              <li key={patient.id} className="flex items-center justify-between p-2 border rounded">
                <span>{patient.name} (ID: {patient.id})</span>
                {checkedIn[patient.id] ? (
                  <button className="btn-secondary ml-2" onClick={() => handleCheckOut(patient.id)}>
                    Check-Out
                  </button>
                ) : (
                  <button className="btn-primary ml-2" onClick={() => handleCheckIn(patient.id)}>
                    Check-In
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReceptionManagement;