import { readDatabase, writeDatabase } from '../config/database';

export interface ActivityLog {
  id?: number;
  user_id: number;
  action: string;
  description?: string;
  timestamp?: string;
}

export class ActivityLogModel {
  static async create(log: ActivityLog): Promise<number> {
    const db = await readDatabase();
    const id = db.nextId.activityLogs++;
    const now = new Date().toISOString();
    const newLog = {
      id,
      user_id: log.user_id,
      action: log.action,
      description: log.description || '',
      timestamp: now,
    };
    db.activityLogs.push(newLog);
    await writeDatabase(db);
    return id;
  }

  static async findByUserId(userId: number, limit: number = 50): Promise<ActivityLog[]> {
    const db = await readDatabase();
    return db.activityLogs
      .filter(log => log.user_id === userId)
      .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
      .slice(0, limit);
  }

  static async getAll(limit: number = 100, offset: number = 0): Promise<ActivityLog[]> {
    const db = await readDatabase();
    return db.activityLogs
      .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
      .slice(offset, offset + limit);
  }

  static async logAction(userId: number, action: string, description?: string): Promise<void> {
    await this.create({ user_id: userId, action, description });
  }
}
