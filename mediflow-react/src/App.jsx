import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Wrapper component to conditionally render Navbar
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <>
      {user && <Navbar />}
      <div className={user ? "container mx-auto px-4 py-6 mt-16" : ""}>
        {children}
      </div>
    </>
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
