// src/modules/products/product.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './product.service';
import { productQuerySchema } from './product.schema';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate query params manually since they're not in the body
    const query = productQuerySchema.parse(req.query);
    const result = await service.getProductsService(query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.getProductByIdService(req.params.id);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.createProductService(req.body);
    res.status(201).json({ success: true, message: 'Produk dibuat', data: product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.updateProductService(req.params.id, req.body);
    res.json({ success: true, message: 'Produk diperbarui', data: product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteProductService(req.params.id);
    res.json({ success: true, message: 'Produk dihapus' });
  } catch (err) {
    next(err);
  }
}
