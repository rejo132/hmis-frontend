import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CommunicationSettings = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState({
    sms: true,
    email: true,
    chat: true,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/communications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setSettings(data.settings);
          toast.success('Communication Settings Loaded');
        })
        .catch((err) => toast.error('Failed to load settings'));
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, navigate]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/communications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message, type: settings.sms ? 'sms' : settings.email ? 'email' : 'chat' }),
      }).then((res) => res.json());
      toast.success('Message Sent');
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Communication Settings</h2>
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sms"
              checked={settings.sms}
              onChange={() => handleToggle('sms')}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="sms" className="ml-3 text-gray-700">
              Enable SMS Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email"
              checked={settings.email}
              onChange={() => handleToggle('email')}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="email" className="ml-3 text-gray-700">
              Enable Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="chat"
              checked={settings.chat}
              onChange={() => handleToggle('chat')}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="chat" className="ml-3 text-gray-700">
              Enable Internal Chat
            </label>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Send Message</h3>
        <form onSubmit={handleSendMessage}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
              rows="4"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="btn-primary flex-1">
              Send
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunicationSettings;