import { Request, Response } from 'express';
import { NotificationModel } from '../models/Notification';
import logger from '../utils/logger';

const NotificationController = {
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const notifications = await NotificationModel.findByUserId(userId);
      const unreadCount = await NotificationModel.getUnreadCount(userId);
      res.json({ notifications, unreadCount });
    } catch (error) {
      logger.error('Get notifications error:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },

  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const unread = await NotificationModel.getUnreadCount(userId);
      res.json({ unread });
    } catch (error) {
      logger.error('Get unread count error:', error);
      res.status(500).json({ error: 'Failed to fetch unread count' });
    }
  },

  async getNotificationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notification = await NotificationModel.findById(parseInt(id));
      res.json({ notification });
    } catch (error) {
      logger.error('Get notification by id error:', error);
      res.status(500).json({ error: 'Failed to fetch notification' });
    }
  },

  async markAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const notificationId = parseInt(id);
      const notification = await NotificationModel.findById(notificationId);
      if (!notification || notification.user_id !== userId) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }

      const success = await NotificationModel.markAsRead(notificationId);
      if (!success) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }

      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      logger.error('Mark as read error:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  },

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await NotificationModel.markAllAsRead(userId);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      logger.error('Mark all as read error:', error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  },

  async deleteNotification(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const notificationId = parseInt(id);
      const notification = await NotificationModel.findById(notificationId);
      if (!notification || notification.user_id !== userId) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }

      const success = await NotificationModel.delete(notificationId);
      if (!success) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }

      res.json({ message: 'Notification deleted' });
    } catch (error) {
      logger.error('Delete notification error:', error);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  },
};

export default NotificationController;
