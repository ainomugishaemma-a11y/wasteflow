import React from 'react';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const UsersPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-2">Manage system users and their roles</p>
              </div>
              <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                <Plus size={20} />
                <span>Add User</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Joined</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Admin User</td>
                    <td className="px-4 py-3">admin@wasteflow.com</td>
                    <td className="px-4 py-3"><span className="badge bg-purple-100 text-purple-800">Admin</span></td>
                    <td className="px-4 py-3"><span className="badge badge-success">Active</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">Jan 1, 2024</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Waste Manager</td>
                    <td className="px-4 py-3">waste.manager@hospital.com</td>
                    <td className="px-4 py-3"><span className="badge bg-blue-100 text-blue-800">Waste Manager</span></td>
                    <td className="px-4 py-3"><span className="badge badge-success">Active</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">Jan 5, 2024</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
