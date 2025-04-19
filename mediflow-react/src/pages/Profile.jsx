// src/pages/Profile.jsx
import React from 'react';
import { useAuth } from '../context/Authcontext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return <div className="flex justify-center items-center h-64">Loading user information...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Card title="Profile Picture" icon="fas fa-user-circle" gradient="from-purple-900 to-purple-800">
            <div className="p-4 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-3xl font-bold mb-4">
                {user?.avatar || user?.name?.charAt(0)}
              </div>
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-gray-400">{user?.role}</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card title="Personal Information" icon="fas fa-id-card" gradient="from-blue-900 to-blue-800">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="font-medium">{user?.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="font-medium">{user?.role}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Specialty</p>
                <p className="font-medium">{user?.specialty || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Contact</p>
                <p className="font-medium">{user?.contact || 'Not specified'}</p>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button 
                  variant="primary" 
                  icon="fas fa-edit" 
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
