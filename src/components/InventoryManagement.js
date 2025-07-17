import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const InventoryManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [dispenseForm, setDispenseForm] = useState({
    itemId: '',
    quantity: '',
    patientId: '',
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:5000/inventory', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setItems(data);
      } catch (error) {
        toast.error('Error fetching inventory');
      }
    };
    fetchInventory();
  }, []);

  const handleDispenseChange = (e) => {
    setDispenseForm({ ...dispenseForm, [e.target.name]: e.target.value });
  };

  const handleDispenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/inventory/dispense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...dispenseForm, dispensedBy: user.username }),
      });
      if (response.ok) {
        toast.success('Medication dispensed successfully');
        setDispenseForm({ itemId: '', quantity: '', patientId: '' });
      } else {
        toast.error('Failed to dispense medication');
      }
    } catch (error) {
      toast.error('Error dispensing medication');
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Dispense Medication</h3>
          <form onSubmit={handleDispenseSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item ID</label>
              <input
                type="text"
                name="itemId"
                value={dispenseForm.itemId}
                onChange={handleDispenseChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={dispenseForm.quantity}
                onChange={handleDispenseChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={dispenseForm.patientId}
                onChange={handleDispenseChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Dispense</button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Inventory</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Quantity</th>
                  <th className="py-2 px-4 border">Expiry Date</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border">{item.name}</td>
                    <td className="py-2 px-4 border">{item.quantity}</td>
                    <td className="py-2 px-4 border">{item.expiry}</td>
                    <td className="py-2 px-4 border">
                      {new Date(item.expiry) < new Date() ? (
                        <span className="text-red-600">Expired</span>
                      ) : new Date(item.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                        <span className="text-yellow-600">Expiring Soon</span>
                      ) : (
                        <span className="text-green-600">Valid</span>
                      )}
                    </td>
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

export default InventoryManagement;