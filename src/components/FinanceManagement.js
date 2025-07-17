import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const FinanceManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [expenses, setExpenses] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, reimbRes, payRes] = await Promise.all([
          fetch('http://localhost:5000/finance/expenses', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('http://localhost:5000/finance/reimbursements', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('http://localhost:5000/finance/payroll', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setExpenses(await expRes.json());
        setReimbursements(await reimbRes.json());
        setPayroll(await payRes.json());
      } catch (error) {
        toast.error('Error fetching financial data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/finance/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...formData, recordedBy: user.username }),
      });
      if (response.ok) {
        toast.success('Expense recorded successfully');
        setFormData({ description: '', amount: '', date: '' });
        const newExpense = await response.json();
        setExpenses([...expenses, newExpense]);
      } else {
        toast.error('Failed to record expense');
      }
    } catch (error) {
      toast.error('Error recording expense');
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Finance Management</h2>
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Record Expense</h3>
          <form onSubmit={handleExpenseSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Record Expense</button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Expenses</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="py-2 px-4 border">{exp.description}</td>
                    <td className="py-2 px-4 border">{exp.amount}</td>
                    <td className="py-2 px-4 border">{exp.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Insurance Reimbursements</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Claim ID</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {reimbursements.map((reimb) => (
                  <tr key={reimb.id}>
                    <td className="py-2 px-4 border">{reimb.claimId}</td>
                    <td className="py-2 px-4 border">{reimb.amount}</td>
                    <td className="py-2 px-4 border">{reimb.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Payroll</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Employee</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {payroll.map((pay) => (
                  <tr key={pay.id}>
                    <td className="py-2 px-4 border">{pay.employee}</td>
                    <td className="py-2 px-4 border">{pay.amount}</td>
                    <td className="py-2 px-4 border">{pay.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;