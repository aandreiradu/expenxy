import { Router } from 'express';
import {
  createTransactionController,
  editTransactionController,
  getLatestTransactionsController,
} from '../../controllers/transactions';

const router = Router();

router.post('/addTransaction', createTransactionController);

router.post('/editTransaction/:transactionId', editTransactionController);

router.get('/transactions/latest', getLatestTransactionsController);

export default router;
