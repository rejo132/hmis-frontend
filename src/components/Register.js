import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../slices/authSlice';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Doctor');
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register({ username, password, role }));
    if (register.fulfilled.match(result)) {
      history.push('/login');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
          <option value="Admin">Admin</option>
        </select>
        <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;