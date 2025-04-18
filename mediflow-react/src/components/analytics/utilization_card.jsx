import React from 'react';

const UtilizationCard = ({ title, value, total, percentage, icon, color = 'blue' }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <i className={`${icon} text-${color}-500`}></i>
      </div>
      
      <div className="flex items-end space-x-1 mb-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-gray-400">/ {total}</span>
      </div>
      
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full bg-${color}-600`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="mt-1 text-xs text-right text-gray-400">
        {percentage}% utilization
      </div>
    </div>
  );
};

export default UtilizationCard;
