import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface DashboardCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

export const DashboardCards: React.FC<{ stats: any }> = ({ stats }) => {
  const cards: DashboardCard[] = [
    {
      title: 'Total Bins',
      value: stats.totalBins || 0,
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Available Bins',
      value: stats.availableBins || 0,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Nearly Full',
      value: stats.nearlyFullBins || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Full Bins',
      value: stats.fullBins || 0,
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`p-4 rounded-lg ${card.color}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
