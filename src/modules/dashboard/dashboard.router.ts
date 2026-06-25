// src/modules/dashboard/dashboard.router.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import * as controller from './dashboard.controller';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', authMiddleware, requireAdmin, controller.getDashboardStats);
dashboardRouter.get('/reports', authMiddleware, requireAdmin, controller.getSalesReport);

