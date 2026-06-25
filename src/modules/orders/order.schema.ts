// src/modules/orders/order.schema.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
  addressId: z.string().min(1, 'Address ID tidak valid'),
  shippingCost: z.number().min(0, 'Ongkos kirim tidak boleh minus'),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED']),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
