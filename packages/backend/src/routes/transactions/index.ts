import { Router } from 'express';
import { createTransactionController, getLatestTransactionsController } from '../../controllers/transactions';

const router = Router();

router.post('/addTransaction', createTransactionController);

router.get('/transactions/latest', getLatestTransactionsController);

export default router;
