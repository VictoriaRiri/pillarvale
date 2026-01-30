import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    email?: string;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'No token provided',
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
        ) as { userId: string; email: string };

        req.userId = decoded.userId;
        req.email = decoded.email;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expired',
                message: 'Please login again',
            });
        }

        res.status(401).json({
            error: 'Invalid token',
            message: 'Authentication failed',
        });
    }
};
