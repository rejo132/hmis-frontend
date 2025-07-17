import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LabOrderForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_id: '',
    test_type: '',
    status: 'Ordered',
    sample_collected: false,
    results: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/lab-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json());
      toast.success('Lab Order Created');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create lab order:', err);
      toast.error('Failed to create lab order');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Order Lab Test</h2>
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
            <label className="block text-gray-700 text-sm font-medium" htmlFor="test_type">
              Test Type
            </label>
            <select
              id="test_type"
              name="test_type"
              value={formData.test_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Test</option>
              <option value="Blood Test">Blood Test</option>
              <option value="Urine Test">Urine Test</option>
              <option value="Biopsy">Biopsy</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="results">
              Results (Optional)
            </label>
            <textarea
              id="results"
              name="results"
              value={formData.results}
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

export default LabOrderForm;