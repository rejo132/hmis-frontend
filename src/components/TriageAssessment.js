import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const TriageAssessment = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    patientId: '',
    blood_pressure: '',
    temperature: '',
    pulse: '',
    respiration: '',
    priority: 'Normal',
    history: '',
    allergies: '',
    referral: '',
    testPreparation: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      // Record vitals
      await axios.post('/api/vitals', {
        patient_id: formData.patientId,
        blood_pressure: formData.blood_pressure,
        temperature: formData.temperature,
        pulse: formData.pulse,
        respiration: formData.respiration,
      }, { headers: { Authorization: `Bearer ${token}` } });
      // Record medical history
      await axios.post('/api/records', {
        patient_id: formData.patientId,
        diagnosis: 'Triage Assessment',
        prescription: '',
        vital_signs: {
          bp: formData.blood_pressure,
          temperature: formData.temperature,
          heart_rate: formData.pulse,
          respiratory_rate: formData.respiration,
        },
        history: formData.history,
        allergies: formData.allergies,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Triage assessment recorded');
      setFormData({
        patientId: '', blood_pressure: '', temperature: '', pulse: '', respiration: '', priority: 'Normal', history: '', allergies: '', referral: '', testPreparation: '',
      });
    } catch (err) {
      toast.error('Failed to record triage assessment');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Triage Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Patient ID</label>
          <input type="text" name="patientId" value={formData.patientId} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label>Blood Pressure</label>
          <input type="text" name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Temperature</label>
          <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Pulse</label>
          <input type="text" name="pulse" value={formData.pulse} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Respiration</label>
          <input type="text" name="respiration" value={formData.respiration} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div>
          <label>Medical History</label>
          <textarea name="history" value={formData.history} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Allergies</label>
          <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Test Preparation</label>
          <input type="text" name="testPreparation" value={formData.testPreparation} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Referral to Doctor/Department</label>
          <input type="text" name="referral" value={formData.referral} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="btn-primary">Submit Assessment</button>
      </form>
    </div>
  );
};

export default TriageAssessment; 