import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color }) => {
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

  const unitText = title.toLowerCase().includes('staff') 
    ? 'staff' 
    : title.toLowerCase().includes('bed') 
      ? 'beds' 
      : title.toLowerCase().includes('item') 
        ? 'items' 
        : 'patients';

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradientMap[color]} p-6 shadow-lg border ${borderMap[color]} hover:shadow-${color}-900/20 hover:-translate-y-1 transition-all duration-300 group`}>
      <div className={`absolute top-0 right-0 -mt-4 -mr-12 h-32 w-32 rounded-full ${bgMap[color]} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
      <div className={`absolute bottom-0 left-0 -mb-4 -ml-4 h-16 w-16 rounded-full ${bgMap[color]} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-xs font-semibold uppercase tracking-wider ${textMap[color]}`}>{title}</div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-${color}-800/50`}>
            <i className={`${icon} ${textMap[color]}`}></i>
          </div>
        </div>
        <div className="flex items-end space-x-1">
          <span className="text-3xl font-bold animate-pulse-slow">{value}</span>
          <span className={`text-sm ${textMap[color]} mb-1`}>{unitText}</span>
        </div>
        <div className={`mt-3 flex items-center text-xs ${textMap[color]}`}>
          <i className="fas fa-info-circle mr-1"></i> {subtitle}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
