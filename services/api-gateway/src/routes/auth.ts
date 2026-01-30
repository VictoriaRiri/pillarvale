import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../server';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/),
    fullName: z.string().min(2).max(255),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// ============================================================================
// REGISTER
// ============================================================================
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, phoneNumber, fullName } = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await db.query(
            'SELECT user_id FROM users WHERE email = $1 OR phone_number = $2',
            [email, phoneNumber]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'Email or phone number already registered',
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const result = await db.query(
            `INSERT INTO users (email, password_hash, phone_number, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, email, phone_number, full_name, created_at`,
            [email, passwordHash, phoneNumber, fullName]
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );

        logger.info(`User registered: ${user.email}`);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                userId: user.user_id,
                email: user.email,
                phoneNumber: user.phone_number,
                fullName: user.full_name,
                createdAt: user.created_at,
            },
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors,
            });
        }

        logger.error('Registration error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to register user',
        });
    }
});

// ============================================================================
// LOGIN
// ============================================================================
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // Find user
        const result = await db.query(
            `SELECT user_id, email, password_hash, phone_number, full_name, 
              kyc_status, is_active
       FROM users
       WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid email or password',
            });
        }

        const user = result.rows[0];

        // Check if account is active
        if (!user.is_active) {
            return res.status(403).json({
                error: 'Account disabled',
                message: 'Your account has been disabled. Please contact support.',
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid email or password',
            });
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE user_id = $1',
            [user.user_id]
        );

        // Generate JWT
        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );

        logger.info(`User logged in: ${user.email}`);

        res.json({
            message: 'Login successful',
            user: {
                userId: user.user_id,
                email: user.email,
                phoneNumber: user.phone_number,
                fullName: user.full_name,
                kycStatus: user.kyc_status,
            },
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors,
            });
        }

        logger.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to login',
        });
    }
});

// ============================================================================
// VERIFY TOKEN
// ============================================================================
router.get('/verify', async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                error: 'No token provided',
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
        ) as { userId: string; email: string };

        // Get user details
        const result = await db.query(
            `SELECT user_id, email, phone_number, full_name, kyc_status
       FROM users
       WHERE user_id = $1 AND is_active = true`,
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Invalid token',
            });
        }

        res.json({
            valid: true,
            user: result.rows[0],
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token',
            valid: false,
        });
    }
});

export default router;
