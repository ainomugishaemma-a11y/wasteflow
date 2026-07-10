import app from './app';
import { initDatabase } from './config/database';
import { config } from './config/env';
import logger from './utils/logger';

async function start() {
  try {
    await initDatabase();

    app.listen(config.port, () => {
      logger.info(`✓ Server running on http://localhost:${config.port}`);
      logger.info(`✓ Environment: ${config.nodeEnv}`);
      logger.info(`✓ Frontend URL: ${config.frontendUrl}`);
      logger.info('✓ Using local JSON database storage.');
      // eslint-disable-next-line no-console
      console.warn('==================== DEMO MODE ====================');
      // eslint-disable-next-line no-console
      console.warn('WasteFlow is using the built-in JSON database, no external MySQL required.');
      // eslint-disable-next-line no-console
      console.warn('Demo accounts: komakech@gmail.com / job256, emmanuel@gmail.com / job256, lisa@gmail.com / job256, mercy@gmail.com / job256, gerald@gmail.com / job256');
      // eslint-disable-next-line no-console
      console.warn('===================================================');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
