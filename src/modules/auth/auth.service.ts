// src/modules/auth/auth.service.ts — Business Logic Auth

import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from '../../lib/jwt';
import { AppError } from '../../middleware/error.middleware';
import { RegisterDto, LoginDto } from './auth.schema';

export async function registerService(dto: RegisterDto) {
  // Cek email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new AppError('Email sudah terdaftar', 409, 'CONFLICT');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(dto.password, 12);

  // Buat user baru
  const user = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      passwordHash,
      phoneNumber: dto.phoneNumber,
      role: 'CUSTOMER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Buat cart kosong untuk user baru
  await prisma.cart.create({
    data: { userId: user.id },
  });

  return user;
}

export async function loginService(dto: LoginDto) {
  // Cari user
  const user = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new AppError('Email atau password salah', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new AppError('Akun Anda telah dinonaktifkan', 403, 'ACCOUNT_DISABLED');
  }

  // Verifikasi password
  const isValid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Email atau password salah', 401, 'INVALID_CREDENTIALS');
  }

  // Generate tokens
  const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Simpan refresh token ke DB
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function refreshTokenService(refreshToken: string) {
  // Verifikasi signature token
  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Refresh token tidak valid atau sudah kadaluarsa', 401, 'INVALID_TOKEN');
  }

  // Cek token di DB (pastikan belum di-logout)
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AppError('Refresh token tidak valid', 401, 'INVALID_TOKEN');
  }

  if (storedToken.expiresAt < new Date()) {
    // Hapus token expired
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError('Refresh token sudah kadaluarsa, silakan login kembali', 401, 'TOKEN_EXPIRED');
  }

  // Generate access token baru
  const newPayload: JwtPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };
  const newAccessToken = signAccessToken(newPayload);

  return { accessToken: newAccessToken };
}

export async function logoutService(refreshToken: string) {
  // Hapus refresh token dari DB
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}

export async function getMeService(userId: string) {
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

  if (!user) {
    throw new AppError('User tidak ditemukan', 404, 'NOT_FOUND');
  }

  return user;
}
