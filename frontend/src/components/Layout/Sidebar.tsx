import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trash2, Bell, FileText, Users, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { sidebarOpen, closeSidebar } = useLayout();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'waste_manager', 'hospital_admin', 'collection_personnel'] },
    { path: '/bins', label: 'Bins Monitoring', icon: Trash2, roles: ['admin', 'waste_manager', 'hospital_admin', 'collection_personnel'] },
    { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'waste_manager', 'hospital_admin', 'collection_personnel'] },
    { path: '/reports', label: 'Reports', icon: FileText, roles: ['admin', 'waste_manager', 'hospital_admin'] },
    { path: '/users', label: 'Users', icon: Users, roles: ['admin', 'hospital_admin'] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-bold text-gray-900">Menu</h2>
        <button onClick={closeSidebar} className="lg:hidden p-1 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <nav className="space-y-2 px-4">
        {visibleItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 p-4 bg-primary-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Role:</span> {user?.role.replace('_', ' ').toUpperCase()}
        </p>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:block relative bg-white w-64 min-h-screen shadow-lg border-r border-gray-200 shrink-0">
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeSidebar} />
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-2xl z-50 overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
