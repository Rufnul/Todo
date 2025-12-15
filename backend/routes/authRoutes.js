import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userTodos.js';

const router = express.Router();

// Helper to create token
const createToken = (userId) =>
    jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required',
            });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        const user = await User.create({ name, email, password });

        const token = createToken(user._id);

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Server error',
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const token = createToken(user._id);
        return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Server error',
        });
    }
});

export default router;
