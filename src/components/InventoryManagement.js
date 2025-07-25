import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchInventory, dispenseItem } from '../slices/inventorySlice';

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, status, error } = useSelector((state) => state.inventory);
  const [dispenseForm, setDispenseForm] = useState({
    itemId: '',
    quantity: '',
    patientId: '',
  });
  const [counselingNote, setCounselingNote] = useState('');
  const [interactionAlert, setInteractionAlert] = useState('');

  const knownInteractions = [
    { drugs: ['DrugA', 'DrugB'], message: 'DrugA and DrugB should not be used together.' },
  ];

  useEffect(() => {
    dispatch(fetchInventory())
      .unwrap()
      .catch((err) => toast.error(`Error fetching inventory: ${err}`));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  const handleDispenseChange = (e) => {
    setDispenseForm({ ...dispenseForm, [e.target.name]: e.target.value });
    // Drug interaction check (mock)
    if (e.target.name === 'itemId') {
      const found = knownInteractions.find((i) => i.drugs.includes(e.target.value));
      setInteractionAlert(found ? found.message : '');
    }
  };

  const handleDispenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(dispenseItem({ ...dispenseForm, dispensedBy: user.username })).unwrap();
      toast.success('Medication dispensed successfully');
      setDispenseForm({ itemId: '', quantity: '', patientId: '' });
      setCounselingNote('');
      setInteractionAlert('');
    } catch (err) {
      toast.error(`Error dispensing medication: ${err}`);
    }
  };

  // Helper function to get status based on quantity
  const getItemStatus = (quantity) => {
    if (quantity === 0) {
      return <span className="text-red-600 font-semibold">Out of Stock</span>;
    } else if (quantity <= 10) {
      return <span className="text-yellow-600 font-semibold">Low Stock</span>;
    } else {
      return <span className="text-green-600 font-semibold">In Stock</span>;
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
            {interactionAlert && (
              <div className="text-red-600 font-semibold">{interactionAlert}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Counseling Note</label>
              <textarea
                name="counselingNote"
                value={counselingNote}
                onChange={(e) => setCounselingNote(e.target.value)}
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={status === 'loading'}>
              Dispense
            </button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Inventory</h3>
          {status === 'loading' ? (
            <div className="text-center py-4">Loading inventory...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 border text-left">ID</th>
                    <th className="py-2 px-4 border text-left">Item Name</th>
                    <th className="py-2 px-4 border text-left">Quantity</th>
                    <th className="py-2 px-4 border text-left">Last Updated</th>
                    <th className="py-2 px-4 border text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(items) && items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{item.id}</td>
                        <td className="py-2 px-4 border">{item.item_name}</td>
                        <td className="py-2 px-4 border">{item.quantity}</td>
                        <td className="py-2 px-4 border">
                          {new Date(item.last_updated).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border">
                          {getItemStatus(item.quantity)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-4 px-4 border text-center text-gray-500">
                        No inventory items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;