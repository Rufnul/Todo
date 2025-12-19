import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

// =========================
// CONFIG
// =========================
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// =========================
// CORS CONFIG (FIXED)
// =========================
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'https://todo-rufnul.vercel.app',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// =========================
// MIDDLEWARES
// =========================
app.use(express.json());

// =========================
// DATABASE
// =========================
connectDB();

// =========================
// ROUTES
// =========================
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server perfectly running',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Root
app.get('/', (req, res) => {
    res.status(200).send(`Server running on port ${port}`);
});

// =========================
// SERVER
// =========================
app.listen(port, () => {
    console.log(`✅ Server started on port ${port}`);
});
