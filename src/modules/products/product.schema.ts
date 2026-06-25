// src/modules/products/product.schema.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter').max(200),
  description: z.string().min(5, 'Deskripsi terlalu pendek'),
  price: z.number().positive('Harga harus lebih dari 0'),
  stock: z.number().int().min(0, 'Stok tidak boleh minus'),
  categoryId: z.string().min(1, 'Kategori ID tidak valid'),
  images: z.array(z.string()).min(1, 'Minimal 1 gambar'),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating_desc']).optional().default('newest'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
