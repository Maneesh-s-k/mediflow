import React, { useState } from 'react';
import { useAuth } from '../context/Authcontext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    contact: user?.contact || '',
    bio: user?.bio || '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Card title="Profile Picture" icon="fas fa-user-circle" gradient="from-purple-900 to-purple-800">
            <div className="p-4 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-3xl font-bold mb-4">
                {user?.avatar || user?.name?.charAt(0)}
              </div>
              
              <Button variant="outline" size="sm" icon="fas fa-camera">
                Change Photo
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card title="Personal Information" icon="fas fa-id-card" gradient="from-blue-900 to-blue-800">
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {message.text && (
                <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-800' : 'bg-red-900/50 text-red-300 border border-red-800'}`}>
                  {message.text}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="department" className="block text-sm font-medium">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contact" className="block text-sm font-medium">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="submit" variant="primary" icon="fas fa-save">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
