import React, { useState } from 'react';
import Card from '../components/common/Card';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryModal from '../components/inventory/Inventory_Modal';
import { inventoryData as initialData } from '../data/inventoryData';

const InventoryManagement = () => {
  const [items, setItems] = useState(initialData);
  const [editingItem, setEditingItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleSave = (item) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        // Edit
        return prev.map(i => i.id === item.id ? item : i);
      } else {
        // Add
        return [...prev, item];
      }
    });
  };

  return (
    <div>
      <Card
        title="Inventory Management"
        icon="fas fa-pills"
        gradient="from-amber-900 to-amber-800"
        actions={
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={handleAdd}
          >
            <i className="fas fa-plus mr-1"></i> Add Item
          </button>
        }
      >
        <InventoryTable items={items} onEdit={handleEdit} />
      </Card>
      <InventoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};

export default InventoryManagement;
