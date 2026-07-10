import { Router } from 'express';
import BinController from '../controllers/binController';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// Arduino endpoint - can be public with API key verification in production
router.post('/update', BinController.updateBinFromArduino);

// Protected routes
router.get('/', authenticateToken, BinController.getAllBins);
router.get('/:id', authenticateToken, BinController.getBinById);
router.post('/', authenticateToken, authorize('admin'), BinController.create);
router.put('/:id', authenticateToken, authorize('admin'), BinController.updateBin);
router.delete('/:id', authenticateToken, authorize('admin'), BinController.deleteBin);
router.get('/:id/history', authenticateToken, BinController.getBinHistory);

export default router;
