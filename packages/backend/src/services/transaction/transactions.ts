import { Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import {
  CreateTransactionArgs,
  EditTransactionArgs,
  EditTranscationReturn,
  ValidateTransactionArgs,
  ValidateTransactionReturn,
} from './types';
import { TransactionType, TLatestTransactions } from './types';
import { BankAccountService } from '../account/account';

export interface ITransaction {
  createTransaction(args: CreateTransactionArgs): Promise<string>;
  editTransactionById(args: EditTransactionArgs): Promise<EditTranscationReturn>;
  validateTransaction(args: ValidateTransactionArgs): Promise<ValidateTransactionReturn>;
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

  async validateTransaction(args: ValidateTransactionArgs) {
    console.log('validateTransaction args', args);
    /* 
      Used to check an existing transaction before editing : 
        - check if transaction exists
        - check if the user that made the request is authorized to made the opperation.
    */

    try {
      const transaction = await prisma.transaction.findFirst({
        where: {
          id: args.transactionId,
        },
        select: {
          type: true,
          amount: true,
          account: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });

      if (!transaction) {
        console.log('No transaction found based on the transactionId', args.transactionId);

        return {
          isSucess: false,
          message: 'No transaction found',
        };
      }

      console.log('transaction', transaction);
      const {
        account: { userId },
      } = transaction;
      console.log('userId transaction', userId);
      if (!userId || userId !== args.userId) {
        return {
          isSucess: false,
          message: 'Forbidden. Not allowed to edit other users transactions',
        };
      }

      console.log('Passed all checks, transaction is valid', args.transactionId);
      return {
        isSucess: true,
        message: 'Passed all checks',
        data: {
          amount: String(transaction.amount),
          transactionType: transaction.type,
          accountId: transaction.account.id,
        },
      };
    } catch (error) {
      console.log('ERRROR validateTransaction service - userId ', args.userId, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA validateTransaction service - userId ', args.userId, error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES validateTransaction service - userId ', args.userId, error);
      throw new Error('Something went wrong. Please try again later');
    }
  },

  async editTransactionById(args: EditTransactionArgs) {
    try {
      const { isSucess, message, data } = await this.validateTransaction({
        transactionId: args.transactionId,
        userId: args.userId,
      });

      if (!isSucess || message !== 'Passed all checks') {
        return {
          isSuccess: false,
          message: 'Transaction was not updated',
        };
      }

      if (isSucess && message === 'Passed all checks') {
        await prisma.transaction.update({
          where: {
            id: args.transactionId,
          },
          data: {
            amount: args.amount,
            merchant: args.merchant,
            type: args.transactionType,
            date: new Date(args.date).toISOString(),
          },
        });

        if (data) {
          const { amount, transactionType, accountId } = data;

          if (Number(amount) !== args.amount || transactionType !== args.transactionType) {
            console.log('need to update the account balance');

            await this.updateBalanceByType(accountId, args.transactionType, Number(amount));
            console.log('account balance updated');
          }
        }

        console.log('Transaction updated', args.transactionId);

        return {
          isSuccess: true,
          message: 'Transaction updated',
        };
      }

      console.log('Transaction was not updated', args.transactionId);
      return {
        isSuccess: false,
        message: 'Transaction was not updated',
      };
    } catch (error) {
      console.log('ERRROR editTransactionById service - userId ', args.userId, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA editTransactionById service - userId ', args.userId, error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES editTransactionById service - userId ', args.userId, error);
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
