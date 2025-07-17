import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const UserRoleManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    role: '',
    permissions: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/roles', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error('Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/users/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...formData, updatedBy: user.username }),
      });
      if (response.ok) {
        toast.success('User role updated successfully');
        setFormData({ userId: '', role: '', permissions: '' });
        const updatedUser = await response.json();
        setUsers([...users.filter(u => u.id !== formData.userId), updatedUser]);
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      toast.error('Error updating user role');
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">User Role Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Lab">Lab</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Billing">Billing</option>
            <option value="IT">IT</option>
            <option value="Accountant">Accountant</option>
            <option value="Patient">Patient</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Permissions (comma-separated)</label>
          <input
            type="text"
            name="permissions"
            value={formData.permissions}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <button type="submit" className="btn-primary">Update Role</button>
      </form>
      <h3 className="text-xl font-semibold mb-4">User Roles</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-2 px-4 border">{u.username}</td>
                <td className="py-2 px-4 border">{u.role}</td>
                <td className="py-2 px-4 border">{u.permissions.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRoleManagement;