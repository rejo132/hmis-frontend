import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBill } from '../slices/billSlice';
import { useHistory } from 'react-router-dom';

const BillForm = () => {
  const [billData, setBillData] = useState({
    patient_id: '',
    amount: '',
    description: ''
  });
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.bills);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createBill(billData));
    if (createBill.fulfilled.match(result)) {
      history.push('/dashboard');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Create Bill</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="max-w-md mx-auto">
        <input
          type="number"
          placeholder="Patient ID"
          value={billData.patient_id}
          onChange={(e) => setBillData({ ...billData, patient_id: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={billData.amount}
          onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Description"
          value={billData.description}
          onChange={(e) => setBillData({ ...billData, description: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
          Create Bill
        </button>
      </div>
    </div>
  );
};

export default BillForm;

