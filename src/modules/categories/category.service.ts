// src/modules/categories/category.service.ts
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';

export async function getAllCategoriesService(includeInactive = false) {
  return await prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function createCategoryService(data: CreateCategoryDto) {
  return await prisma.category.create({ data });
}

export async function updateCategoryService(id: string, data: UpdateCategoryDto) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError('Kategori tidak ditemukan', 404, 'NOT_FOUND');

  return await prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategoryService(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError('Kategori tidak ditemukan', 404, 'NOT_FOUND');

  return await prisma.category.delete({ where: { id } });
}
