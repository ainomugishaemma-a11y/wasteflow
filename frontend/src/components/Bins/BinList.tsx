import React, { useEffect, useState } from 'react';
import { Bin } from '@/types';
import { binService } from '@/services/binService';
import { BinCard } from './BinCard';
import { Filter } from 'lucide-react';

export const BinList: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [filteredBins, setFilteredBins] = useState<Bin[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBins();
  }, []);

  useEffect(() => {
    filterBins();
  }, [bins, statusFilter, searchTerm]);

  const fetchBins = async () => {
    try {
      setIsLoading(true);
      const data = await binService.getAllBins(undefined, undefined, 100, 0);
      setBins(data.bins);
    } catch (error) {
      console.error('Failed to fetch bins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBins = () => {
    let filtered = bins;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(bin => bin.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(bin =>
        bin.bin_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bin.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBins(filtered);
  };

  return (
    <div>
      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by bin code or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="nearly_full">Nearly Full</option>
            <option value="full">Full</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600 mb-4">
        Showing {filteredBins.length} of {bins.length} bins
      </p>

      {/* Bins Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse h-40"></div>
          ))}
        </div>
      ) : filteredBins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBins.map(bin => (
            <BinCard key={bin.id} bin={bin} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bins found</p>
        </div>
      )}
    </div>
  );
};
