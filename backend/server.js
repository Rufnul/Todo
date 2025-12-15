import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

// config dotenv
dotenv.config();

// express app
const app = express();

const port = process.env.PORT || 5000;

// ✅ CORS - frontend origin
app.use(
    cors({
        origin: 'https://todo-rufnul.vercel.app',
        credentials: true,
    })
);

app.use(express.json());

// db connect
connectDB();

// routes
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server Perfectly Running!',
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
    res.status(200).send(`Server Running on port: ${port}`);
});

app.listen(port, () => {
    console.log(`✅ Server started on http://localhost:${port}`);
});
