import { Router } from 'express';
import {
  registerController,
  authController,
  refreshTokenController,
  generateTokenResetPassword,
  checkResetTokenValidity,
  setNewPassword,
  logOut,
} from './controllers/auth';
import { createTransactionController } from './controllers/transactions';

const router = Router();

// Register
router.post('/register', registerController);

// Login
router.post('/login', authController);

// Refresh Token
router.get('/refresh', refreshTokenController);

// Reset password
router.post('/reset', generateTokenResetPassword);
router.get('/reset/:token', checkResetTokenValidity);
router.post('/new-password', setNewPassword);

router.get('/logout', logOut);

router.post('/createTransaction', createTransactionController);

export default router;
