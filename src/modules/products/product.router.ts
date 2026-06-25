// src/modules/products/product.router.ts
import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import { createProductSchema, updateProductSchema } from './product.schema';
import * as controller from './product.controller';

export const productRouter = Router();

// Public routes
productRouter.get('/', controller.getProducts);
productRouter.get('/:id', controller.getProductById);

// Admin only routes
productRouter.post('/', authMiddleware, requireAdmin, validate(createProductSchema), controller.createProduct);
productRouter.put('/:id', authMiddleware, requireAdmin, validate(updateProductSchema), controller.updateProduct);
productRouter.delete('/:id', authMiddleware, requireAdmin, controller.deleteProduct);

