import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color, onClick }) => {
  const gradientMap = {
    blue: 'from-blue-900 to-blue-800',
    indigo: 'from-indigo-900 to-indigo-800',
    amber: 'from-amber-900 to-amber-800',
    emerald: 'from-emerald-900 to-emerald-800',
    red: 'from-red-900 to-red-800',
    purple: 'from-purple-900 to-purple-800',
  };

  const textMap = {
    blue: 'text-blue-300',
    indigo: 'text-indigo-300',
    amber: 'text-amber-300',
    emerald: 'text-emerald-300',
    red: 'text-red-300',
    purple: 'text-purple-300',
  };

  const bgMap = {
    blue: 'bg-blue-600',
    indigo: 'bg-indigo-600',
    amber: 'bg-amber-600',
    emerald: 'bg-emerald-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
  };

  const borderMap = {
    blue: 'border-blue-800',
    indigo: 'border-indigo-800',
    amber: 'border-amber-800',
    emerald: 'border-emerald-800',
    red: 'border-red-800',
    purple: 'border-purple-800',
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 bg-gradient-to-br ${gradientMap[color]} border ${borderMap[color]} hover:brightness-110 transition-all`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onClick(); }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${textMap[color]}`}>{title}</h3>
          <p className={`text-3xl font-bold text-white`}>{value}</p>
          <p className={`text-sm ${textMap[color]}`}>{subtitle}</p>
        </div>
        <div className={`text-4xl text-white`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
