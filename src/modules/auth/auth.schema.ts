// src/modules/auth/auth.schema.ts — Zod Validation Schemas

import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Nama wajib diisi' })
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim(),
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(8, 'Password minimal 8 karakter')
    .max(100, 'Password terlalu panjang'),
  phoneNumber: z
    .string()
    .regex(/^(\+62|08)\d{8,11}$/, 'Format nomor telepon tidak valid')
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid')
    .toLowerCase(),
  password: z.string({ required_error: 'Password wajib diisi' }),
});

export const refreshSchema = z.object({
  refreshToken: z.string({ required_error: 'Refresh token wajib diisi' }).optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
