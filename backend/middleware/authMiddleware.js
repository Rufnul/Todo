import jwt from 'jsonwebtoken';
import User from '../models/userTodos.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // NOTE: we signed token with { userId }
            req.user = await User.findById(decoded.userId).select('-password');

            return next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed',
            });
        }
    }

    return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
    });
};
