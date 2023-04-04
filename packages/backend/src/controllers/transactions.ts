import { NextFunction, Request, Response } from 'express';
import { CreateTransactionArgs } from '../services/transaction/types';
import { createTransactionSchema } from '../services/transaction/types';
import TransactionService from '../services/transaction/transactions';

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
  try {
    const validateSchema = createTransactionSchema.safeParse(req.body);

    if (!validateSchema.success) {
      const flattenErrors = validateSchema.error.flatten();
      const errorObj = {
        status: 400,
        message: 'Error validation',
        error: {
          fieldErrors: {
            ...flattenErrors.fieldErrors,
          },
        },
      };

      return next(errorObj);
    }

    const newTransaction = await TransactionService.createTransaction({
      ...req.body,
      userId: req.metadata.userId as string,
    });

    if (newTransaction) {
      /* Update account balance */
      const updatedBalance = await TransactionService.updateBalanceByType(
        req.body.account,
        req.body.transactionType,
        req.body.amount,
      );

      /* Return latest transactions */
      const latestTransactions = await TransactionService.getLatestTransactions(req.metadata.userId as string);

      console.log('latestTransactions', latestTransactions);

      return res.status(201).send({
        message: 'Transaction created',
        data: {
          latestTransactions,
          account: {
            id: req.body.account,
            balance: updatedBalance,
          },
        },
      });
    }

    console.log('__Bottom reached createTransactionController');
    return res.status(500).send({
      message: 'Something went wrong. Please try again later',
    });
  } catch (error) {
    console.log('ERRROR createTransactionController controller - userId ', req.metadata.userId, error);
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

export const getLatestTransactionsController = async (req: Request, res: Response<IResponse>, next: NextFunction) => {
  try {
    const latestTransactions = await TransactionService.getLatestTransactions(req.metadata.userId as string);

    console.log('latestTransactions', latestTransactions);

    return res.status(200).send({
      message: 'Latest transactions fetched successfully',
      data: {
        latestTransactions: latestTransactions,
      },
    });
  } catch (error) {
    console.log('ERRROR getLatestTransactionsController controller - userId ', req.metadata.userId, error);
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
