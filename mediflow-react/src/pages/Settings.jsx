// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    language: 'en',
    fontSize: 'medium',
    autoRefresh: true,
    refreshInterval: 5,
    colorBlindMode: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mediflow_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings to localStorage
    localStorage.setItem('mediflow_settings', JSON.stringify(settings));
    setMessage({ type: 'success', text: 'Settings saved successfully!' });
    
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'dark',
      notifications: true,
      language: 'en',
      fontSize: 'medium',
      autoRefresh: true,
      refreshInterval: 5,
      colorBlindMode: false
    };
    setSettings(defaultSettings);
    localStorage.setItem('mediflow_settings', JSON.stringify(defaultSettings));
    setMessage({ type: 'success', text: 'Settings reset to defaults!' });
    
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Application Settings</h1>
      
      {message.text && (
        <div className={`p-3 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-800' : 'bg-red-900/50 text-red-300 border border-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        <Card title="Display Settings" icon="fas fa-palette" gradient="from-purple-900 to-purple-800">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="theme" className="block text-sm font-medium">Theme</label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-medium">Language</label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fontSize" className="block text-sm font-medium">Font Size</label>
              <select
                id="fontSize"
                name="fontSize"
                value={settings.fontSize}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="colorBlindMode"
                name="colorBlindMode"
                checked={settings.colorBlindMode}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="colorBlindMode" className="ml-2 block text-sm">
                Color Blind Mode
              </label>
            </div>
          </div>
        </Card>
        
        <Card title="Notification Settings" icon="fas fa-bell" gradient="from-blue-900 to-blue-800">
          <div className="p-4 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm">
                Enable Notifications
              </label>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="refreshInterval" className="block text-sm font-medium">Auto Refresh Interval (minutes)</label>
              <input
                type="number"
                id="refreshInterval"
                name="refreshInterval"
                min="1"
                max="60"
                value={settings.refreshInterval}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRefresh"
                name="autoRefresh"
                checked={settings.autoRefresh}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="autoRefresh" className="ml-2 block text-sm">
                Enable Auto Refresh
              </label>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-end space-x-3 mt-4">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button type="button" variant="primary" icon="fas fa-save" onClick={handleSubmit}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
