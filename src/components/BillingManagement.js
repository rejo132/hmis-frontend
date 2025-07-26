import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { processRefund, submitClaim } from '../slices/billingSlice';
import axios from 'axios';
import { getBills } from '../api/api';

const BillingManagement = () => {
  const dispatch = useDispatch();
  const { user, access_token } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.billing || {});
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientServices, setPatientServices] = useState([]);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    billId: '',
    refundAmount: '',
    claimId: '',
    insuranceProvider: '',
    claimAmount: '',
  });
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/patients`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setPatients(res.data.patients || []);
    } catch (err) {
      toast.error('Failed to fetch patients');
    }
  };

  const fetchPatientServices = async (patientId) => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      
      // Fetch appointments, records, and lab orders for the patient
      const [appointmentsRes, recordsRes, labOrdersRes] = await Promise.all([
        axios.get(`${API_BASE}/api/appointments`, { 
          headers: { Authorization: `Bearer ${token}` },
          params: { patient_id: patientId }
        }),
        axios.get(`${API_BASE}/api/records`, { 
          headers: { Authorization: `Bearer ${token}` },
          params: { patient_id: patientId }
        }),
        axios.get(`${API_BASE}/api/lab-orders`, { 
          headers: { Authorization: `Bearer ${token}` },
          params: { patient_id: patientId }
        })
      ]);

      const services = [];
      
      // Add appointments
      (appointmentsRes.data.appointments || []).forEach(appt => {
        services.push({
          id: `appt_${appt.id}`,
          type: 'Consultation',
          description: `Doctor consultation on ${appt.appointment_time}`,
          amount: 5000, // Mock amount
          date: appt.appointment_time,
          status: 'Completed'
        });
      });

      // Add lab tests
      (labOrdersRes.data.lab_orders || []).forEach(lab => {
        services.push({
          id: `lab_${lab.id}`,
          type: 'Laboratory',
          description: `${lab.test_type}`,
          amount: 3000, // Mock amount
          date: lab.created_at,
          status: lab.status
        });
      });

      // Add prescriptions
      (recordsRes.data.records || []).forEach(record => {
        if (record.prescription) {
          services.push({
            id: `presc_${record.id}`,
            type: 'Pharmacy',
            description: `Medication: ${record.prescription}`,
            amount: 2000, // Mock amount
            date: record.created_at,
            status: 'Prescribed'
          });
        }
      });

      setPatientServices(services);
    } catch (err) {
      toast.error('Failed to fetch patient services');
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    fetchPatientServices(patient.id);
    setGeneratedInvoice(null);
  };

  const handleGenerateInvoice = () => {
    if (patientServices.length === 0) {
      toast.error('No services found for this patient');
      return;
    }

    const totalAmount = patientServices.reduce((sum, service) => sum + service.amount, 0);
    const invoice = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      services: patientServices,
      totalAmount,
      invoiceNumber: `INV-${Date.now()}`,
      generatedDate: new Date().toISOString(),
      status: 'Pending'
    };

    setGeneratedInvoice(invoice);
    toast.success('Invoice generated successfully');
  };

  const handleAcceptPayment = async (paymentMethod) => {
    if (!generatedInvoice) {
      toast.error('No invoice to process payment for');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      
      // Create bill record
      await axios.post(`${API_BASE}/api/bills`, {
        patient_id: generatedInvoice.patientId,
        amount: generatedInvoice.totalAmount,
        description: `Invoice ${generatedInvoice.invoiceNumber} - ${generatedInvoice.services.length} services`,
        payment_status: 'Paid',
        payment_method: paymentMethod,
        processed_by: user.username
      }, { headers: { Authorization: `Bearer ${token}` } });

      setGeneratedInvoice(prev => ({ ...prev, status: 'Paid' }));
      toast.success(`Payment accepted via ${paymentMethod}`);
    } catch (err) {
      toast.error('Failed to process payment');
    }
  };

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

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      let page = 1;
      let allBills = [];
      let hasMore = true;
      while (hasMore) {
        const res = await getBills(page);
        allBills = allBills.concat(res.data.bills || []);
        if (res.data.page >= res.data.pages) {
          hasMore = false;
        } else {
          page++;
        }
      }
      // Calculate totals
      let totalIncome = 0;
      let pendingPayments = 0;
      let insuranceClaims = 0;
      let refunded = 0;
      let paid = 0;
      let claimed = 0;
      allBills.forEach(bill => {
        const amount = Number(bill.amount) || 0;
        if (bill.payment_status === 'Paid') {
          totalIncome += amount;
          paid += amount;
        } else if (bill.payment_status === 'Pending') {
          pendingPayments += amount;
        } else if (bill.payment_status === 'Claimed') {
          insuranceClaims += amount;
          claimed += amount;
        } else if (bill.payment_status === 'Refunded') {
          refunded += amount;
        }
      });
      setReport({
        totalIncome,
        pendingPayments,
        insuranceClaims,
        refunded,
        paid,
        claimed,
        totalBills: allBills.length,
        billsByStatus: {
          Paid: paid,
          Pending: pendingPayments,
          Claimed: claimed,
          Refunded: refunded,
        },
      });
    } catch (err) {
      setReportError('Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Billing Officer</span>
        <span className="text-gray-700">Access patient service log, auto-generate invoice, accept payment, and mark invoice as paid.</span>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Billing Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Patient Service Log</h3>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            {patients.length === 0 ? (
              <p className="text-gray-500">No patients available.</p>
            ) : (
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div 
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
                    <div className="text-sm text-gray-500">Contact: {patient.contact || 'N/A'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Service Log and Invoice */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Service Log & Invoice</h3>
          {selectedPatient && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <strong>Selected Patient:</strong> {selectedPatient.name} (ID: {selectedPatient.id})
            </div>
          )}
          
          {patientServices.length > 0 && (
            <div className="bg-white border rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Services Rendered</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {patientServices.map((service) => (
                  <div key={service.id} className="p-2 border rounded text-sm">
                    <div className="font-medium">{service.type}: {service.description}</div>
                    <div className="text-gray-600">Amount: KES {service.amount.toLocaleString()}</div>
                    <div className="text-gray-500">Date: {service.date}</div>
                    <div className="text-gray-500">Status: {service.status}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t">
                <strong>Total Services: {patientServices.length}</strong>
              </div>
            </div>
          )}

          {selectedPatient && (
            <div className="space-y-3">
              <button 
                onClick={handleGenerateInvoice}
                className="w-full btn-primary"
                disabled={patientServices.length === 0}
              >
                Generate Invoice
              </button>
            </div>
          )}

          {/* Generated Invoice */}
          {generatedInvoice && (
            <div className="mt-4 bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Generated Invoice</h4>
              <div className="text-sm space-y-1 mb-3">
                <div><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</div>
                <div><strong>Patient:</strong> {generatedInvoice.patientName}</div>
                <div><strong>Total Amount:</strong> KES {generatedInvoice.totalAmount.toLocaleString()}</div>
                <div><strong>Status:</strong> {generatedInvoice.status}</div>
              </div>
              
              {generatedInvoice.status === 'Pending' && (
                <div className="space-y-2">
                  <button 
                    onClick={() => handleAcceptPayment('Cash')}
                    className="w-full btn-primary"
                  >
                    Accept Cash Payment
                  </button>
                  <button 
                    onClick={() => handleAcceptPayment('M-Pesa')}
                    className="w-full btn-secondary"
                  >
                    Accept M-Pesa Payment
                  </button>
                  <button 
                    onClick={() => handleAcceptPayment('Card')}
                    className="w-full btn-secondary"
                  >
                    Accept Card Payment
                  </button>
                </div>
              )}
              
              {generatedInvoice.status === 'Paid' && (
                <div className="p-2 bg-green-50 border border-green-200 rounded text-green-700">
                  ✓ Payment completed successfully
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reports and Other Functions */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Reports & Other Functions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <button className="btn-primary mb-4" onClick={handleGenerateReport} disabled={reportLoading}>
              {reportLoading ? 'Generating...' : 'Generate Billing Report'}
            </button>
            {reportError && <div className="text-red-600 mb-2">{reportError}</div>}
            {report && (
              <div className="p-4 border rounded bg-gray-50">
                <div className="font-semibold mb-2">Summary</div>
                <div>Total Bills: {report.totalBills}</div>
                <div>Total Income (Paid): KES {report.totalIncome.toLocaleString()}</div>
                <div>Pending Payments: KES {report.pendingPayments.toLocaleString()}</div>
                <div>Insurance Claims: KES {report.insuranceClaims.toLocaleString()}</div>
                <div>Refunded: KES {report.refunded.toLocaleString()}</div>
                <div className="mt-3 font-semibold">Breakdown by Status</div>
                <table className="w-full text-sm mt-2 border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-1 border">Status</th>
                      <th className="p-1 border">Total (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(report.billsByStatus).map(([status, amount]) => (
                      <tr key={status}>
                        <td className="p-1 border">{status}</td>
                        <td className="p-1 border">{amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Process Refund</h4>
              <form onSubmit={handleRefundSubmit} className="space-y-2">
                <input
                  type="text"
                  name="billId"
                  placeholder="Bill ID"
                  value={formData.billId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="refundAmount"
                  placeholder="Refund Amount"
                  value={formData.refundAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <button type="submit" className="btn-primary w-full">
                  Process Refund
                </button>
              </form>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Submit Insurance Claim</h4>
              <form onSubmit={handleClaimSubmit} className="space-y-2">
                <input
                  type="text"
                  name="claimId"
                  placeholder="Claim ID"
                  value={formData.claimId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="insuranceProvider"
                  placeholder="Insurance Provider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="claimAmount"
                  placeholder="Claim Amount"
                  value={formData.claimAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <button type="submit" className="btn-primary w-full">
                  Submit Claim
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;