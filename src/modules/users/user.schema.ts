// src/modules/users/user.schema.ts
import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100).optional(),
  phoneNumber: z.string().regex(/^(\+62|08)\d{8,11}$/, 'Format nomor telepon tidak valid').optional(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Password lama wajib diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
