import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';

const PatientPortal = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (user && user.role === 'Patient') {
      // Fetch appointments
      fetch('http://localhost:5000/appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAppointments(data.appointments);
          toast.success('Appointments Loaded');
        })
        .catch((err) => toast.error('Failed to load appointments'));

      // Fetch bills
      fetch('http://localhost:5000/bills', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setBills(data.bills);
          toast.success('Bills Loaded');
        })
        .catch((err) => toast.error('Failed to load bills'));

      // Fetch records
      fetch('http://localhost:5000/records', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setRecords(data.records);
          toast.success('Records Loaded');
        })
        .catch((err) => toast.error('Failed to load records'));
    } else {
      navigate('/login');
      toast.error('Unauthorized access');
    }
  }, [user, navigate]);

  const handlePayBill = async (billId) => {
    try {
      await fetch(`http://localhost:5000/bills/${billId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ payment_status: 'Paid' }),
      }).then((res) => res.json());
      toast.success(`Payment Initiated for Bill ${billId}`);
      setBills((prev) =>
        prev.map((bill) =>
          bill.id === billId ? { ...bill, payment_status: 'Paid' } : bill
        )
      );
    } catch (err) {
      console.error('Failed to pay bill:', err);
      toast.error('Failed to pay bill');
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Patient Portal</h2>
      <div className="mb-8">
        <NavLink to="/appointments/new" className="btn-primary inline-flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Book Appointment
        </NavLink>
      </div>
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left">ID</th>
                <th className="border border-gray-200 p-3 text-left">Time</th>
                <th className="border border-gray-200 p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id} className={`table-row ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="border border-gray-200 p-3">{appt.id}</td>
                  <td className="border border-gray-200 p-3">{appt.appointment_time}</td>
                  <td className="border border-gray-200 p-3">{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Bills</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left">ID</th>
                <th className="border border-gray-200 p-3 text-left">Amount</th>
                <th className="border border-gray-200 p-3 text-left">Status</th>
                <th className="border border-gray-200 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={bill.id} className={`table-row ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="border border-gray-200 p-3">{bill.id}</td>
                  <td className="border border-gray-200 p-3">{bill.amount}</td>
                  <td className="border border-gray-200 p-3">{bill.payment_status}</td>
                  <td className="border border-gray-200 p-3">
                    <button
                      onClick={() => handlePayBill(bill.id)}
                      className="btn-primary"
                      disabled={bill.payment_status === 'Paid'}
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Your Test Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left">ID</th>
                <th className="border border-gray-200 p-3 text-left">Diagnosis</th>
                <th className="border border-gray-200 p-3 text-left">Prescription</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record.id} className={`table-row ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="border border-gray-200 p-3">{record.id}</td>
                  <td className="border border-gray-200 p-3">{record.diagnosis}</td>
                  <td className="border border-gray-200 p-3">{record.prescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;