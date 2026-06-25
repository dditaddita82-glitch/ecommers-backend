// src/modules/auth/auth.controller.ts — Request Handlers

import { Request, Response, NextFunction } from 'express';
import {
  registerService,
  loginService,
  refreshTokenService,
  logoutService,
  getMeService,
} from './auth.service';

const isProd = process.env.NODE_ENV === 'production' || !process.env.DATABASE_URL?.includes('localhost');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ('none' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam ms
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await registerService(req.body);
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await loginService(req.body);

    // Simpan refresh token di HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Ambil refresh token dari HttpOnly cookie atau body (fallback)
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Refresh token tidak ditemukan',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const result = await refreshTokenService(token);

    res.json({
      success: true,
      message: 'Token berhasil diperbarui',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (token) {
      await logoutService(token);
    }

    // Hapus cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout berhasil',
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getMeService(req.user!.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}
