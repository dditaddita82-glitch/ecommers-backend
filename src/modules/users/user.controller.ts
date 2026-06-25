// src/modules/users/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './user.service';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await service.getProfileService(req.user!.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await service.updateProfileService(req.user!.id, req.body);
    res.json({ success: true, message: 'Profil berhasil diperbarui', data: user });
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    await service.updatePasswordService(req.user!.id, req.body);
    res.json({ success: true, message: 'Password berhasil diubah' });
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await service.getAllUsersService();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}
