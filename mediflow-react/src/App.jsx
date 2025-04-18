
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import PatientQueue from './pages/PatientQueue';
import VitalsCapture from './pages/VitalsCapture';
import PatientAdmission from './pages/PatientAdmission';
import BedManagement from './pages/BedManagement';
import InventoryManagement from './pages/InventoryManagement';
import StaffManagement from './pages/StaffManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-6 mt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient-queue" element={<PatientQueue />} />
            <Route path="/vitals-capture" element={<VitalsCapture />} />
            <Route path="/patient-admission" element={<PatientAdmission />} />
            <Route path="/bed-management" element={<BedManagement />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
