import React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const UsersPage: React.FC = () => {
  return (
    <Layout
      title="User Management"
      subtitle="Manage system users and their roles"
      maxWidth="lg"
      headerRight={
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base">
          <Plus size={20} />
          <span>Add User</span>
        </button>
      }
    >
      <div className="card overflow-x-auto -mx-4 sm:-mx-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Status</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Joined</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">Admin User</td>
              <td className="px-4 py-3 text-xs sm:text-sm">admin@wasteflow.com</td>
              <td className="px-4 py-3"><span className="badge bg-purple-100 text-purple-800 text-xs">Admin</span></td>
              <td className="px-4 py-3 hidden sm:table-cell"><span className="badge badge-success">Active</span></td>
              <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">Jan 1, 2024</td>
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
              <td className="px-4 py-3 text-xs sm:text-sm">waste.manager@hospital.com</td>
              <td className="px-4 py-3"><span className="badge bg-blue-100 text-blue-800 text-xs">Waste Manager</span></td>
              <td className="px-4 py-3 hidden sm:table-cell"><span className="badge badge-success">Active</span></td>
              <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">Jan 5, 2024</td>
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
    </Layout>
  );
};
