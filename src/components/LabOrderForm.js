import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addLabOrder } from '../slices/labSlice';
import axios from 'axios';

const LabOrderForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [labOrders, setLabOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    test_type: '',
    status: 'Ordered',
    sample_collected: false,
    results: '',
  });
  const [validated, setValidated] = useState(false);
  const [labReport, setLabReport] = useState(null);
  const [showResultsForm, setShowResultsForm] = useState(false);

  useEffect(() => {
    fetchLabOrders();
  }, []);

  const fetchLabOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/lab-orders`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setLabOrders(res.data.lab_orders || []);
    } catch (err) {
      toast.error('Failed to fetch lab orders');
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setFormData({
      patient_id: order.patient_id,
      test_type: order.test_type,
      status: order.status,
      sample_collected: order.sample_collected || false,
      results: order.results || '',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCollectSample = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      
      await axios.put(`${API_BASE}/api/lab-orders/${selectedOrder.id}`, {
        sample_collected: true,
        status: 'Sample Collected',
        collected_by: user.id,
        collection_time: new Date().toISOString(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success('Sample collected successfully');
      fetchLabOrders();
    } catch (err) {
      toast.error('Failed to update sample collection');
    }
  };

  const handleUploadResults = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      
      await axios.put(`${API_BASE}/api/lab-orders/${selectedOrder.id}`, {
        results: formData.results,
        status: 'Results Ready',
        completed_by: user.id,
        completion_time: new Date().toISOString(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success('Results uploaded successfully');
      setShowResultsForm(false);
      fetchLabOrders();
    } catch (err) {
      toast.error('Failed to upload results');
    }
  };

  const handleValidate = () => {
    setValidated(true);
    toast.success('Result validated');
  };

  const handleGenerateLabReport = () => {
    setLabReport({
      totalTests: 50,
      positive: 10,
      negative: 40,
      avgTurnaround: '2h',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addLabOrder(formData)).unwrap();
      toast.success('Lab Order Created');
      navigate('/dashboard');
    } catch (err) {
      toast.error(`Failed to create lab order: ${err}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ordered': return 'bg-yellow-100 text-yellow-800';
      case 'Sample Collected': return 'bg-blue-100 text-blue-800';
      case 'Results Ready': return 'bg-green-100 text-green-800';
      case 'Verified': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Lab Technician</span>
        <span className="text-gray-700">Receive lab requests, collect samples, upload results, mark as verified, and share with doctor.</span>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Laboratory Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lab Orders List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Lab Orders</h3>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            {labOrders.length === 0 ? (
              <p className="text-gray-500">No lab orders available.</p>
            ) : (
              <div className="space-y-3">
                {labOrders.map((order) => (
                  <div 
                    key={order.id}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <div className="font-medium">Patient ID: {order.patient_id}</div>
                    <div className="text-sm text-gray-600">Test: {order.test_type}</div>
                    <div className="text-sm text-gray-500">Ordered: {order.created_at}</div>
                    <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Details and Actions */}
        {selectedOrder && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <div className="bg-white border rounded-lg p-4">
              <div className="mb-4">
                <h4 className="font-semibold">Patient ID: {selectedOrder.patient_id}</h4>
                <p>Test Type: {selectedOrder.test_type}</p>
                <p>Status: <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span></p>
                <p>Ordered: {selectedOrder.created_at}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {selectedOrder.status === 'Ordered' && (
                  <button 
                    onClick={handleCollectSample}
                    className="w-full btn-primary"
                  >
                    Collect Sample
                  </button>
                )}
                
                {selectedOrder.status === 'Sample Collected' && (
                  <button 
                    onClick={() => setShowResultsForm(true)}
                    className="w-full btn-primary"
                  >
                    Upload Results
                  </button>
                )}
                
                {selectedOrder.status === 'Results Ready' && (
                  <div className="space-y-2">
                    <button 
                      onClick={handleValidate}
                      className="w-full btn-secondary"
                    >
                      Mark as Verified
                    </button>
                    <button 
                      onClick={handleGenerateLabReport}
                      className="w-full btn-primary"
                    >
                      Generate Lab Report
                    </button>
                  </div>
                )}
              </div>

              {/* Results Upload Form */}
              {showResultsForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2">Upload Results</h4>
                  <form onSubmit={handleUploadResults} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Test Results</label>
                      <textarea 
                        name="results" 
                        value={formData.results} 
                        onChange={handleChange} 
                        className="w-full border p-2 rounded" 
                        rows="4"
                        placeholder="Enter test results..."
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button type="submit" className="flex-1 btn-primary">
                        Upload Results
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowResultsForm(false)}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lab Report */}
              {labReport && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                  <h4 className="font-semibold mb-2">Lab Report</h4>
                  <div className="text-sm space-y-1">
                    <div>Total Tests: {labReport.totalTests}</div>
                    <div>Positive: {labReport.positive}</div>
                    <div>Negative: {labReport.negative}</div>
                    <div>Avg Turnaround: {labReport.avgTurnaround}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create New Lab Order Form */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Create New Lab Order</h3>
        <div className="bg-white border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="number"
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Type</label>
              <select
                name="test_type"
                value={formData.test_type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Test</option>
                <option value="Blood Test">Blood Test</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Biopsy">Biopsy</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI">MRI</option>
                <option value="CT Scan">CT Scan</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Create Order
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LabOrderForm;