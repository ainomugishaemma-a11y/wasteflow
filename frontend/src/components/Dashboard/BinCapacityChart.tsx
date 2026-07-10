import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BinCapacityChartProps {
  data?: any[];
  isLoading?: boolean;
}

export const BinCapacityChart: React.FC<BinCapacityChartProps> = ({ data = [], isLoading = false }) => {
  const chartData = data.map(item => ({
    date: new Date(item.recorded_at).toLocaleDateString(),
    capacity: item.capacity_percentage,
  }));

  if (isLoading) {
    return <div className="card animate-pulse h-80"></div>;
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Bin Capacity Trend (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="capacity" stroke="#16a34a" strokeWidth={2} name="Capacity %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
