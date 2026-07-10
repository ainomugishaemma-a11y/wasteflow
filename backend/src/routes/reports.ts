import { Router } from 'express';
import ReportController from '../controllers/reportController';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/daily', authenticateToken, ReportController.getDailyReport);
router.get('/weekly', authenticateToken, ReportController.getWeeklyReport);
router.get('/monthly', authenticateToken, ReportController.getMonthlyReport);
router.get('/collection-history', authenticateToken, ReportController.getCollectionHistory);

export default router;
