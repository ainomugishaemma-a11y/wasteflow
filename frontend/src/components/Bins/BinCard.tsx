import React, { useEffect, useState } from 'react';
import { Bin } from '@/types';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { binService } from '@/services/binService';

export const BinCard: React.FC<{ bin: Bin }> = ({ bin }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'nearly_full':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle size={20} />;
      case 'nearly_full':
        return <Zap size={20} />;
      case 'full':
        return <AlertCircle size={20} />;
      default:
        return null;
    }
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="card card-hover">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{bin.bin_code}</h3>
          <p className="text-sm text-gray-600">{bin.location}</p>
        </div>
        <div className={`badge ${getStatusColor(bin.status)} flex items-center space-x-1`}>
          {getStatusIcon(bin.status)}
          <span className="capitalize">{bin.status.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">Fill Level</p>
          <p className="text-sm font-bold text-gray-900">{bin.capacity_percentage}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getCapacityColor(bin.capacity_percentage)}`}
            style={{ width: `${bin.capacity_percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500">
        Last updated: {new Date(bin.last_update).toLocaleString()}
      </p>
    </div>
  );
};
