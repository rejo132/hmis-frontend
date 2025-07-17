import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPatients } from '../slices/patientSlice';
import { createBill } from '../slices/billSlice';

const BillForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector((state) => state.patients);
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.bills);
  const [formData, setFormData] = useState({
    patient_id: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchPatients(1));
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debug log
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting bill:', formData); // Debug log
      await dispatch(createBill({ ...formData, payment_status: 'Pending' })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create bill:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Generate Bill</h2>
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
            <label className="block text-gray-700" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={status === 'loading'}
          >
            Generate Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillForm;