import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { DashboardCards } from '@/components/Dashboard/DashboardCards';
import { BinCapacityChart } from '@/components/Dashboard/BinCapacityChart';
import { DailyReportChart } from '@/components/Dashboard/DailyReportChart';
import { BinMap } from '@/components/Dashboard/BinMap';
import api from '@/services/api';

interface DashboardStats {
  totalBins: number;
  availableBins: number;
  nearlyFullBins: number;
  fullBins: number;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBins: 0,
    availableBins: 0,
    nearlyFullBins: 0,
    fullBins: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome to WasteFlow - Healthcare Waste Management System</p>

            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ) : (
              <>
                <DashboardCards stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <BinCapacityChart data={[]} isLoading={false} />
                  </div>
                  <div>
                    <DailyReportChart data={stats} isLoading={false} />
                  </div>
                </div>

                <div className="mt-6">
                  <BinMap bins={[]} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
