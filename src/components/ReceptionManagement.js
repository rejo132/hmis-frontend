import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const ReceptionManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    dob: '',
    gender: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          id: formData.patientId,
          name: formData.name,
          dob: formData.dob,
          gender: formData.gender,
          registeredBy: user.username,
        }),
      });
      if (response.ok) {
        toast.success('Patient registered successfully');
        setFormData({ ...formData, patientId: '', name: '', dob: '', gender: '' });
      } else {
        toast.error('Failed to register patient');
      }
    } catch (error) {
      toast.error('Error registering patient');
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          patient: formData.patientId,
          date: `${formData.appointmentDate}T${formData.appointmentTime}:00Z`,
          status: 'Scheduled',
          createdBy: user.username,
        }),
      });
      if (response.ok) {
        toast.success('Appointment scheduled successfully');
        setFormData({ ...formData, appointmentDate: '', appointmentTime: '' });
      } else {
        toast.error('Failed to schedule appointment');
      }
    } catch (error) {
      toast.error('Error scheduling appointment');
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Reception Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Register Patient</h3>
          <form onSubmit={handlePatientSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
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
            <button type="submit" className="btn-primary">Register Patient</button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Schedule Appointment</h3>
          <form onSubmit={handleAppointmentSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="text"
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
            <button type="submit" className="btn-primary">Schedule Appointment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceptionManagement;