import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const ShiftManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    nurseId: '',
    date: '',
    time: '',
    tasks: '',
  });

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch('http://localhost:5000/shifts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setShifts(data);
      } catch (error) {
        toast.error('Error fetching shifts');
      }
    };
    fetchShifts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...formData, createdBy: user.username }),
      });
      if (response.ok) {
        toast.success('Shift created successfully');
        setFormData({ nurseId: '', date: '', time: '', tasks: '' });
        const updatedShifts = await response.json();
        setShifts([...shifts, updatedShifts]);
      } else {
        toast.error('Failed to create shift');
      }
    } catch (error) {
      toast.error('Error creating shift');
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Manage Shifts</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nurse ID</label>
          <input
            type="text"
            name="nurseId"
            value={formData.nurseId}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time (e.g., 08:00-16:00)</label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tasks (comma-separated)</label>
          <input
            type="text"
            name="tasks"
            value={formData.tasks}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <button type="submit" className="btn-primary">Create Shift</button>
      </form>
      <h3 className="text-xl font-semibold mb-4">Shift Schedule</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Nurse</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Time</th>
              <th className="py-2 px-4 border">Tasks</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="py-2 px-4 border">{shift.nurse}</td>
                <td className="py-2 px-4 border">{shift.date}</td>
                <td className="py-2 px-4 border">{shift.time}</td>
                <td className="py-2 px-4 border">{shift.tasks.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftManagement;