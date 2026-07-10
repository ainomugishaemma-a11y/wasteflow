import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b-4 border-primary-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              WF
            </div>
            <span className="text-xl font-bold text-gray-900">WasteFlow</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <Link to="/notifications" className="relative text-gray-600 hover:text-primary-600 transition">
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Settings */}
            <Link to="/settings" className="text-gray-600 hover:text-primary-600 transition">
              <Settings size={24} />
            </Link>

            {/* User Profile */}
            <div className="flex items-center space-x-2 pl-6 border-l border-gray-200">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.fullname}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
