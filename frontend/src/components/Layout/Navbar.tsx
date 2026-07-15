import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Settings, User, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useLayout } from '@/context/LayoutContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { toggleSidebar } = useLayout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b-4 border-primary-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition">
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                WF
              </div>
              <span className="text-xl font-bold text-gray-900">WasteFlow</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link to="/notifications" className="relative text-gray-600 hover:text-primary-600 transition">
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link to="/settings" className="text-gray-600 hover:text-primary-600 transition">
              <Settings size={24} />
            </Link>

            <div className="flex items-center space-x-2 pl-4 sm:pl-6 border-l border-gray-200">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.fullname}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>

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
