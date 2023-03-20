import { Router } from 'express';
import {
  authController,
  checkResetTokenValidity,
  generateTokenResetPassword,
  logOut,
  refreshTokenController,
  registerController,
  setNewPassword,
} from '../../controllers/auth';
<<<<<<< HEAD
import { createTransactionController } from '../../controllers/transactions';
=======
// import { createTransactionController } from '../../controllers/transactions';
>>>>>>> main

const router = Router();

// Register
router.post('/register', registerController);

// Login
router.post('/login', authController);

// Refresh Token
router.get('/refresh', refreshTokenController);

// Reset password
router.post('/reset', generateTokenResetPassword);
<<<<<<< HEAD
router.get('/reset/:token', checkResetTokenValidity);
=======

router.get('/reset/:token', checkResetTokenValidity);

>>>>>>> main
router.post('/new-password', setNewPassword);

router.get('/logout', logOut);

<<<<<<< HEAD
router.post('/createTransaction', createTransactionController);

=======
>>>>>>> main
export default router;
