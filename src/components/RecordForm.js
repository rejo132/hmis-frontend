import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRecord } from '../slices/recordSlice';

const RecordForm = () => {
  const [formData, setFormData] = useState({
    patient_id: '',
    diagnosis: '',
    prescription: '',
    vital_signs: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector((state) => state.patients);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addRecord(formData));
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Medical Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Patient</label>
            <select
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
            <label className="block text-gray-700">Diagnosis</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Prescription</label>
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Vital Signs</label>
            <textarea
              name="vital_signs"
              value={formData.vital_signs}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;