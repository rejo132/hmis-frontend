import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RadiologyForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_id: '',
    imaging_type: '',
    status: 'Ordered',
    report: '',
    scan_url: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/radiology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json());
      toast.success('Radiology Order Created');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create radiology order:', err);
      toast.error('Failed to create radiology order');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Order Radiology</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="patient_id">
              Patient ID
            </label>
            <input
              id="patient_id"
              name="patient_id"
              type="number"
              value={formData.patient_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="imaging_type">
              Imaging Type
            </label>
            <select
              id="imaging_type"
              name="imaging_type"
              value={formData.imaging_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Imaging</option>
              <option value="X-Ray">X-Ray</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="report">
              Report (Optional)
            </label>
            <textarea
              id="report"
              name="report"
              value={formData.report}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="scan_url">
              Scan URL (Optional)
            </label>
            <input
              id="scan_url"
              name="scan_url"
              type="text"
              value={formData.scan_url}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RadiologyForm;