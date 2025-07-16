import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addPatient, updatePatient } from '../slices/patientSlice';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    address: '',
    medical_history: '',
    allergies: '',
  });
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector((state) => state.patients);

  useEffect(() => {
    if (id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) {
        setFormData(patient);
      }
    }
  }, [id, patients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updatePatient({ id, ...formData }));
    } else {
      dispatch(addPatient(formData));
    }
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {id ? 'Edit Patient' : 'Add Patient'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Medical History</label>
            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Allergies</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {id ? 'Update' : 'Add'} Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;