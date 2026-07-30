import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connect.js';

import authRoutes from './routes/authRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

dotenv.config();

const app = express();

// Manual CORS headers - must be FIRST middleware, before everything else
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, Accept'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight (OPTIONS) requests immediately
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

app.use(express.json());

// Lazy DB connection middleware - connects once, then reuses
let dbConnected = false;
app.use(async (req, res, next) => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            console.error('DB connection failed:', error.message);
            return res.status(500).json({ message: 'Database connection failed' });
        }
    }
    next();
});

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
