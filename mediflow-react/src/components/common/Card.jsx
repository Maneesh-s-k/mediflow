import React from 'react';

const Card = ({ 
  children, 
  title, 
  icon, 
  gradient = "from-blue-900 to-blue-800", 
  actions,
  className = "" 
}) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 ${className}`}>
      {title && (
        <div className={`bg-gradient-to-r ${gradient} px-4 py-3 flex justify-between items-center`}>
          <h3 className="font-semibold text-white flex items-center">
            {icon && <i className={`${icon} mr-2`}></i>}
            {title}
          </h3>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
