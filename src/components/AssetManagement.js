import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AssetManagement = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (user && user.role === 'Admin') {
      fetch('http://localhost:5000/assets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAssets(data.assets);
          toast.success('Assets Loaded');
        })
        .catch((err) => toast.error('Failed to load assets'));
    } else {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleScheduleMaintenance = (assetId) => {
    toast.success(`Maintenance Scheduled for Asset ${assetId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Asset Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Asset ID: {asset.id}</h3>
            <p>Name: {asset.name}</p>
            <p>Status: {asset.status}</p>
            <p>Next Maintenance: {asset.maintenance_date}</p>
            <button
              onClick={() => handleScheduleMaintenance(asset.id)}
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Schedule Maintenance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetManagement;