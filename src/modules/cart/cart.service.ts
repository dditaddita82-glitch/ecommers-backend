// src/modules/cart/cart.service.ts
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { CartItemDto, UpdateCartItemDto } from './cart.schema';

export async function getCartService(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, images: true, stock: true },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: { include: { product: { select: { id: true, name: true, price: true, images: true, stock: true } } } },
      },
    });
  }

  return cart;
}

export async function addItemToCartService(userId: string, data: CartItemDto) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Cek produk exist & stock
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product || !product.isActive) {
    throw new AppError('Produk tidak tersedia', 404, 'NOT_FOUND');
  }

  if (product.stock < data.quantity) {
    throw new AppError('Stok produk tidak mencukupi', 400, 'BAD_REQUEST');
  }

  // Cek item di cart
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: data.productId } },
  });

  if (existingItem) {
    const newQty = existingItem.quantity + data.quantity;
    if (product.stock < newQty) {
      throw new AppError('Stok produk tidak mencukupi untuk jumlah ini', 400, 'BAD_REQUEST');
    }
    
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
      },
    });
  }

  return getCartService(userId);
}

export async function updateCartItemService(userId: string, productId: string, data: UpdateCartItemDto) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart tidak ditemukan', 404, 'NOT_FOUND');

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (!existingItem) {
    throw new AppError('Item tidak ada di cart', 404, 'NOT_FOUND');
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < data.quantity) {
    throw new AppError('Stok produk tidak mencukupi', 400, 'BAD_REQUEST');
  }

  await prisma.cartItem.update({
    where: { id: existingItem.id },
    data: { quantity: data.quantity },
  });

  return getCartService(userId);
}

export async function removeItemFromCartService(userId: string, productId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart tidak ditemukan', 404, 'NOT_FOUND');

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (!existingItem) {
    throw new AppError('Item tidak ada di cart', 404, 'NOT_FOUND');
  }

  await prisma.cartItem.delete({ where: { id: existingItem.id } });

  return getCartService(userId);
}

export async function clearCartService(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getCartService(userId);
}
