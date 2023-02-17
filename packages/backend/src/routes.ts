import { Router } from 'express';
import {
  registerController,
  authController,
  refreshTokenController,
  generateTokenResetPassword,
  checkResetTokenValidity,
  setNewPassword,
} from './controllers/auth';

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

export default router;
