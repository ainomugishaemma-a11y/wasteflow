import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyReportChartProps {
  data?: {
    availableBins?: number;
    nearlyFullBins?: number;
    fullBins?: number;
  };
  isLoading?: boolean;
}

export const DailyReportChart: React.FC<DailyReportChartProps> = ({ data, isLoading = false }) => {
  const chartData = [
    { category: 'Available', count: data?.availableBins || 0 },
    { category: 'Nearly Full', count: data?.nearlyFullBins || 0 },
    { category: 'Full', count: data?.fullBins || 0 },
  ];

  if (isLoading) {
    return <div className="card animate-pulse h-80"></div>;
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Daily Fill Level Report</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#16a34a" name="Bin Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
