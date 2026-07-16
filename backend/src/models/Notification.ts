import { readDatabase, writeDatabase } from '../config/database';

export interface Notification {
  id?: number;
  user_id: number;
  bin_id: number;
  title: string;
  message?: string;
  notification_type: 'nearly_full' | 'full' | 'not_emptied';
  read_status: boolean;
  created_at?: string;
}

export class NotificationModel {
  static async create(notification: Notification): Promise<number> {
    const db = await readDatabase();
    const id = db.nextId.notifications++;
    const now = new Date().toISOString();
    const newNotification = {
      id,
      user_id: notification.user_id,
      bin_id: notification.bin_id,
      title: notification.title,
      message: notification.message || '',
      notification_type: notification.notification_type,
      read_status: false,
      created_at: now,
    };
    db.notifications.push(newNotification);
    await writeDatabase(db);
    return id;
  }

  static async findById(id: number): Promise<Notification | null> {
    const db = await readDatabase();
    const notification = db.notifications.find(n => n.id === id);
    return notification || null;
  }

  static async findByUserId(userId: number, limit: number = 10, offset: number = 0): Promise<Notification[]> {
    const db = await readDatabase();
    return db.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(offset, offset + limit);
  }

  static async markAsRead(id: number): Promise<boolean> {
    const db = await readDatabase();
    const notification = db.notifications.find(n => n.id === id);
    if (!notification) return false;
    notification.read_status = true;
    await writeDatabase(db);
    return true;
  }

  static async markAllAsRead(userId: number): Promise<boolean> {
    const db = await readDatabase();
    const notifications = db.notifications.filter(n => n.user_id === userId && !n.read_status);
    if (notifications.length === 0) return false;
    notifications.forEach(n => { n.read_status = true; });
    await writeDatabase(db);
    return true;
  }

  static async delete(id: number): Promise<boolean> {
    const db = await readDatabase();
    const lengthBefore = db.notifications.length;
    db.notifications = db.notifications.filter(n => n.id !== id);
    if (db.notifications.length === lengthBefore) return false;
    await writeDatabase(db);
    return true;
  }

  static async getUnreadCount(userId: number): Promise<number> {
    const db = await readDatabase();
    return db.notifications.filter(n => n.user_id === userId && !n.read_status).length;
  }

  static async notifyWasteManagers(binId: number, title: string, message: string, type: 'nearly_full' | 'full' | 'not_emptied'): Promise<void> {
    const db = await readDatabase();
    const targets = db.users.filter(u => ['admin', 'waste_manager', 'hospital_admin'].includes(u.role) && u.status === 'active');
    targets.forEach(user => {
      db.notifications.push({
        id: db.nextId.notifications++,
        user_id: user.id,
        bin_id: binId,
        title,
        message,
        notification_type: type,
        read_status: false,
        created_at: new Date().toISOString(),
      });
    });
    await writeDatabase(db);
  }
}
