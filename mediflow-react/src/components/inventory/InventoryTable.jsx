import React from 'react';

const statusColors = {
  ok: 'bg-green-600',
  low: 'bg-amber-500',
  critical: 'bg-red-600',
  out: 'bg-gray-600'
};

const InventoryTable = ({ items, onEdit }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700/50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Item</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Stock</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Min Stock</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Last Updated</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {items.length === 0 ? (
          <tr>
            <td colSpan="8" className="px-4 py-3 text-center text-gray-400">No inventory items found.</td>
          </tr>
        ) : (
          items.map(item => (
            <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm">{item.id}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{item.name}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{item.category}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{item.stock} {item.unit}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{item.minStock} {item.unit}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[item.status] || 'bg-gray-600'} text-white`}>
                  {item.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{item.lastUpdated}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <button
                  onClick={() => onEdit(item)}
                  className="btn btn-sm btn-primary p-1 bg-blue-600 hover:bg-blue-500 rounded"
                  title="Edit"
                >
                  <i className="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default InventoryTable;
