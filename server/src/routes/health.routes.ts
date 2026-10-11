import { Router, Request, Response } from 'express';
import { checkDBHealth } from '../config/database.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

healthRouter.get('/ready', (_req: Request, res: Response) => {
  const isDbReady = checkDBHealth();
  if (isDbReady) {
    res.status(200).json({
      success: true,
      data: {
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } else {
    res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database connection is not ready',
      },
    });
  }
});
