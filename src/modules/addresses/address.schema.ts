// src/modules/addresses/address.schema.ts
import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(2, 'Label minimal 2 karakter').max(50),
  receiver: z.string().min(2, 'Nama penerima minimal 2 karakter').max(100),
  phone: z.string().regex(/^(\+62|08)\d{8,11}$/, 'Format nomor telepon tidak valid'),
  fullAddress: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  city: z.string().min(2, 'Kota wajib diisi'),
  province: z.string().min(2, 'Provinsi wajib diisi'),
  postalCode: z.string().min(3, 'Kode pos wajib diisi').max(10),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = addressSchema.partial();

export type AddressDto = z.infer<typeof addressSchema>;
export type UpdateAddressDto = z.infer<typeof updateAddressSchema>;
