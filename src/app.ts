import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Auth

export default app;