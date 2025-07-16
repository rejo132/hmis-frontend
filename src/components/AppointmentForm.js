import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPatients } from '../slices/patientSlice';
import { scheduleAppointment } from '../slices/appointmentSlice';

const AppointmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector((state) => state.patients);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_time: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchPatients(1));
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(scheduleAppointment(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to schedule appointment:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Schedule Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="patient_id">
              Patient
            </label>
            <select
              id="patient_id"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="appointment_time">
              Appointment Time
            </label>
            <input
              id="appointment_time"
              name="appointment_time"
              type="datetime-local"
              value={formData.appointment_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;