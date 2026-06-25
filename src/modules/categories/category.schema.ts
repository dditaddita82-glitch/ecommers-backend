// src/modules/categories/category.schema.ts
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter').max(100),
  slug: z.string().min(2).max(100),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
