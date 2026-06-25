// src/modules/cart/cart.router.ts
import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { cartItemSchema, updateCartItemSchema } from './cart.schema';
import * as controller from './cart.controller';

export const cartRouter = Router();

// Semua route cart butuh login
cartRouter.use(authMiddleware);

cartRouter.get('/', controller.getCart);
cartRouter.post('/items', validate(cartItemSchema), controller.addItemToCart);
cartRouter.patch('/items/:productId', validate(updateCartItemSchema), controller.updateCartItem);
cartRouter.delete('/items/:productId', controller.removeItemFromCart);
cartRouter.delete('/', controller.clearCart);

