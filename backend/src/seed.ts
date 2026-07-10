/**
 * Standalone seed script for WasteFlow development users
 * Usage: npm run seed
 * 
 * This script will:
 * 1. Initialize the local JSON database
 * 2. Create default development users if they don't already exist
 * 3. Display a log of created/skipped users
 * 4. Exit gracefully
 */

import { initDatabase } from './config/database';
import { SeedService } from './services/seedService';
import logger from './utils/logger';

async function runSeed(): Promise<void> {
  try {
    logger.info('🚀 Starting WasteFlow JSON Database Seeding...');
    logger.info('');

    await initDatabase();

    await SeedService.seedDefaultUsers();

    logger.info('📋 Seeded Users in Database:');
    const users = await SeedService.getSeededUsers();
    users.forEach((user, index) => {
      logger.info(
        `   ${index + 1}. ${user.fullname} (${user.email}) - Role: ${user.role} - Status: ${user.status}`
      );
    });

    logger.info('');
    logger.info('✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

runSeed();
