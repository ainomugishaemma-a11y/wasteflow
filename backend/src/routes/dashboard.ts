import { Router } from 'express';
import DashboardController from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateToken, DashboardController.getStats);
router.get('/analytics/capacity-trend', authenticateToken, DashboardController.getCapacityTrend);
router.get('/analytics/daily-report', authenticateToken, DashboardController.getDailyReport);
router.get('/analytics/collection-report', authenticateToken, DashboardController.getWeeklyCollectionReport);

export default router;
