import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connect.js';

import authRoutes from './routes/authRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

dotenv.config();

connectDB();

const app = express();
app.use(cors({
    origin: true, // This will reflect the request origin back to the user
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AlgoViz API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
