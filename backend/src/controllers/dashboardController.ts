import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { BinModel } from '../models/Bin';
import logger from '../utils/logger';

export class DashboardController {
  static async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { hospital_id } = req.query;
      
      const stats = await BinModel.getStats(
        hospital_id ? parseInt(hospital_id as string) : undefined
      );

      res.json({
        totalBins: stats.total || 0,
        availableBins: stats.available || 0,
        nearlyFullBins: stats.nearly_full || 0,
        fullBins: stats.full || 0,
      });
    } catch (error) {
      logger.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  }

  static async getCapacityTrend(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { bin_id, days = 7 } = req.query;

      if (!bin_id) {
        res.status(400).json({ error: 'bin_id required' });
        return;
      }

      const history = await BinModel.getHistory(parseInt(bin_id as string), parseInt(days as string));

      // Group by date
      const trendData = history.map(h => ({
        date: new Date(h.recorded_at).toLocaleDateString(),
        capacity: h.capacity_percentage,
        status: h.status,
      }));

      res.json({
        bin_id,
        days: parseInt(days as string),
        trend: trendData,
      });
    } catch (error) {
      logger.error('Get capacity trend error:', error);
      res.status(500).json({ error: 'Failed to fetch trend data' });
    }
  }

  static async getDailyReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { hospital_id } = req.query;
      
      const bins = await BinModel.findAll(
        hospital_id ? parseInt(hospital_id as string) : undefined
      );

      const report = {
        date: new Date().toLocaleDateString(),
        totalBins: bins.length,
        byCategoryCount: {
          available: bins.filter(b => b.status === 'available').length,
          nearlyFull: bins.filter(b => b.status === 'nearly_full').length,
          full: bins.filter(b => b.status === 'full').length,
        },
        byCapacity: {
          low: bins.filter(b => b.capacity_percentage < 50).length,
          medium: bins.filter(b => b.capacity_percentage >= 50 && b.capacity_percentage < 80).length,
          high: bins.filter(b => b.capacity_percentage >= 80).length,
        },
      };

      res.json(report);
    } catch (error) {
      logger.error('Get daily report error:', error);
      res.status(500).json({ error: 'Failed to fetch daily report' });
    }
  }

  static async getWeeklyCollectionReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      // This would query collection_records table
      // For now, return sample data structure
      const report = {
        week: 'Current Week',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        endDate: new Date().toLocaleDateString(),
        totalCollections: 0,
        collectionsPerDay: [
          { day: 'Monday', count: 0 },
          { day: 'Tuesday', count: 0 },
          { day: 'Wednesday', count: 0 },
          { day: 'Thursday', count: 0 },
          { day: 'Friday', count: 0 },
          { day: 'Saturday', count: 0 },
          { day: 'Sunday', count: 0 },
        ],
      };

      res.json(report);
    } catch (error) {
      logger.error('Get weekly report error:', error);
      res.status(500).json({ error: 'Failed to fetch weekly report' });
    }
  }
}

export default DashboardController;
