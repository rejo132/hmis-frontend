import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPatient } from '../slices/patientSlice';
import { useHistory } from 'react-router-dom';

const PatientForm = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    dob: '',
    contact: '',
    address: '',
    medical_history: '',
    allergies: ''
  });
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.patients);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addPatient(patientData));
    if (addPatient.fulfilled.match(result)) {
      history.push('/dashboard');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Add Patient</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Name"
          value={patientData.name}
          onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="date"
          value={patientData.dob}
          onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Contact"
          value={patientData.contact}
          onChange={(e) => setPatientData({ ...patientData, contact: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Address"
          value={patientData.address}
          onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Medical History"
          value={patientData.medical_history}
          onChange={(e) => setPatientData({ ...patientData, medical_history: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Allergies"
          value={patientData.allergies}
          onChange={(e) => setPatientData({ ...patientData, allergies: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
          Add Patient
        </button>
      </div>
    </div>
  );
};

export default PatientForm;