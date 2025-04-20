// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import DepartmentLoad from '../components/dashboard/DepartmentLoad';
import RecentActivity from '../components/dashboard/RecentActivity';
import { fetchDashboardData } from '../api/dashboardApi';
import { fetchRecentActivity } from '../api/dashboardApi';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    patientQueue: { count: 0, avgWaitTime: 0 },
    bedStatus: { available: 0, occupancyRate: 0 },
    inventory: { lowStock: 0, critical: 0 },
    staffOnDuty: { total: 0, doctors: 0, nurses: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add state for activities
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error(err);
      }
    };
    
    const loadActivities = async () => {
      try {
        setActivitiesLoading(true);
        const data = await fetchRecentActivity();
        setActivities(data);
        setActivitiesLoading(false);
      } catch (err) {
        setActivitiesError('Failed to load recent activities');
        setActivitiesLoading(false);
        console.error(err);
      }
    };
    
    loadDashboardData();
    loadActivities();
    
    // Refresh data every 5 minutes
    const dashboardInterval = setInterval(loadDashboardData, 300000);
    // Refresh activities every 2 minutes
    const activitiesInterval = setInterval(loadActivities, 120000);
    
    return () => {
      clearInterval(dashboardInterval);
      clearInterval(activitiesInterval);
    };
  }, []);

  return (
    <div>
      {error && (
        <div className="bg-red-900/50 text-red-300 p-4 mb-6 rounded-lg border border-red-800">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Patient Queue"
          value={loading ? "..." : dashboardData.patientQueue.count}
          subtitle={`Avg Wait: ${loading ? "..." : dashboardData.patientQueue.avgWaitTime} mins`}
          icon={<i className="fas fa-users"></i>}
          color="blue"
          onClick={() => navigate('/patient-queue')}
          loading={loading}
        />
        <StatCard
          title="Available Beds"
          value={loading ? "..." : dashboardData.bedStatus.available}
          subtitle={`Occupancy: ${loading ? "..." : dashboardData.bedStatus.occupancyRate}%`}
          icon={<i className="fas fa-bed"></i>}
          color="emerald"
          onClick={() => navigate('/bed-management')}
          loading={loading}
        />
        <StatCard
          title="Inventory Low Stock"
          value={loading ? "..." : dashboardData.inventory.lowStock}
          subtitle={`Critical: ${loading ? "..." : dashboardData.inventory.critical}`}
          icon={<i className="fas fa-pills"></i>}
          color="amber"
          onClick={() => navigate('/inventory')}
          loading={loading}
        />
        <StatCard
          title="Staff On Duty"
          value={loading ? "..." : dashboardData.staffOnDuty.total}
          subtitle={`${loading ? "..." : dashboardData.staffOnDuty.doctors} doctors, ${loading ? "..." : dashboardData.staffOnDuty.nurses} nurses`}
          icon={<i className="fas fa-user-md"></i>}
          color="indigo"
          onClick={() => navigate('/staff')}
          loading={loading}
        />
      </div>
      
      {/* Changed from grid to flex column layout */}
      <div className="flex flex-col space-y-6">
        <RecentActivity 
          activities={activities} 
          loading={activitiesLoading} 
          error={activitiesError} 
        />
        <DepartmentLoad />
      </div>
    </div>
  );
};

export default Dashboard;
