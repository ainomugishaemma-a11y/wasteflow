import React from 'react';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';

export const SettingsPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600 mb-8">Manage your account and preferences</p>

            {/* Account Settings */}
            <div className="card mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Admin User"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@wasteflow.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="card mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-600" />
                  <span className="ml-2 text-gray-700">Receive email notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-600" />
                  <span className="ml-2 text-gray-700">Receive SMS notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-600" />
                  <span className="ml-2 text-gray-700">Get daily summary reports</span>
                </label>
              </div>
            </div>

            {/* Security */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Security</h2>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Change Password
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
