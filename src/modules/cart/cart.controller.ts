// src/modules/cart/cart.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './cart.service';

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await service.getCartService(req.user!.id);
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function addItemToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await service.addItemToCartService(req.user!.id, req.body);
    res.json({ success: true, message: 'Item ditambahkan ke cart', data: cart });
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await service.updateCartItemService(req.user!.id, req.params.productId, req.body);
    res.json({ success: true, message: 'Quantity diupdate', data: cart });
  } catch (err) {
    next(err);
  }
}

export async function removeItemFromCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await service.removeItemFromCartService(req.user!.id, req.params.productId);
    res.json({ success: true, message: 'Item dihapus dari cart', data: cart });
  } catch (err) {
    next(err);
  }
}

export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await service.clearCartService(req.user!.id);
    res.json({ success: true, message: 'Cart dikosongkan', data: cart });
  } catch (err) {
    next(err);
  }
}
