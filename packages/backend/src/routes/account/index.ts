import { Router } from 'express';
import {
  getBankingProductsController,
  createBankAccountController,
  getAccounts,
  getAccountBalanceEvolution,
  getAccountOverview,
} from '../../controllers/account';

const router = Router();

router.get('/getBankingProducts', getBankingProductsController);

router.post('/createBankAccount', createBankAccountController);

router.get('/getAccounts', getAccounts);

router.get('/getBalanceEvolution', getAccountBalanceEvolution);

router.get('/accountOverview', getAccountOverview);

export default router;
