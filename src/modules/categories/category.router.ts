// src/modules/categories/category.router.ts
import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import { createCategorySchema, updateCategorySchema } from './category.schema';
import * as controller from './category.controller';

export const categoryRouter = Router();

// Public (with optional auth logic inside controller for admin)
categoryRouter.get('/', controller.getAllCategories);

// Admin only
categoryRouter.post('/', authMiddleware, requireAdmin, validate(createCategorySchema), controller.createCategory);
categoryRouter.put('/:id', authMiddleware, requireAdmin, validate(updateCategorySchema), controller.updateCategory);
categoryRouter.delete('/:id', authMiddleware, requireAdmin, controller.deleteCategory);

