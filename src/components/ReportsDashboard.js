import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [auditLogs, setAuditLogs] = useState([]);

  const financialData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (KES)',
        data: [500000, 600000, 550000, 700000, 650000, 800000],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const clinicalData = {
    labels: ['Flu', 'Injuries', 'Infections', 'Chronic'],
    datasets: [
      {
        label: 'Cases',
        data: [120, 80, 100, 50],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/audit-logs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAuditLogs(data.auditLogs);
          toast.success('Audit Logs Loaded');
        })
        .catch((err) => toast.error('Failed to load audit logs'));
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Reports Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Financial Report</h3>
          <Bar data={financialData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Monthly Revenue' } } }} />
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Clinical Report</h3>
          <Bar data={clinicalData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Case Distribution' } } }} />
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Audit Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left">ID</th>
                <th className="border border-gray-200 p-3 text-left">User</th>
                <th className="border border-gray-200 p-3 text-left">Action</th>
                <th className="border border-gray-200 p-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, index) => (
                <tr key={log.id} className={`table-row ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="border border-gray-200 p-3">{log.id}</td>
                  <td className="border border-gray-200 p-3">{log.user_id}</td>
                  <td className="border border-gray-200 p-3">{log.action}</td>
                  <td className="border border-gray-200 p-3">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;