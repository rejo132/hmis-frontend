import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRecord } from '../slices/recordSlice';
import { useHistory } from 'react-router-dom';

const RecordForm = () => {
  const [recordData, setRecordData] = useState({
    patient_id: '',
    diagnosis: '',
    prescription: '',
    vital_signs: '{}'
  });
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.records);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addRecord(recordData));
    if (addRecord.fulfilled.match(result)) {
      history.push('/dashboard');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Add Medical Record</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="max-w-md mx-auto">
        <input
          type="number"
          placeholder="Patient ID"
          value={recordData.patient_id}
          onChange={(e) => setRecordData({ ...recordData, patient_id: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Diagnosis"
          value={recordData.diagnosis}
          onChange={(e) => setRecordData({ ...recordData, diagnosis: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Prescription"
          value={recordData.prescription}
          onChange={(e) => setRecordData({ ...recordData, prescription: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Vital Signs (JSON)"
          value={recordData.vital_signs}
          onChange={(e) => setRecordData({ ...recordData, vital_signs: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
          Add Record
        </button>
      </div>
    </div>
  );
};

export default RecordForm;