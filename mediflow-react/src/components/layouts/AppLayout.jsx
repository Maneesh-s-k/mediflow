// src/layouts/AppLayout.jsx (or your main layout component)
import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900"> {/* Added bg-gray-900 to ensure full coverage */}
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-900 p-6"> {/* Added bg-gray-900 here too */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
