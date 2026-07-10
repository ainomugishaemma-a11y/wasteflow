import React from 'react';
import { MapPin } from 'lucide-react';

interface BinLocation {
  id: number;
  bin_code: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
}

interface BinMapProps {
  bins?: BinLocation[];
}

export const BinMap: React.FC<BinMapProps> = ({ bins = [] }) => {
  return (
    <div className="card h-96">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Bin Locations Map</h2>
      <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Map integration coming soon</p>
          <p className="text-sm text-gray-500">Google Maps or similar service integration</p>
          {bins.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700">{bins.length} bins tracked</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
