import { Router } from 'express';
import { getBankingProductsController, createBankAccountController, getAccounts } from '../../controllers/account';

const router = Router();

router.get('/getBankingProducts', getBankingProductsController);

router.post('/createBankAccount', createBankAccountController);

router.get('/getAccounts', getAccounts);

export default router;
