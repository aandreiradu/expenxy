import { Router } from 'express';
import { registerController, authController } from './controllers/auth';

const router = Router();

// Register
router.post('/register', registerController);

// Login
router.post('/login', authController);

export default router;
