import { Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import { CreateTransactionArgs } from './types';

export interface ITransaction {
  createTransaction(args: CreateTransactionArgs): Promise<string>;
}

const TransactionService: ITransaction = {
  async createTransaction(args: CreateTransactionArgs) {
    try {
      const newTransaction = await prisma.transaction.create({
        data: {
          amount: args.amount,
          accountId: args.account,
          type: args.transactionType,
          date: new Date(args.date),
          merchant: args.merchant,
          details: args.details,
        },
      });

      return newTransaction.id;
    } catch (error) {
      console.log('ERRROR __createTransaction service - accountId ', args.account, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA __createTransaction service - accountId ', args.account, error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES __createTransaction service - accountId ', args.account, error);
      throw new Error('Something went wrong. Please try again later');
    }
  },
};

export default TransactionService;
