import React from 'react';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { BinList } from '@/components/Bins/BinList';

export const BinsPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Bin Monitoring</h1>
            <p className="text-gray-600 mb-8">Track and manage all healthcare waste bins in real-time</p>

            <BinList />
          </div>
        </main>
      </div>
    </div>
  );
};
