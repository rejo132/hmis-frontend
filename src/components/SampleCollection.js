import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const SampleCollection = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    labOrderId: '',
    sampleType: '',
    collectionTime: '',
    status: 'Collected',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/lab-samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...formData, collectedBy: user.username }),
      });
      if (response.ok) {
        toast.success('Sample recorded successfully');
        setFormData({ labOrderId: '', sampleType: '', collectionTime: '', status: 'Collected' });
      } else {
        toast.error('Failed to record sample');
      }
    } catch (error) {
      toast.error('Error recording sample');
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Record Sample Collection</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Lab Order ID</label>
          <input
            type="text"
            name="labOrderId"
            value={formData.labOrderId}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sample Type</label>
          <input
            type="text"
            name="sampleType"
            value={formData.sampleType}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Collection Time</label>
          <input
            type="datetime-local"
            name="collectionTime"
            value={formData.collectionTime}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
          >
            <option value="Collected">Collected</option>
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Record Sample</button>
      </form>
    </div>
  );
};

export default SampleCollection;