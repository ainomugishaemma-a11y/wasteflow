import { Router } from 'express';
import NotificationController from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, NotificationController.getNotifications);
router.get('/unread-count', authenticateToken, NotificationController.getUnreadCount);
router.get('/:id', authenticateToken, NotificationController.getNotificationById);
router.put('/:id/read', authenticateToken, NotificationController.markAsRead);
router.put('/read-all', authenticateToken, NotificationController.markAllAsRead);
router.delete('/:id', authenticateToken, NotificationController.deleteNotification);

export default router;
