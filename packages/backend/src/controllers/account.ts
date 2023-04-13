import { NextFunction, Request, Response } from 'express';
import { IResponse } from './auth';
import {
  CreateBankAccountResExisting,
  CreateBankAccountResSucces,
  CreateBankAccountResValidationErr,
  createBankAccountSchema,
  type CreateBankAccountArgs,
  AccountOverviewFilter,
  //type HasExistingAccountReturn,
} from '../services/account/types';
import { BankAccountService } from '../services/account/account';

export const getBankingProductsController = async (req: Request, res: Response<IResponse>, next: NextFunction) => {
  console.log('getBankingProductsController hited');

  try {
    const { availableCurrecies, bankingProducts } = await BankAccountService.getBankingProducts();

    if (!bankingProducts.length || !availableCurrecies.length) {
      return res.status(200).send({
        message: 'No banking products found',
      });
    }

    return res.status(200).send({
      message: 'Fetched banking products successfully',
      data: {
        bankingProducts: bankingProducts,
        availableCurrecies: availableCurrecies,
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

    return next({
      message: 'Something went wrong',
      status: 500,
    });
  }
};

export const createBankAccountController = async (
  req: Request<{}, {}, CreateBankAccountArgs>,
  res: Response<IResponse<CreateBankAccountResSucces | CreateBankAccountResExisting | CreateBankAccountResValidationErr>>,
  next: NextFunction,
) => {
  const resultSchema = createBankAccountSchema.safeParse({
    ...req.body,
    userId: req.metadata.userId,
  });

  if (!resultSchema.success) {
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
      accountTypeId: req.body.accountTypeId,
      userId: req.metadata.userId as string,
    });

    console.log('hasExistingAccount', hasExistingAccount);

    if (hasExistingAccount) {
      return res.status(200).send({
        message: 'Existing account',
        data: {
          currency: hasExistingAccount.currency,
          bankAccountType: hasExistingAccount.accountType,
        },
      });
    }
    const createAccount = await BankAccountService.createBankAccount({
      accountName: req.body.accountName,
      balance: req.body.balance,
      currency: req.body.currency,
      accountTypeId: req.body.accountTypeId,
      userId: req.metadata.userId as string,
    });

    console.log('createAccount', createAccount);

    if (createAccount) {
      console.log('createdAccount', createAccount, 'return to frontend');
      return res.status(200).send({
        message: 'Account created successfully',
        data: {
          accountId: createAccount.accountId,
        },
      });
    }

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
    const needsBankAccount = await BankAccountService.needsBankAccount(accountId);
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

export const getAccounts = async (req: Request, res: Response<IResponse>, next: NextFunction) => {
  try {
    const accountsData = await BankAccountService.getAccounts(req.metadata.userId as string);
    if (accountsData) {
      const { accounts } = accountsData;

      if (accounts.length > 0) {
        return res.status(200).send({
          data: {
            accounts,
          },
        });
      }
    }

    return res.status(200).send({
      message: 'No accounts found',
    });
  } catch (error) {
    console.log('ERRROR __getAccounts controller - userId ', req.metadata.userId, error);
    if (error instanceof Error) {
      const { message } = error;

      return res.status(500).send({
        message: message,
      });
    }

    return res.status(500).send({
      message: 'Something went wrong. Please try again later',
    });
  }
};

export const getAccountBalanceEvolution = async (
  req: Request<{}, {}, {}, { accountId: string }>,
  res: Response<IResponse>,
  next: NextFunction,
) => {
  try {
    const accountBalances = await BankAccountService.getBalanceEvolution(req.query.accountId);

    if (accountBalances) {
      const categories: number[] = [];
      const data: number[] = [];
      accountBalances.forEach((be) => {
        categories.push(Number(new Date(be.createdAt).getFullYear()));
        data.push(Number(be.balance));
      });
      return res.status(200).send({
        message: 'Balance evolution retrieved successfully',
        data: {
          accountId: req.query.accountId,
          balanceEvolution: {
            accountBalances,
            categories,
            data: [Math.min(...data), Math.max(...data)],
          },
        },
      });
    }
  } catch (error) {
    console.log('ERRROR getAccountBalanceEvolution controller - userId ', req.metadata.userId, error);
    if (error instanceof Error) {
      const { message } = error;

      return res.status(500).send({
        message: message,
      });
    }

    return res.status(500).send({
      message: 'Something went wrong. Please try again later',
    });
  }
};

export const getAccountOverview = async (
  req: Request<{}, {}, {}, { overviewFilter: AccountOverviewFilter; accountId: string }>,
  res: Response<IResponse>,
  next: NextFunction,
) => {
  try {
    const overviewFilter = req.query.overviewFilter ?? 'THIS MONTH';

    console.log('overviewFilter', overviewFilter);

    const accountOverview = await BankAccountService.getAccountOverview(req.query.accountId, overviewFilter);
    console.log('accountOverview', accountOverview);

    return res.status(200).send({
      message: 'success',
      data: {
        accountOverview: accountOverview,
      },
    });
  } catch (error) {
    console.log('ERRROR getAccountBalanceEvolution controller - userId ', req.metadata.userId, error);
    if (error instanceof Error) {
      const { message } = error;

      return res.status(500).send({
        message: message,
      });
    }

    return res.status(500).send({
      message: 'Something went wrong. Please try again later',
    });
  }
};
