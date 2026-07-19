import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/dbConnection.js';
import authenticationRoutes from './routes/authenticationRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authenticationRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'E-Commerce Core API Running Successfully' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is processing on port ${PORT}`);
});