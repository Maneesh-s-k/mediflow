import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

const InventoryModal = ({ open, onClose, onSave, item }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    category: '',
    stock: 0,
    minStock: 0,
    unit: '',
    status: 'ok'
  });

  useEffect(() => {
    if (item) {
      setForm(item);
    } else {
      setForm({
        id: '',
        name: '',
        category: '',
        stock: 0,
        minStock: 0,
        unit: '',
        status: 'ok'
      });
    }
  }, [item]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{item ? 'Edit' : 'Add'} Inventory Item</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="id" value={form.id} onChange={handleChange} placeholder="ID" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
          <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
          <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
          <input type="number" name="minStock" value={form.minStock} onChange={handleChange} placeholder="Min Stock" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
          <input type="text" name="unit" value={form.unit} onChange={handleChange} placeholder="Unit" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
          <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700">
            <option value="ok">OK</option>
            <option value="low">Low</option>
            <option value="critical">Critical</option>
            <option value="out">Out</option>
          </select>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">{item ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
