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
      console.log('validateSchema', validateSchema);
      const flattenErrors = validateSchema.error.flatten();
      console.log('flattenErrors', flattenErrors);
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

    const transactionId = await TransactionService.createTransaction(req.body);

    console.log('transaction created successfully', transactionId);

    return res.status(201).send({
      message: 'Transaction created',
      data: {
        transactionId,
      },
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
