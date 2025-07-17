import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/security-logs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        toast.error('Error fetching security logs');
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Security Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Event</th>
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="py-2 px-4 border">{log.event}</td>
                <td className="py-2 px-4 border">{log.user}</td>
                <td className="py-2 px-4 border">{log.status}</td>
                <td className="py-2 px-4 border">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityLogs;