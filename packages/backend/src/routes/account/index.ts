import { Router } from 'express';
import { getBankingProductsController, createBankAccountController } from '../../controllers/account';

const router = Router();

router.get('/getBankingProducts', getBankingProductsController);

router.post('/createBankAccount', createBankAccountController);

export default router;
