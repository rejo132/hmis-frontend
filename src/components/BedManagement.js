import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BedManagement = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    if (user && user.role === 'Admin') {
      fetch('http://localhost:5000/beds', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setBeds(data.beds);
          toast.success('Beds Loaded');
        })
        .catch((err) => toast.error('Failed to load beds'));
    } else {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleReserve = (bedId) => {
    toast.success(`Bed ${bedId} Reserved`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bed Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beds.map((bed) => (
          <div key={bed.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Bed ID: {bed.id}</h3>
            <p>Ward: {bed.ward}</p>
            <p>Status: {bed.status}</p>
            <p>Patient ID: {bed.patient_id || 'None'}</p>
            <button
              onClick={() => handleReserve(bed.id)}
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={bed.status !== 'Available'}
            >
              Reserve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BedManagement;