import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CollectionRecordModel } from '../models/CollectionRecord';
import { ActivityLogModel } from '../models/ActivityLog';
import logger from '../utils/logger';

export class ReportController {
  static async getDailyReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { date, hospital_id } = req.query;
      
      const startDate = date ? new Date(date as string) : new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const records = await CollectionRecordModel.getReports(
        startDate,
        endDate,
        hospital_id ? parseInt(hospital_id as string) : undefined
      );

      res.json({
        reportType: 'daily',
        date: startDate.toLocaleDateString(),
        totalCollections: records.length,
        records,
      });
    } catch (error) {
      logger.error('Get daily report error:', error);
      res.status(500).json({ error: 'Failed to fetch daily report' });
    }
  }

  static async getWeeklyReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { hospital_id } = req.query;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date();

      const records = await CollectionRecordModel.getReports(
        startDate,
        endDate,
        hospital_id ? parseInt(hospital_id as string) : undefined
      );

      res.json({
        reportType: 'weekly',
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        totalCollections: records.length,
        records,
      });
    } catch (error) {
      logger.error('Get weekly report error:', error);
      res.status(500).json({ error: 'Failed to fetch weekly report' });
    }
  }

  static async getMonthlyReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { hospital_id } = req.query;
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      const records = await CollectionRecordModel.getReports(
        startDate,
        endDate,
        hospital_id ? parseInt(hospital_id as string) : undefined
      );

      res.json({
        reportType: 'monthly',
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        totalCollections: records.length,
        records,
      });
    } catch (error) {
      logger.error('Get monthly report error:', error);
      res.status(500).json({ error: 'Failed to fetch monthly report' });
    }
  }

  static async getCollectionHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { bin_id, limit = 50 } = req.query;

      if (!bin_id) {
        res.status(400).json({ error: 'bin_id required' });
        return;
      }

      const records = await CollectionRecordModel.findByBinId(
        parseInt(bin_id as string),
        parseInt(limit as string)
      );

      res.json({
        bin_id,
        total: records.length,
        records,
      });
    } catch (error) {
      logger.error('Get collection history error:', error);
      res.status(500).json({ error: 'Failed to fetch collection history' });
    }
  }
}

export default ReportController;
