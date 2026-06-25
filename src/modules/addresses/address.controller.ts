// src/modules/addresses/address.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './address.service';

export async function getAddresses(req: Request, res: Response, next: NextFunction) {
  try {
    const addresses = await service.getAddressesService(req.user!.id);
    res.json({ success: true, data: addresses });
  } catch (err) {
    next(err);
  }
}

export async function createAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await service.createAddressService(req.user!.id, req.body);
    res.status(201).json({ success: true, message: 'Alamat berhasil ditambahkan', data: address });
  } catch (err) {
    next(err);
  }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await service.updateAddressService(req.user!.id, req.params.id, req.body);
    res.json({ success: true, message: 'Alamat berhasil diperbarui', data: address });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteAddressService(req.user!.id, req.params.id);
    res.json({ success: true, message: 'Alamat berhasil dihapus' });
  } catch (err) {
    next(err);
  }
}

export async function setDefaultAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await service.setDefaultAddressService(req.user!.id, req.params.id);
    res.json({ success: true, message: 'Alamat utama berhasil diubah', data: address });
  } catch (err) {
    next(err);
  }
}
