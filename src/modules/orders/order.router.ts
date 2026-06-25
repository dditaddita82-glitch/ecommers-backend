// src/modules/orders/order.router.ts
import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireAdmin, requireCustomer } from '../../middleware/role.middleware';
import { createOrderSchema, updateOrderStatusSchema } from './order.schema';
import * as controller from './order.controller';

export const orderRouter = Router();

// Semua rute order wajib login
orderRouter.use(authMiddleware);

// Customer Routes
orderRouter.post('/', requireCustomer, validate(createOrderSchema), controller.createOrder);
orderRouter.get('/', requireCustomer, controller.getMyOrders);
orderRouter.get('/:id', controller.getOrderById); // Bisa diakses Admin & Customer (lewat logic di service)

// Admin Routes (menggunakan prefix internal)
orderRouter.get('/admin/all', requireAdmin, controller.getAllOrdersAdmin);
orderRouter.patch('/:id/status', requireAdmin, validate(updateOrderStatusSchema), controller.updateOrderStatus);

