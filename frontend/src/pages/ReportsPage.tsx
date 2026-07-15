import React, { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Download } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleExport = () => {
    console.log('Exporting report:', reportType, dateRange);
  };

  return (
    <Layout
      title="Reports"
      subtitle="Generate and download waste collection reports"
      maxWidth="lg"
    >
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Report Generator</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="collection">Collection History</option>
            </select>
          </div>

          {reportType !== 'collection' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          <Download size={20} />
          <span>Export Report (CSV)</span>
        </button>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Report Preview</h2>
        <div className="overflow-x-auto -mx-4 sm:-mx-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Bin Code</th>
                <th className="px-4 py-2 text-left font-semibold">Location</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-right font-semibold">Capacity %</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">2024-01-15</td>
                <td className="px-4 py-3">BIN001</td>
                <td className="px-4 py-3">Emergency Department</td>
                <td className="px-4 py-3"><span className="badge badge-success">Available</span></td>
                <td className="px-4 py-3 text-right">45%</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">2024-01-15</td>
                <td className="px-4 py-3">BIN002</td>
                <td className="px-4 py-3">Operating Theater</td>
                <td className="px-4 py-3"><span className="badge badge-warning">Nearly Full</span></td>
                <td className="px-4 py-3 text-right">78%</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">2024-01-15</td>
                <td className="px-4 py-3">BIN003</td>
                <td className="px-4 py-3">Radiology Department</td>
                <td className="px-4 py-3"><span className="badge badge-danger">Full</span></td>
                <td className="px-4 py-3 text-right">92%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
