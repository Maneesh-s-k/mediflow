import React, { useState } from 'react';
import Card from '../components/common/Card';
import LineChart from '../components/analytics/line_chart';
import BarChart from '../components/analytics/bar_chart';
import UtilizationCard from '../components/analytics/utilization_card';
import { 
  patientFlowData, 
  departmentUtilizationData, 
  resourceUtilizationData,
  waitTimeData
} from '../data/analyticsData';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('daily');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded text-sm ${timeRange === 'daily' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${timeRange === 'weekly' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${timeRange === 'monthly' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
      
      {/* Resource Utilization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UtilizationCard 
          title="Bed Utilization"
          value={resourceUtilizationData.beds.occupied}
          total={resourceUtilizationData.beds.total}
          percentage={resourceUtilizationData.beds.utilization}
          icon="fas fa-bed"
          color="blue"
        />
        <UtilizationCard 
          title="Staff Distribution"
          value={resourceUtilizationData.staff.doctors + resourceUtilizationData.staff.nurses}
          total={Object.values(resourceUtilizationData.staff).reduce((a, b) => a + b, 0)}
          percentage={75}
          icon="fas fa-user-md"
          color="green"
        />
        <UtilizationCard 
          title="Inventory Status"
          value={resourceUtilizationData.inventory.total - resourceUtilizationData.inventory.lowStock - resourceUtilizationData.inventory.critical}
          total={resourceUtilizationData.inventory.total}
          percentage={90}
          icon="fas fa-pills"
          color="amber"
        />
      </div>
      
      {/* Patient Flow Chart */}
      <Card title="Patient Flow" icon="fas fa-chart-line" gradient="from-blue-900 to-blue-800">
        <LineChart 
          data={patientFlowData.daily}
          title="Patient Flow Trends"
          xKey="date"
          yKeys={['admissions', 'discharges', 'emergency']}
          colors={['#3b82f6', '#10b981', '#f59e0b']}
          height={300}
        />
      </Card>
      
      {/* Department Utilization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Department Utilization" icon="fas fa-hospital" gradient="from-emerald-900 to-emerald-800">
          <BarChart 
            data={departmentUtilizationData}
            title="Bed Utilization by Department"
            nameKey="department"
            valueKey="utilization"
            color="green"
          />
        </Card>
        
        <Card title="Wait Times" icon="fas fa-clock" gradient="from-amber-900 to-amber-800">
          <BarChart 
            data={waitTimeData}
            title="Average Wait Times (minutes)"
            nameKey="department"
            valueKey="averageWait"
            targetKey="target"
            color="amber"
          />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
