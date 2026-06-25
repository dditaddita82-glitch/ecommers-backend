// src/modules/addresses/address.router.ts
import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { addressSchema, updateAddressSchema } from './address.schema';
import * as controller from './address.controller';

export const addressRouter = Router();

// Semua route address butuh login
addressRouter.use(authMiddleware);

addressRouter.get('/', controller.getAddresses);
addressRouter.post('/', validate(addressSchema), controller.createAddress);
addressRouter.put('/:id', validate(updateAddressSchema), controller.updateAddress);
addressRouter.delete('/:id', controller.deleteAddress);
addressRouter.patch('/:id/default', controller.setDefaultAddress);

