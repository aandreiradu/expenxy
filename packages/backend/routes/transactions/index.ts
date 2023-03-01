import { Router } from 'express';
import { createTransactionController } from '../../src/controllers/transactions';

const router = Router();

router.post('/addTransaction', createTransactionController);

export default router;
