// src/components/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color, onClick, loading = false }) => {
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

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 bg-gradient-to-br ${gradientMap[color]} border-gray-700 hover:brightness-110 transition-all`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onClick(); }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${textMap[color]}`}>{title}</h3>
          {loading ? (
            <div className="h-8 w-16 bg-gray-700 animate-pulse rounded mt-1 mb-2"></div>
          ) : (
            <p className={`text-3xl font-bold text-white`}>{value}</p>
          )}
          {loading ? (
            <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <p className={`text-sm ${textMap[color]}`}>{subtitle}</p>
          )}
        </div>
        <div className={`text-4xl text-white`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
