import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'wasteflow_db',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expire: process.env.JWT_EXPIRE || '15m',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
    refreshExpire: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  },
  
  // URLs
  appUrl: process.env.APP_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
