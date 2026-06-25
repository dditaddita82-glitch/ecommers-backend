// src/modules/dashboard/dashboard.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './dashboard.service';

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await service.getDashboardStatsService();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getSalesReport(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await service.getSalesReportService();
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}
