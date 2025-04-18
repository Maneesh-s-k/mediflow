// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import DepartmentLoad from '../components/dashboard/DepartmentLoad';
import RecentActivity from '../components/dashboard/RecentActivity';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    patientQueue: { count: 0, avgWaitTime: 0 },
    bedStatus: { available: 0, occupancyRate: 0 },
    inventory: { lowStock: 0, critical: 0 }
  });
  
  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
    };
    
    loadDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadDashboardData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <i className="fas fa-chart-pie mr-2 text-blue-400"></i> Hospital Overview
        <span className="ml-2 text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">Live Data</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Patients in Queue"
          value={dashboardData.patientQueue.count}
          subtitle={`Avg. Wait: ${dashboardData.patientQueue.avgWaitTime} min`}
          icon="fas fa-users"
          color="blue"
        />
        
        <StatCard 
          title="Available Beds"
          value={dashboardData.bedStatus.available}
          subtitle={`Occupancy: ${dashboardData.bedStatus.occupancyRate}%`}
          icon="fas fa-bed"
          color="indigo"
        />
        
        <StatCard 
          title="Low Stock Items"
          value={dashboardData.inventory.lowStock}
          subtitle={`Critical: ${dashboardData.inventory.critical} items`}
          icon="fas fa-pills"
          color="amber"
        />
        
        <StatCard 
          title="Staff On Duty"
          value={12}
          subtitle="Doctors: 5 | Nurses: 7"
          icon="fas fa-user-md"
          color="emerald"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity />
          <DepartmentLoad />
        </div>
        
        <div className="space-y-6">
          {/* Quick Actions, Alerts, System Status components */}
          {/* These would be additional components you'd create */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
