// src/modules/addresses/address.service.ts
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { AddressDto, UpdateAddressDto } from './address.schema';

export async function getAddressesService(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function createAddressService(userId: string, data: AddressDto) {
  // Jika ini alamat pertama atau isDefault true, pastikan alamat lain isDefault = false
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  } else {
    // Cek apakah user sudah punya alamat
    const existing = await prisma.address.count({ where: { userId } });
    if (existing === 0) {
      data.isDefault = true; // Set default otomatis jika ini alamat pertama
    }
  }

  return await prisma.address.create({
    data: { ...data, userId },
  });
}

export async function updateAddressService(userId: string, addressId: string, data: UpdateAddressDto) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) throw new AppError('Alamat tidak ditemukan', 404, 'NOT_FOUND');

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, id: { not: addressId } },
      data: { isDefault: false },
    });
  } else if (data.isDefault === false && existing.isDefault) {
    throw new AppError('Tidak bisa menonaktifkan alamat default. Set alamat lain sebagai default terlebih dahulu.', 400, 'BAD_REQUEST');
  }

  return await prisma.address.update({
    where: { id: addressId },
    data,
  });
}

export async function deleteAddressService(userId: string, addressId: string) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) throw new AppError('Alamat tidak ditemukan', 404, 'NOT_FOUND');

  await prisma.address.delete({ where: { id: addressId } });

  // Jika yang dihapus adalah default, jadikan alamat pertama sebagai default (jika masih ada)
  if (existing.isDefault) {
    const firstAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    if (firstAddress) {
      await prisma.address.update({
        where: { id: firstAddress.id },
        data: { isDefault: true },
      });
    }
  }
}

export async function setDefaultAddressService(userId: string, addressId: string) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) throw new AppError('Alamat tidak ditemukan', 404, 'NOT_FOUND');

  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  return await prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
}
