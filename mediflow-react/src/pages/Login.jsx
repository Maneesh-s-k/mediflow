import React, { useState } from 'react';
import { useAuth } from '../context/Authcontext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // In a real app, you would validate credentials with an API
    // For demo purposes, we'll use hardcoded credentials
    if (email === 'doctor@mediflow.com' && password === 'password123') {
      login({
        id: 'DOC001',
        name: 'Dr. Sarah Chen',
        email: 'doctor@mediflow.com',
        role: 'Doctor',
        department: 'Cardiology',
        avatar: 'DS'
      });
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center">
            <span className="text-4xl bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">MEDI</span>
            <span className="text-4xl">FLOW</span>
          </h1>
          <p className="text-gray-400 mt-2">Hospital Management System</p>
        </div>
        
        <Card title="Login" icon="fas fa-sign-in-alt" gradient="from-blue-900 to-blue-800">
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {error && (
              <div className="bg-red-900/50 text-red-300 p-3 rounded-md border border-red-800">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <Button type="submit" variant="primary" className="w-full" icon="fas fa-sign-in-alt">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
