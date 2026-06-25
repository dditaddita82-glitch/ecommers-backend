// src/lib/socket.ts — Socket.IO Setup

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export function initSocket(server: HttpServer): void {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User bergabung ke room berdasarkan userId (untuk notifikasi personal)
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Admin bergabung ke room admin (untuk notifikasi order baru)
    socket.on('join-admin-room', () => {
      socket.join('admin');
      console.log(`🔑 Admin joined admin room`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Socket.IO initialized');
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
}

// Helper functions untuk emit events

/** Kirim notifikasi update status order ke customer */
export function emitOrderStatusUpdate(
  userId: string,
  orderId: string,
  status: string
): void {
  getIO().to(`user:${userId}`).emit('order-status-update', { orderId, status });
}

/** Kirim notifikasi order baru ke admin */
export function emitNewOrder(orderData: {
  id: string;
  totalAmount: number;
  customerName: string;
}): void {
  getIO().to('admin').emit('new-order', orderData);
}

/** Kirim notifikasi update stok ke semua client */
export function emitStockUpdate(productId: string, newStock: number): void {
  getIO().emit('stock-update', { productId, newStock });
}
