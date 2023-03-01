import { NextFunction, Request, Response } from 'express';
import {
  type CreateTransactionArgs,
  createTransactionSchema,
  TransactionService,
} from '../services/transactions';

interface IResponse<T = any> {
  message?: string;
  status?: number;
  data?: T;
  error?: {
    message: string;
    fieldErrors?: {
      [key: string]: string[];
    };
  };
}

export const createTransactionController = async (
  req: Request<{}, {}, CreateTransactionArgs>,
  res: Response<IResponse>,
  next: NextFunction,
) => {
  const result = createTransactionSchema.safeParse(req.body);

  if (!result.success) {
    const formatted = result.error.flatten();

    return res.status(422).send({
      error: {
        message: 'Error validation',
        fieldErrors: formatted.fieldErrors,
      },
    });
  }

  try {
    const { amount, merchant, transactionType, date, currency } = req.body;
    console.log('req.body', req.body);
    const refreshToken: string = req.cookies['EXPENXY_REFRESH_TOKEN'];
    console.log('refreshToken', refreshToken);

    if (!refreshToken) {
      console.log('no refresh token provided');
      return res.status(400).send({
        message: "Couldn't identify the user based on refresh token",
      });
    }

    const id = await TransactionService.createTransaction({
      amount,
      merchant,
      transactionType,
      currency,
      date,
      refreshToken,
    });

    console.log('id createTransactionController', id);

    return res.status(200).send({
      message: 'Transaction created successfully',
      data: id,
    });
  } catch (error) {
    console.log('Error addTransaction controller', error);
    return next(error);
  }
};
