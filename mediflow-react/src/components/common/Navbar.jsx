import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setCurrentTime(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    // Hide navbar on scroll
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      if (prevScrollPos > currentScrollPos) {
        // Scrolling UP - show navbar
        setIsVisible(true);
      } else {
        // Scrolling DOWN - hide navbar
        setIsVisible(false);
      }
      
      setPrevScrollPos(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('#userDropdownButton')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userDropdownOpen]);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800 transition-transform duration-300 ${
        isVisible ? 'transform-none' : '-translate-y-full'
      }`}
    >
      <div className="max-w-full px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white flex items-center">
              <span className="text-2xl bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">MEDI</span>
              <span className="text-2xl">FLOW</span>
              <span className="ml-2 bg-gradient-to-r from-blue-500 to-teal-400 p-1 rounded text-xs text-white">v1.0</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-1">
              <NavLink to="/" active={location.pathname === "/"}>
                <i className="fas fa-chart-line mr-2 group-hover:text-blue-400 transition-colors"></i> Dashboard
              </NavLink>
              <NavLink to="/patient-queue" active={location.pathname === "/patient-queue"}>
                <i className="fas fa-users mr-2 group-hover:text-blue-400 transition-colors"></i> Patient Queue
              </NavLink>
              <NavLink to="/vitals-capture" active={location.pathname === "/vitals-capture"}>
                <i className="fas fa-heartbeat mr-2 group-hover:text-blue-400 transition-colors"></i> Vitals Capture
              </NavLink>
              <NavLink to="/patient-admission" active={location.pathname === "/patient-admission"}>
                <i className="fas fa-procedures mr-2 group-hover:text-blue-400 transition-colors"></i> Admission
              </NavLink>
              <NavLink to="/bed-management" active={location.pathname === "/bed-management"}>
                <i className="fas fa-bed mr-2 group-hover:text-blue-400 transition-colors"></i> Bed Management
              </NavLink>
              <NavLink to="/inventory" active={location.pathname === "/inventory"}>
                <i className="fas fa-pills mr-2 group-hover:text-blue-400 transition-colors"></i> Inventory
              </NavLink>
              <NavLink to="/staff" active={location.pathname === "/staff"}>
              <i className="fas fa-user-md mr-2 group-hover:text-blue-400 transition-colors"></i> Staff
              </NavLink>
              <NavLink to="/analytics" active={location.pathname === "/analytics"}>
              <i className="fas fa-chart-bar mr-2 group-hover:text-blue-400 transition-colors"></i> Analytics
              </NavLink>

            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white flex items-center">
              <i className="fas fa-clock mr-1 text-blue-400"></i> 
              <span className="text-sm">{currentTime}</span>
            </span>
            <div className="relative">
              <button 
                id="userDropdownButton"
                className="flex items-center space-x-2 bg-gray-800 rounded-full pl-2 pr-3 py-1 border border-gray-700 hover:border-blue-500 transition-colors"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-xs font-bold">DS</span>
                <span className="text-sm">Dr. Smith</span>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700 animate-fade-in">
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700 flex items-center">
                    <i className="fas fa-user mr-2 text-blue-400"></i> Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700 flex items-center">
                    <i className="fas fa-cog mr-2 text-blue-400"></i> Settings
                  </a>
                  <div className="border-t border-gray-700 my-1"></div>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700 flex items-center">
                    <i className="fas fa-sign-out-alt mr-2 text-blue-400"></i> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper component for nav links
const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`nav-link group px-3 py-2 rounded-md transition-all duration-200 hover:bg-opacity-10 hover:bg-white ${
      active ? 'bg-white bg-opacity-10' : ''
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
