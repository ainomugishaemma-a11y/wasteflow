import { readDatabase, writeDatabase } from '../config/database';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

export interface SeedUser {
  fullname: string;
  email: string;
  password: string;
  role: 'admin' | 'waste_manager' | 'hospital_admin' | 'collection_personnel';
  hospital_id?: number;
  status: 'active' | 'inactive';
}

// Default development users
const DEFAULT_USERS: SeedUser[] = [
  {
    fullname: 'Komakech Admin',
    email: 'komakech@gmail.com',
    password: 'job256',
    role: 'admin',
    status: 'active',
  },
  {
    fullname: 'Emmanuel Admin',
    email: 'emmanuel@gmail.com',
    password: 'job256',
    role: 'admin',
    status: 'active',
  },
  {
    fullname: 'Lisa User',
    email: 'lisa@gmail.com',
    password: 'job256',
    role: 'waste_manager',
    status: 'active',
  },
  {
    fullname: 'Mercy User',
    email: 'mercy@gmail.com',
    password: 'job256',
    role: 'waste_manager',
    status: 'active',
  },
  {
    fullname: 'Gerald User',
    email: 'gerald@gmail.com',
    password: 'job256',
    role: 'waste_manager',
    status: 'active',
  },
];

export class SeedService {
  /**
   * Seed development users
   * Creates users if they don't already exist
   */
  static async seedDefaultUsers(): Promise<void> {
    try {
      logger.info('🌱 Starting default user seeding...');

      const db = await readDatabase();
      let createdCount = 0;
      let skippedCount = 0;

      for (const user of DEFAULT_USERS) {
        const normalizedEmail = user.email.toLowerCase();
        const existingUser = db.users.find((u: any) => u.email.toLowerCase() === normalizedEmail);
        if (existingUser) {
          logger.info(`⏭️  Skipped user: ${user.email} (already exists)`);
          skippedCount++;
          continue;
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const id = db.nextId.users++;
        const now = new Date().toISOString();
        db.users.push({
          id,
          fullname: user.fullname,
          email: normalizedEmail,
          password: hashedPassword,
          role: user.role,
          hospital_id: user.hospital_id || null,
          status: user.status,
          created_at: now,
          updated_at: now,
        });
        logger.info(`✅ Created user: ${user.email} (Role: ${user.role}, ID: ${id})`);
        createdCount++;
      }

      await writeDatabase(db);
      logger.info(`🎉 User seeding completed! Created: ${createdCount}, Skipped: ${skippedCount}`);
      logger.info('');
      logger.info('📝 Default Test Accounts:');
      logger.info('   Admin Accounts:');
      logger.info('   • komakech@gmail.com / job256');
      logger.info('   • emmanuel@gmail.com / job256');
      logger.info('   User Accounts:');
      logger.info('   • lisa@gmail.com / job256');
      logger.info('   • mercy@gmail.com / job256');
      logger.info('   • gerald@gmail.com / job256');
      logger.info('');
    } catch (error) {
      logger.error('Failed to seed default users:', error);
      throw error;
    }
  }

  private static async findUserByEmail(email: string): Promise<any | null> {
    const db = await readDatabase();
    const normalizedEmail = email.toLowerCase();
    return db.users.find((u: any) => u.email.toLowerCase() === normalizedEmail) || null;
  }

  static async clearDefaultUsers(): Promise<void> {
    try {
      const db = await readDatabase();
      const emails = DEFAULT_USERS.map((u) => u.email.toLowerCase());
      db.users = db.users.filter((u: any) => !emails.includes(u.email.toLowerCase()));
      await writeDatabase(db);
      logger.info('Cleared default users');
    } catch (error) {
      logger.error('Failed to clear default users:', error);
      throw error;
    }
  }

  static async getSeededUsers(): Promise<any[]> {
    const db = await readDatabase();
    const emails = DEFAULT_USERS.map((u) => u.email.toLowerCase());
    return db.users.filter((u: any) => emails.includes(u.email.toLowerCase()));
  }
}
