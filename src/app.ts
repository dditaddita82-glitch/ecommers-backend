// src/app.ts — Express Application Setup

import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { authRouter } from './modules/auth/auth.router';
import { productRouter } from './modules/products/product.router';
import { categoryRouter } from './modules/categories/category.router';
import { cartRouter } from './modules/cart/cart.router';
import { orderRouter } from './modules/orders/order.router';
import { addressRouter } from './modules/addresses/address.router';
import { userRouter } from './modules/users/user.router';
import { dashboardRouter } from './modules/dashboard/dashboard.router';
import { errorMiddleware } from './middleware/error.middleware';
import { uploadRouter } from './modules/upload/upload.router';

export const app = express();

// ─── Security ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:3002'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      // Izinkan jika cocok dengan daftar origin atau merupakan subdomain Vercel
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Rate Limiting ─────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5000, // Diperbesar dari 200 ke 5000 untuk mode development
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Diperbesar dari 20 ke 1000 untuk mode development
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

// app.use(generalLimiter); // Opsional: Bisa di-comment jika ingin dimatikan sepenuhnya
app.use(generalLimiter);


// ─── Body Parsing ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Health Check ──────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ────────────────────────────────────────
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/users', userRouter);
app.use('/api/admin/dashboard', dashboardRouter);
app.use('/api/upload', uploadRouter);
app.use(express.static(path.join(__dirname, '../public')));
// Fallback untuk gambar lama yang terlanjur menggunakan prefix /api
app.use('/api/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ─── 404 Handler ───────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'NOT_FOUND',
  });
});

// ─── Global Error Handler ──────────────────────────────
app.use(errorMiddleware);
