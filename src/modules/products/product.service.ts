// src/modules/products/product.service.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.schema';

export async function getProductsService(query: ProductQueryDto) {
  const { page, limit, search, category, minPrice, maxPrice, sort } = query;
  
  const skip = (page - 1) * limit;

  // Build the 'where' clause dynamically
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Build the 'orderBy' clause
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'rating_desc') orderBy = { rating: 'desc' };

  // Run queries in parallel
  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { category: { select: { name: true, slug: true } } },
    }),
  ]);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductByIdService(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) throw new AppError('Produk tidak ditemukan', 404, 'NOT_FOUND');
  return product;
}

export async function createProductService(data: CreateProductDto) {
  // Verifikasi kategori
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new AppError('Kategori tidak valid', 400, 'BAD_REQUEST');

  return await prisma.product.create({ data });
}

export async function updateProductService(id: string, data: UpdateProductDto) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError('Produk tidak ditemukan', 404, 'NOT_FOUND');

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new AppError('Kategori tidak valid', 400, 'BAD_REQUEST');
  }

  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProductService(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError('Produk tidak ditemukan', 404, 'NOT_FOUND');

  // Gunakan Soft Delete agar tidak melanggar foreign key constraint (misal: produk sudah dipesan)
  return await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}
