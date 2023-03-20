import prisma from '../utils/prisma';
import { z } from 'zod';
<<<<<<< HEAD
import { AuthService } from './auth';
=======
import { AuthService } from './auth/auth';
>>>>>>> main

const TransactionTypeEnum = z.enum(['Expense', 'Income']);
const CurrencyEnums = z.enum(['EUR', 'RON']);

export const createTransactionSchema = z
  .object({
    transactionType: TransactionTypeEnum,
    amount: z.number(),
    merchant: z.string(),
    currency: CurrencyEnums,
    date: z.string(),
  })
  .refine(
    (data) => (
<<<<<<< HEAD
      (data.transactionType as string) != 'Expense' &&
        (data.transactionType as string) != 'Income',
=======
      (data.transactionType as string) != 'Expense' && (data.transactionType as string) != 'Income',
>>>>>>> main
      {
        path: ['transactionType'],
        message: 'Invalid transaction type',
      }
    ),
  );

export type CreateTransactionArgs = z.infer<typeof createTransactionSchema>;

interface ITransaction {
<<<<<<< HEAD
  createTransaction(
    args: CreateTransactionArgs & { userId: string },
  ): Promise<string>;
}

export const TransactionService: ITransaction = {
  async createTransaction(args: CreateTransactionArgs & { userId: string }) {
    const { userId: userIdArgs, amount, merchant, transactionType } = args;

    const userId = await AuthService.getUserById(userIdArgs);

    if (!userId) {
      throw new Error('Could not identify the user by userId');
    }

    // Create transaction
    const { id: transactionId } = await prisma.transactions.create({
      data: {
        amount: amount,
        merchant: merchant,
        type: transactionType,
        accountId: userId,
      },
      select: {
        id: true,
      },
    });
    console.log('created this transaction', transactionId);

    return transactionId;
  },
=======
  createTransaction?(args: CreateTransactionArgs & { userId: string }): Promise<string>;
}

export const TransactionService: ITransaction = {
  // async createTransaction(args: CreateTransactionArgs & { userId: string }) {
  //   const { userId: userIdArgs, amount, merchant, transactionType } = args;
  //   const userId = await AuthService.getUserById(userIdArgs);
  //   if (!userId) {
  //     throw new Error('Could not identify the user by userId');
  //   }
  //   // Create transaction
  //   const { id: transactionId } = await prisma.transactions.create({
  //     data: {
  //       amount: amount,
  //       merchant: merchant,
  //       type: transactionType,
  //       accountId: userId,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  //   console.log('created this transaction', transactionId);
  //   return transactionId;
  // },
>>>>>>> main
};
