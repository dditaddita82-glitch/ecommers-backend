// src/modules/auth/auth.router.ts — Auth Routes

import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} from './auth.controller';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', validate(registerSchema), register);

// POST /api/auth/login
authRouter.post('/login', validate(loginSchema), login);

// POST /api/auth/refresh
authRouter.post('/refresh', refreshToken);

// POST /api/auth/logout
authRouter.post('/logout', logout);

// GET /api/auth/me — Protected
authRouter.get('/me', authMiddleware, getMe);
