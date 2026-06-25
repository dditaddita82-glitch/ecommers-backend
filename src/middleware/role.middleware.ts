// src/middleware/role.middleware.ts — Role Guard

import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }
  if (req.user.role !== 'ADMIN') {
    return next(new AppError('Akses ditolak. Hanya admin yang diizinkan.', 403, 'FORBIDDEN'));
  }
  next();
}

export function requireCustomer(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }
  if (req.user.role !== 'CUSTOMER') {
    return next(new AppError('Akses ditolak. Hanya customer yang diizinkan.', 403, 'FORBIDDEN'));
  }
  next();
}
