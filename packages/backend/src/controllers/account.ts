import { NextFunction, Request, Response } from 'express';
import { IResponse } from './auth';
import {
  createBankAccountSchema,
  type CreateBankAccountArgs,
  BankAccountService,
  type HasExistingAccountReturn,
} from '../services/account';

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
      type: req.body.accountType,
      userId: req.metadata.userId as string,
    });

    console.log('hasExistingAccount', hasExistingAccount);

    if (hasExistingAccount) {
      return res.status(200).send({
        message: 'Existing account',
        data: {
          balance: hasExistingAccount.balance,
          currency: hasExistingAccount.currency,
          type: hasExistingAccount.type,
        },
      });
    }
    const createdAccount = await BankAccountService.createBankAccount({
      balance: req.body.balance,
      currency: req.body.currency,
      accountType: req.body.accountType,
      userId: req.metadata.userId as string,
    });

    console.log('createdAccount', createdAccount, 'return to frontend');
    return res.status(200).send({
      message: 'Account created',
      data: {
        accountId: createdAccount.accountId,
      },
    });
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
