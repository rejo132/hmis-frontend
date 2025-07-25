import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { processRefund, submitClaim } from '../slices/billingSlice';

const BillingManagement = () => {
  const dispatch = useDispatch();
  const { user, access_token } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.billing || {});
  const [formData, setFormData] = useState({
    billId: '',
    refundAmount: '',
    claimId: '',
    insuranceProvider: '',
    claimAmount: '',
  });
  const [report, setReport] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        processRefund({
          billId: formData.billId,
          refundAmount: formData.refundAmount,
          processedBy: user.username,
          token: access_token,
        })
      ).unwrap();
      toast.success('Refund processed successfully');
      setFormData({ ...formData, billId: '', refundAmount: '' });
    } catch (err) {
      toast.error(`Error processing refund: ${err}`);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        submitClaim({
          claimId: formData.claimId,
          insuranceProvider: formData.insuranceProvider,
          claimAmount: formData.claimAmount,
          processedBy: user.username,
          token: access_token,
        })
      ).unwrap();
      toast.success('Insurance claim submitted successfully');
      setFormData({ ...formData, claimId: '', insuranceProvider: '', claimAmount: '' });
    } catch (err) {
      toast.error(`Error submitting claim: ${err}`);
    }
  };

  const handleGenerateReport = () => {
    // Mock report logic
    setReport({
      totalIncome: 100000,
      pendingPayments: 5000,
      insuranceClaims: 20000,
    });
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Billing Management</h2>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
        <button className="btn-primary" onClick={handleGenerateReport}>Generate Billing Report</button>
        {report && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <div>Total Income: KES {report.totalIncome}</div>
            <div>Pending Payments: KES {report.pendingPayments}</div>
            <div>Insurance Claims: KES {report.insuranceClaims}</div>
          </div>
        )}
      </div>
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
            <button type="submit" className="btn-primary" disabled={status === 'loading'}>
              Process Refund
            </button>
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
            <button type="submit" className="btn-primary" disabled={status === 'loading'}>
              Submit Claim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;