// src/modules/categories/category.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './category.service';

export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const includeInactive = req.user?.role === 'ADMIN' && req.query.all === 'true';
    const categories = await service.getAllCategoriesService(includeInactive);
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await service.createCategoryService(req.body);
    res.status(201).json({ success: true, message: 'Kategori dibuat', data: category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await service.updateCategoryService(req.params.id, req.body);
    res.json({ success: true, message: 'Kategori diperbarui', data: category });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteCategoryService(req.params.id);
    res.json({ success: true, message: 'Kategori dihapus' });
  } catch (err) {
    next(err);
  }
}
