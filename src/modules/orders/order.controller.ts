// src/modules/orders/order.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './order.service';

// ─── CUSTOMER HANDLERS ───────────────────────────────────

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await service.createOrderService(req.user!.id, req.body);
    res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat', data: order });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await service.getCustomerOrdersService(req.user!.id);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await service.getOrderByIdService(req.user!.id, req.params.id, req.user!.role);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN HANDLERS ──────────────────────────────────────

export async function getAllOrdersAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await service.getAllOrdersAdminService();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await service.updateOrderStatusService(req.params.id, req.body);
    res.json({ success: true, message: 'Status pesanan diperbarui', data: order });
  } catch (err) {
    next(err);
  }
}
