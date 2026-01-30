import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });

    // Default error
    let statusCode = 500;
    let message = 'Internal server error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    } else if (err.name === 'ForbiddenError') {
        statusCode = 403;
        message = 'Forbidden';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Not found';
    }

    res.status(statusCode).json({
        error: err.name || 'Error',
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err,
        }),
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'],
    });
};
