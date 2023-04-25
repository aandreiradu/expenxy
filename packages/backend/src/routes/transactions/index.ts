import { Router } from 'express';
import {
  createTransactionController,
  deleteTransactionController,
  editTransactionController,
  getLatestTransactionsController,
} from '../../controllers/transactions';

const router = Router();

router.post('/addTransaction', createTransactionController);

router.post('/editTransaction/:transactionId', editTransactionController);

router.post('/deleteTransaction/:transactionId', deleteTransactionController);

router.get('/transactions/latest', getLatestTransactionsController);

export default router;
