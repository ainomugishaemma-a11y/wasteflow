import { Request, Response } from 'express';
import { BinModel } from '../models/Bin';
import { NotificationModel } from '../models/Notification';
import logger from '../utils/logger';

const BinController = {
  async updateBinFromArduino(req: Request, res: Response) {
    try {
      const { bin_code, capacity_percentage, status } = req.body;

      if (!bin_code || capacity_percentage == null || !status) {
        res.status(400).json({ error: 'bin_code, capacity_percentage, and status are required' });
        return;
      }

      const bin = await BinModel.findByCode(bin_code);
      if (!bin || !bin.id) {
        res.status(404).json({ error: 'Bin not found' });
        return;
      }

      await BinModel.update(bin.id, {
        capacity_percentage,
        status,
        last_update: new Date().toISOString(),
      });

      if (status === 'full') {
        await NotificationModel.notifyWasteManagers(
          bin.id,
          `Bin ${bin_code} is full`,
          `Bin ${bin_code} at ${bin.location} has reached ${capacity_percentage}% capacity and needs collection.`,
          'full'
        );
      } else if (status === 'nearly_full') {
        await NotificationModel.notifyWasteManagers(
          bin.id,
          `Bin ${bin_code} is nearly full`,
          `Bin ${bin_code} at ${bin.location} is at ${capacity_percentage}% capacity.`,
          'nearly_full'
        );
      }

      const updatedBin = await BinModel.findById(bin.id);
      res.json({ message: 'Bin update received', bin: updatedBin });
    } catch (error) {
      logger.error('Update bin from Arduino error:', error);
      res.status(500).json({ error: 'Failed to update bin from Arduino' });
    }
  },

  async getAllBins(req: Request, res: Response) {
    try {
      const { hospital_id, status } = req.query;
      const bins = await BinModel.findAll(hospital_id ? parseInt(hospital_id as string) : undefined, status as string | undefined);
      res.json({ bins });
    } catch (error) {
      logger.error('Get all bins error:', error);
      res.status(500).json({ error: 'Failed to fetch bins' });
    }
  },

  async getBinById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bin = await BinModel.findById(parseInt(id));
      if (!bin) {
        res.status(404).json({ error: 'Bin not found' });
        return;
      }
      res.json({ bin });
    } catch (error) {
      logger.error('Get bin by id error:', error);
      res.status(500).json({ error: 'Failed to fetch bin' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { bin_code, location, hospital_id, capacity_percentage, status, latitude, longitude } = req.body;

      if (!bin_code || !location || !hospital_id) {
        res.status(400).json({ error: 'bin_code, location, and hospital_id are required' });
        return;
      }

      const id = await BinModel.create({
        bin_code,
        location,
        hospital_id,
        capacity_percentage: capacity_percentage ?? 0,
        status: status || 'available',
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      } as any);

      const createdBin = await BinModel.findById(id);
      res.status(201).json({ bin: createdBin });
    } catch (error) {
      logger.error('Create bin error:', error);
      res.status(500).json({ error: 'Failed to create bin' });
    }
  },

  async updateBin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await BinModel.update(parseInt(id), updates);
      if (!updated) {
        res.status(404).json({ error: 'Bin not found' });
        return;
      }
      const bin = await BinModel.findById(parseInt(id));
      res.json({ bin });
    } catch (error) {
      logger.error('Update bin error:', error);
      res.status(500).json({ error: 'Failed to update bin' });
    }
  },

  async deleteBin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await BinModel.delete(parseInt(id));
      if (!deleted) {
        res.status(404).json({ error: 'Bin not found' });
        return;
      }
      res.json({ message: 'Bin deleted' });
    } catch (error) {
      logger.error('Delete bin error:', error);
      res.status(500).json({ error: 'Failed to delete bin' });
    }
  },

  async getBinHistory(req: Request, res: Response) {
    try {
      const { bin_id, days = 7 } = req.query;
      if (!bin_id) {
        res.status(400).json({ error: 'bin_id required' });
        return;
      }
      const history = await BinModel.getHistory(parseInt(bin_id as string), parseInt(days as string));
      res.json({ history });
    } catch (error) {
      logger.error('Get bin history error:', error);
      res.status(500).json({ error: 'Failed to fetch bin history' });
    }
  },
};

export default BinController;
