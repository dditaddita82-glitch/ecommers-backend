// src/modules/users/user.router.ts
import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import { updateProfileSchema, updatePasswordSchema } from './user.schema';
import * as controller from './user.controller';

export const userRouter = Router();

// Semua rute user butuh login
userRouter.use(authMiddleware);

userRouter.get('/profile', controller.getProfile);
userRouter.put('/profile', validate(updateProfileSchema), controller.updateProfile);
userRouter.put('/password', validate(updatePasswordSchema), controller.updatePassword);

// Admin only
userRouter.get('/admin/all', requireAdmin, controller.getAllUsers);

