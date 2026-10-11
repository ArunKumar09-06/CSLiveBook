import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './middleware/logger.js';

const startServer = async () => {
  try {
    await connectDB();
    logger.info('Connected to MongoDB successfully');

    const app = createApp();
    const server = app.listen(env.SERVER_PORT, () => {
      logger.info(`🚀 CSF Livebook API Server listening on port ${env.SERVER_PORT} [${env.NODE_ENV}]`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDB();
        logger.info('Database connection closed');
        process.exit(0);
      });

      // Force close after 10s if not closed
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
