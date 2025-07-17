import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPatients } from '../slices/patientSlice';
import { addRecord } from '../slices/recordSlice';

const RecordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector((state) => state.patients);
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.records);
  const [formData, setFormData] = useState({
    patient_id: '',
    diagnosis: '',
    prescription: '',
    vital_signs: '',
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
      console.log('Submitting record:', formData); // Debug log
      await dispatch(addRecord(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to add record:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Medical Record</h2>
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
            <label className="block text-gray-700" htmlFor="diagnosis">
              Diagnosis
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="prescription">
              Prescription
            </label>
            <textarea
              id="prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="vital_signs">
              Vital Signs
            </label>
            <textarea
              id="vital_signs"
              name="vital_signs"
              value={formData.vital_signs}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={status === 'loading'}
          >
            Add Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;