import { Router } from 'express';
import { createBankAccountController } from '../../controllers/account';

const router = Router();

router.post('/createBankAccount', createBankAccountController);

export default router;
