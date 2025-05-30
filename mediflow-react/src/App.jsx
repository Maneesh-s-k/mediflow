import React from 'react';
import { AnimatePresence } from 'framer-motion'; // Add this import
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/Authcontext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import PatientQueue from './pages/PatientQueue';
import VitalsCapture from './pages/VitalsCapture';
import PatientAdmission from './pages/PatientAdmission';
import BedManagement from './pages/BedManagement';
import InventoryManagement from './pages/InventoryManagement';
import StaffManagement from './pages/StaffManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Login from './pages/Login';
import ProfileSettings from './pages/ProfileSettings';
import { useAuth } from './context/Authcontext';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import PatientManagement from './pages/PatientManagement';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Your existing routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-queue" element={<PatientQueue />} />
        <Route path="/vitals-capture" element={<VitalsCapture />} />
        {/* Other routes */}
      </Routes>
    </AnimatePresence>
  );
};
// Wrapper component to conditionally render Navbar
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900"> {/* Added bg-gray-900 to fix white background when scrolling */}
      {user && <Navbar />}
      <div className={user ? "container mx-auto px-4 py-6 mt-16" : ""}>
      <main className="p-6 bg-gray-900 min-h-screen"> 
        {children}
        </main>
      </div>
      </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <Routes>
            <Route path="/login" element={
              <AppLayout>
                <Login />
              </AppLayout>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/patient-queue" element={
              <ProtectedRoute>
                <AppLayout>
                  <PatientQueue />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/vitals-capture" element={
              <ProtectedRoute>
                <AppLayout>
                  <VitalsCapture />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/patient-admission" element={
              <ProtectedRoute>
                <AppLayout>
                  <PatientAdmission />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/bed-management" element={
              <ProtectedRoute>
                <AppLayout>
                  <BedManagement />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/patients" element={
  <ProtectedRoute>
    <AppLayout>
      <PatientManagement />
    </AppLayout>
  </ProtectedRoute>
   } />
   

            <Route path="/inventory" element={
              <ProtectedRoute>
                <AppLayout>
                  <InventoryManagement />
                </AppLayout>
              </ProtectedRoute>
            } />
            
  
            <Route path="/staff" element={
              <ProtectedRoute>
                <AppLayout>
                  <StaffManagement />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalyticsDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile-settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfileSettings />
                </AppLayout>
              </ProtectedRoute>
            } />

<Route path="/profile" element={
  <ProtectedRoute>
    <AppLayout>
      <Profile />
    </AppLayout>
  </ProtectedRoute>
} />

<Route path="/edit-profile" element={
  <ProtectedRoute>
    <AppLayout>
      <EditProfile />
    </AppLayout>
  </ProtectedRoute>
} />

<Route path="/settings" element={
  <ProtectedRoute>
    <AppLayout>
      <Settings />
    </AppLayout>
  </ProtectedRoute>
} />


            
            {/* Redirect any unknown routes to dashboard if logged in, or login page if not */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;