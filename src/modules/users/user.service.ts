// src/modules/users/user.service.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { UpdateProfileDto, UpdatePasswordDto } from './user.schema';

export async function getProfileService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) throw new AppError('User tidak ditemukan', 404, 'NOT_FOUND');
  return user;
}

export async function updateProfileService(userId: string, data: UpdateProfileDto) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  });

  return user;
}

export async function updatePasswordService(userId: string, data: UpdatePasswordDto) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User tidak ditemukan', 404, 'NOT_FOUND');

  // Cek password lama
  const isValid = await bcrypt.compare(data.oldPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError('Password lama salah', 400, 'BAD_REQUEST');
  }

  // Cek jika password baru sama dengan password lama
  const isSame = await bcrypt.compare(data.newPassword, user.passwordHash);
  if (isSame) {
    throw new AppError('Password baru tidak boleh sama dengan password lama', 400, 'BAD_REQUEST');
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function getAllUsersService() {
  return await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
      _count: {
        select: { orders: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}
