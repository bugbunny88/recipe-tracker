import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

// JWT payload interface
interface JWTPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

// Authentication middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }

        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

        // Verify user still exists in database
        const result = await query('SELECT id, email FROM users WHERE id = $1', [decoded.userId]);

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.user = {
            id: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ error: 'Invalid token' });
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token expired' });
        } else {
            console.error('Auth middleware error:', error);
            res.status(500).json({ error: 'Authentication error' });
        }
    }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            next();
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            next();
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

        // Verify user still exists in database
        const result = await query('SELECT id, email FROM users WHERE id = $1', [decoded.userId]);

        if (result.rows.length > 0) {
            req.user = {
                id: decoded.userId,
                email: decoded.email
            };
        }

        next();
    } catch (error) {
        // Silently continue without authentication
        next();
    }
};
