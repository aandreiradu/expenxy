import { NextFunction, Request, Response } from 'express';
import { IResponse } from './auth';
import {
  createBankAccountSchema,
  type CreateBankAccountArgs,
  BankAccountService,
  type HasExistingAccountReturn,
} from '../services/account';

export const getBankingProductsController = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction,
) => {
  try {
    const bankingProducts = await BankAccountService.getBankingProducts();

    if (!bankingProducts) {
      return res.status(200).send({
        message: 'No banking products found',
      });
    }

    return res.status(200).send({
      message: 'Fetched banking products successfully',
      data: {
        bankingProducts: bankingProducts,
      },
    });
  } catch (error) {
    console.log('error getBankingProductsController', error);
    if (error instanceof Error) {
      console.log('error is instance of error');
      console.log({
        message: error.message,
        name: error.name,
      });

      return next(error.message);
    }

    return next('Something went wrong, please try again later!');
  }
};

export const createBankAccountController = async (
  req: Request<{}, {}, CreateBankAccountArgs>,
  res: Response<IResponse<HasExistingAccountReturn | { accountId: string }>>,
  next: NextFunction,
) => {
  console.log('sending to validation this', {
    ...req.body,
    userId: req.metadata.userId,
  });
  const resultSchema = createBankAccountSchema.safeParse({
    ...req.body,
    userId: req.metadata.userId,
  });

  if (!resultSchema.success) {
    console.log('error validation', resultSchema.error.flatten());

    const flattenErrors = resultSchema.error.flatten();

    return res.status(400).send({
      error: {
        message: 'Error validation',
        fieldErrors: flattenErrors.fieldErrors,
      },
    });
  }

  try {
    const hasExistingAccount = await BankAccountService.hasExistingAccount({
      currency: req.body.currency,
      type: req.body.accountTypeId,
      userId: req.metadata.userId as string,
    });

    console.log('hasExistingAccount', hasExistingAccount);

    if (hasExistingAccount) {
      return res.status(200).send({
        message: 'Existing account',
        data: {
          balance: hasExistingAccount.balance,
          currency: hasExistingAccount.currency,
          bankAccountTypeId: hasExistingAccount.bankAccountTypeId,
        },
      });
    }
    const createAccount = await BankAccountService.createBankAccount({
      balance: req.body.balance,
      currency: req.body.currency,
      accountTypeId: req.body.accountTypeId,
      userId: req.metadata.userId as string,
    });

    if (createAccount) {
      console.log('createdAccount', createAccount, 'return to frontend');
      return res.status(200).send({
        message: 'Account created successfully',
        data: {
          accountId: createAccount.accountId,
        },
      });
    }

    console.log('reached bottom');
    throw new Error('Someting went wrong. Please try again later!');
  } catch (error) {
    if (error instanceof Error) {
      console.log('error is instance of error');
      console.log({
        message: error.message,
        name: error.name,
      });

      return next(error.message);
    }

    return next('Something went wrong, please try again later!');
  }
};

export const checkBankAccountExisting = async (
  req: Request<{}, {}, { accountId: string }>,
  res: Response<IResponse>,
  next: NextFunction,
) => {
  const { accountId } = req.body;

  try {
    const needsBankAccount = await BankAccountService.needsBankAccount(
      accountId,
    );
    return res.status(200).send({
      data: {
        needsBankAccount,
      },
    });
  } catch (error) {
    console.log('error checkBankAccountExisting', error);
    if (error instanceof Error) {
      return next({
        error: {
          message: error.message,
        },
      });
    }

    return next('Something went wrong, please try again later!');
  }
};

export const test = async (
  req: Request<{}, {}, { id: string }>,
  res: Response<IResponse>,
  next: NextFunction,
) => {
  const { id } = req.body;

  const serviceResponse = await BankAccountService.needsBankAccount(id);
  return res.status(200).send({
    data: {
      serviceResponse,
    },
  });
};
