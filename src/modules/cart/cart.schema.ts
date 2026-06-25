// src/modules/cart/cart.schema.ts
import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID diperlukan'),
  quantity: z.number().int().min(1, 'Quantity minimal 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity minimal 1'),
});

export type CartItemDto = z.infer<typeof cartItemSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
