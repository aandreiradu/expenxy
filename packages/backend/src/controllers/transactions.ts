import { NextFunction, Request, Response } from 'express';
import { type CreateTransactionArgs, createTransactionSchema, TransactionService } from '../services/transactions';

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

// export const createTransactionController = async (
//   req: Request<{}, {}, CreateTransactionArgs>,
//   res: Response<IResponse>,
//   next: NextFunction,
// ) => {
//   console.log('req.body', req.body);
//   const result = createTransactionSchema.safeParse(req.body);
//   console.log('result', result);
//   if (!result.success) {
//     const formatted = result.error.flatten();

//     return res.status(422).send({
//       error: {
//         message: 'Error validation',
//         fieldErrors: formatted.fieldErrors,
//       },
//     });
//   }
// export const createTransactionController = async (
//   req: Request<{}, {}, CreateTransactionArgs>,
//   res: Response<IResponse>,
//   next: NextFunction,
// ) => {
//   console.log('req.body', req.body);
//   const result = createTransactionSchema.safeParse(req.body);
//   console.log('result', result);
//   if (!result.success) {
//     const formatted = result.error.flatten();

//   try {
//     const userId = req.metadata.userId as string;
//     console.log('userId', userId);
//     const { amount, merchant, transactionType, date, currency } = req.body;
//     console.log('req.body', req.body);

//     if (!userId) {
//       console.log('no user found in metadata');
//       return res.status(400).send({
//         message: "Couldn't identify the user",
//       });
//     }

//     const id = await TransactionService.createTransaction({
//       amount,
//       merchant,
//       transactionType,
//       currency,
//       date,
//       userId,
//     });

//     console.log('id createTransactionController', id);

// try {
//   const userId = req.metadata.userId as string;
//   console.log('userId', userId);
//   const { amount, merchant, transactionType, date, currency } = req.body;
//   console.log('req.body', req.body);

//   if (!userId) {
//     console.log('no user found in metadata');
//     return res.status(400).send({
//       message: "Couldn't identify the user",
//     });
//   }

//   const id = await TransactionService.createTransaction({
//     amount,
//     merchant,
//     transactionType,
//     currency,
//     date,
//     userId,
//   });

//     return res.status(200).send({
//       message: 'Transaction created successfully',
//       data: id,
//     });
//   } catch (error) {
//     console.log('Error addTransaction controller', error);
//     return next(error);
//   }
// };
