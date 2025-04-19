import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Patient Queue"
          value={dashboardData.patientQueue.count || "142"}
          subtitle={`Avg Wait: ${dashboardData.patientQueue.avgWaitTime || "24"} mins`}
          icon={<i className="fas fa-users"></i>}
          color="blue"
          onClick={() => navigate('/patient-queue')}
        />
        <StatCard
          title="Available Beds"
          value={dashboardData.bedStatus.available || "35"}
          subtitle={`Occupancy: ${dashboardData.bedStatus.occupancyRate || "82.5"}%`}
          icon={<i className="fas fa-bed"></i>}
          color="emerald"
          onClick={() => navigate('/bed-management')}
        />
        <StatCard
          title="Inventory Low Stock"
          value={dashboardData.inventory.lowStock || "48"}
          subtitle={`Critical: ${dashboardData.inventory.critical || "12"}`}
          icon={<i className="fas fa-pills"></i>}
          color="amber"
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Staff On Duty"
          value="45"
          subtitle="Doctors and Nurses"
          icon={<i className="fas fa-user-md"></i>}
          color="indigo"
          onClick={() => navigate('/staff')}
        />
      </div>
      
      {/* Stack components vertically */}
      <div className="grid grid-cols-1 gap-6">
        <RecentActivity />
        <DepartmentLoad />
      </div>
    </div>
  );
};

export default Dashboard;
