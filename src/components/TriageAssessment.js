import React, { useState, useEffect } from 'react';
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
  const [queue, setQueue] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/queue`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setQueue(res.data.queue);
    } catch (err) {
      toast.error('Failed to fetch patient queue');
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData(prev => ({ ...prev, patientId: patient.id }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      
      // Record vitals
      await axios.post(`${API_BASE}/api/vitals`, {
        patient_id: formData.patientId,
        blood_pressure: formData.blood_pressure,
        temperature: formData.temperature,
        pulse: formData.pulse,
        respiration: formData.respiration,
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      // Record medical history
      await axios.post(`${API_BASE}/api/records`, {
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
        patientId: '', blood_pressure: '', temperature: '', pulse: '', respiration: '', 
        priority: 'Normal', history: '', allergies: '', referral: '', testPreparation: '',
      });
      setSelectedPatient(null);
      fetchQueue(); // Refresh queue
    } catch (err) {
      toast.error('Failed to record triage assessment');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Nurse</span>
        <span className="text-gray-700">Select patient from queue, record vitals, assign priority, and refer to doctor.</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Queue */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Patient Queue</h3>
          <div className="bg-white border rounded-lg p-4">
            {queue.length === 0 ? (
              <p className="text-gray-500">No patients in queue.</p>
            ) : (
              <ul className="space-y-2">
                {queue.map((patient) => (
                  <li 
                    key={patient.id} 
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-600">ID: {patient.id}</div>
                    {patient.checked_in && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                        Checked In
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Triage Assessment Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Triage Assessment</h3>
          {selectedPatient && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <strong>Selected Patient:</strong> {selectedPatient.name} (ID: {selectedPatient.id})
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input 
                type="text" 
                name="patientId" 
                value={formData.patientId} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                required 
                readOnly={!!selectedPatient}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
                <input 
                  type="text" 
                  name="blood_pressure" 
                  value={formData.blood_pressure} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., 120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                <input 
                  type="text" 
                  name="temperature" 
                  value={formData.temperature} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., 37.0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pulse (bpm)</label>
                <input 
                  type="text" 
                  name="pulse" 
                  value={formData.pulse} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., 72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Respiration (rpm)</label>
                <input 
                  type="text" 
                  name="respiration" 
                  value={formData.respiration} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., 16"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority Level</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                className="w-full border p-2 rounded"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Medical History</label>
              <textarea 
                name="history" 
                value={formData.history} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                rows="3"
                placeholder="Brief medical history..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Allergies</label>
              <input 
                type="text" 
                name="allergies" 
                value={formData.allergies} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                placeholder="e.g., Penicillin, Latex"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Preparation</label>
              <input 
                type="text" 
                name="testPreparation" 
                value={formData.testPreparation} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                placeholder="e.g., Fasting required"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Referral to Doctor/Department</label>
              <input 
                type="text" 
                name="referral" 
                value={formData.referral} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                placeholder="e.g., Dr. Smith, Cardiology"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary"
              disabled={!selectedPatient}
            >
              Submit Assessment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TriageAssessment; 