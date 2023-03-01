import prisma from '../utils/prisma';
import { z } from 'zod';
import { AuthService } from './auth';

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
    (data) =>
      (data.transactionType as string) !== 'Expense' &&
      data.transactionType !== 'Income',
    {
      path: ['transactionType'],
      message: 'Invalid transaction type',
    },
  );

export type CreateTransactionArgs = z.infer<typeof createTransactionSchema>;

interface ITransaction {
  createTransaction(
    args: CreateTransactionArgs & { refreshToken: string },
  ): Promise<string>;
}

export const TransactionService: ITransaction = {
  async createTransaction(
    args: CreateTransactionArgs & { refreshToken: string },
  ) {
    const { refreshToken, amount, merchant, transactionType } = args;

    const { userId, username } = await AuthService.getUserByRefreshToken(
      refreshToken,
    );

    if (!userId || !username) {
      throw new Error('Could not identify user by refresh token');
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
};
