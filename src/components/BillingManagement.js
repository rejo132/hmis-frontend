import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const BillingManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    billId: '',
    refundAmount: '',
    claimId: '',
    insuranceProvider: '',
    claimAmount: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/bills/refunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ billId: formData.billId, refundAmount: formData.refundAmount, processedBy: user.username }),
      });
      if (response.ok) {
        toast.success('Refund processed successfully');
        setFormData({ ...formData, billId: '', refundAmount: '' });
      } else {
        toast.error('Failed to process refund');
      }
    } catch (error) {
      toast.error('Error processing refund');
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/bills/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          claimId: formData.claimId,
          insuranceProvider: formData.insuranceProvider,
          claimAmount: formData.claimAmount,
          processedBy: user.username,
        }),
      });
      if (response.ok) {
        toast.success('Insurance claim submitted successfully');
        setFormData({ ...formData, claimId: '', insuranceProvider: '', claimAmount: '' });
      } else {
        toast.error('Failed to submit claim');
      }
    } catch (error) {
      toast.error('Error submitting claim');
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Billing Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Process Refund</h3>
          <form onSubmit={handleRefundSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bill ID</label>
              <input
                type="text"
                name="billId"
                value={formData.billId}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Refund Amount</label>
              <input
                type="number"
                name="refundAmount"
                value={formData.refundAmount}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Process Refund</button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Submit Insurance Claim</h3>
          <form onSubmit={handleClaimSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Claim ID</label>
              <input
                type="text"
                name="claimId"
                value={formData.claimId}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
              <input
                type="text"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Claim Amount</label>
              <input
                type="number"
                name="claimAmount"
                value={formData.claimAmount}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Submit Claim</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;