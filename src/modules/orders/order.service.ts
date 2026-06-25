// src/modules/orders/order.service.ts
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.schema';
import { emitNewOrder, emitOrderStatusUpdate, emitStockUpdate } from '../../lib/socket';

export async function createOrderService(userId: string, data: CreateOrderDto) {
  // 1. Ambil cart user
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Keranjang belanja kosong', 400, 'BAD_REQUEST');
  }

  // 2. Verifikasi alamat
  const address = await prisma.address.findUnique({
    where: { id: data.addressId },
  });

  if (!address || address.userId !== userId) {
    throw new AppError('Alamat pengiriman tidak valid', 400, 'BAD_REQUEST');
  }

  // 3. Cek stok dan hitung total
  let subtotal = 0;
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new AppError(`Stok produk ${item.product.name} tidak mencukupi`, 400, 'BAD_REQUEST');
    }
    subtotal += Number(item.product.price) * item.quantity;
  }

  const tax = subtotal * 0.11; // PPN 11%
  const totalAmount = subtotal + data.shippingCost + tax;

  // 4. Lakukan Transaksi (Atomic)
  const order = await prisma.$transaction(async (tx) => {
    // a. Buat Order
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId: data.addressId,
        shippingCost: data.shippingCost,
        tax,
        totalAmount,
        notes: data.notes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceEach: item.product.price,
          })),
        },
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // b. Kurangi Stok Produk
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // c. Kosongkan Cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  // 5. Emit Socket.IO Events
  emitNewOrder({
    id: order.id,
    totalAmount: Number(order.totalAmount),
    customerName: order.user.name,
  });

  for (const item of cart.items) {
    emitStockUpdate(item.productId, item.product.stock - item.quantity);
  }

  return order;
}

export async function getCustomerOrdersService(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: { select: { name: true, images: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderByIdService(userId: string, orderId: string, role: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      items: { include: { product: { select: { name: true, images: true } } } },
      user: { select: { name: true, email: true, phoneNumber: true } },
    },
  });

  if (!order) throw new AppError('Pesanan tidak ditemukan', 404, 'NOT_FOUND');

  // Proteksi: Customer hanya bisa melihat pesanannya sendiri
  if (role === 'CUSTOMER' && order.userId !== userId) {
    throw new AppError('Akses ditolak', 403, 'FORBIDDEN');
  }

  return order;
}

// ─── ADMIN SERVICES ───────────────────────────────────────

export async function getAllOrdersAdminService() {
  return await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatusService(orderId: string, data: UpdateOrderStatusDto) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Pesanan tidak ditemukan', 404, 'NOT_FOUND');

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: data.status },
  });

  // Emit Socket.IO event ke customer
  emitOrderStatusUpdate(updatedOrder.userId, updatedOrder.id, updatedOrder.orderStatus);

  return updatedOrder;
}
