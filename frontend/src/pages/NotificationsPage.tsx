import React from 'react';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { NotificationCenter } from '@/components/Notifications/NotificationCenter';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600 mb-8">Manage all system and bin status notifications</p>

            <NotificationCenter />
          </div>
        </main>
      </div>
    </div>
  );
};
