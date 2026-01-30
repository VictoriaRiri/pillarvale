import { Router, Request, Response } from 'express';
import { db, redisClient } from '../server';

const router = Router();

// ============================================================================
// HEALTH CHECK
// ============================================================================
router.get('/', async (req: Request, res: Response) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
            api: 'healthy',
            database: 'unknown',
            redis: 'unknown',
            blockchain: 'unknown',
        },
    };

    try {
        // Check database
        await db.query('SELECT 1');
        health.services.database = 'healthy';
    } catch (error) {
        health.services.database = 'unhealthy';
        health.status = 'degraded';
    }

    try {
        // Check Redis
        await redisClient.ping();
        health.services.redis = 'healthy';
    } catch (error) {
        health.services.redis = 'unhealthy';
        health.status = 'degraded';
    }

    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
});

// ============================================================================
// READINESS CHECK
// ============================================================================
router.get('/ready', async (req: Request, res: Response) => {
    try {
        await db.query('SELECT 1');
        await redisClient.ping();

        res.json({
            ready: true,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            ready: false,
            timestamp: new Date().toISOString(),
            error: 'Service dependencies not ready',
        });
    }
});

// ============================================================================
// LIVENESS CHECK
// ============================================================================
router.get('/live', (req: Request, res: Response) => {
    res.json({
        alive: true,
        timestamp: new Date().toISOString(),
    });
});

export default router;
