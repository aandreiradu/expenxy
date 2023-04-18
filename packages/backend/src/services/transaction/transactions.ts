import { Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import { CreateTransactionArgs } from './types';
import { TransactionType, TLatestTransactions } from './types';
import { BankAccountService } from '../account/account';

export interface ITransaction {
  createTransaction(args: CreateTransactionArgs): Promise<string>;
  updateBalanceByType(accountId: string, transactionType: TransactionType, amount: number): Promise<number | void>;
  getLatestTransactions(userId: string): Promise<TLatestTransactions[] | []>;
}

const TransactionService: ITransaction = {
  async createTransaction(args: CreateTransactionArgs) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          amount: args.amount,
          accountId: args.account,
          type: args.transactionType,
          date: new Date(args.date),
          details: args.details,
          merchant: args.merchant,
          createdAt: new Date().toISOString(),
        },
      });

      return transaction.id;
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

  async updateBalanceByType(accountId: string, transactionType: TransactionType, amount: number) {
    try {
      const account = await BankAccountService.getAccountById(accountId);

      if (!account) {
        throw new Error('No account found based on provided id');
      }

      const balance = account.balance as number;
      switch (transactionType) {
        case 'Income': {
          const updatedBalance = Number(balance) + Number(amount);

          await prisma.account.update({
            where: {
              id: accountId,
            },
            data: {
              balance: updatedBalance,
            },
          });

          await prisma.account_ADT.create({
            data: {
              balance: updatedBalance,
              name: account.name,
              accountId: accountId,
            },
          });

          return updatedBalance;
        }
        case 'Expense': {
          const updatedBalance = Number(balance) - Number(amount);

          await prisma.account.update({
            where: {
              id: accountId,
            },
            data: {
              balance: updatedBalance,
            },
          });

          await prisma.account_ADT.create({
            data: {
              balance: updatedBalance,
              name: account.name,
              accountId: accountId,
            },
          });

          return updatedBalance;
        }

        default: {
          console.log('Unhandled transaction type', transactionType);
          return;
        }
      }
    } catch (error) {
      console.log('ERRROR updateBalanceByType service - accountId ', accountId, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA updateBalanceByType service - accountId ', accountId, error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES updateBalanceByType service - accountId ', accountId, error);
      throw new Error('Something went wrong. Please try again later');
    }
  },

  async getLatestTransactions(userId: string) {
    try {
      const transactions = await prisma.transaction.findMany({
        take: Number(process.env.EXPENXY_LATEST_TRANSACTIONS_BATCH) || 10,
        where: {
          account: {
            userId: userId,
          },
        },
        select: {
          id: true,
          type: true,
          date: true,
          amount: true,
          merchant: true,
          createdAt: true,
          account: {
            select: {
              currency: {
                select: {
                  code: true,
                  symbol: true,
                },
              },
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return transactions.map((tr) => {
        return {
          transactionId: tr.id,
          date: tr.date,
          amount: tr.amount,
          merchant: tr.merchant,
          currency: tr.account.currency.code,
          currencySymbol: tr.account.currency.symbol,
          createdAt: tr.createdAt,
          accountId: tr.account.id,
          transactionType: tr.type,
        };
      });
    } catch (error) {
      console.log('ERRROR getLatestTransactions service - userId ', userId, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA getLatestTransactions service - useriD ', userId, error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES getLatestTransactions service - useriD ', userId, error);
      throw new Error('Something went wrong. Please try again later');
    }
  },
};

export default TransactionService;
