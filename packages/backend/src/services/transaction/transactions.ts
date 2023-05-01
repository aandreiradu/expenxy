import { Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import {
  CreateTransactionArgs,
  DeleteTransactionArgs,
  DeletedTransactionReturn,
  EditTransactionArgs,
  EditTranscationReturn,
  GetDeletedTransactionsArgs,
  InsertDeletedTransactionsArgs,
  UpdateTransactionByType,
  ValidateTransactionArgs,
  ValidateTransactionReturn,
} from './types';
import { TLatestTransactions } from './types';
import { BankAccountService } from '../account/account';
import { Decimal } from '@prisma/client/runtime';

export interface ITransaction {
  createTransaction(args: CreateTransactionArgs): Promise<string>;
  editTransactionById(args: EditTransactionArgs): Promise<EditTranscationReturn>;
  deleteTransactionById(args: DeleteTransactionArgs): Promise<EditTranscationReturn>;
  insertDeletedTransaction(args: InsertDeletedTransactionsArgs): Promise<void>;
  validateTransaction(args: ValidateTransactionArgs): Promise<ValidateTransactionReturn>;
  updateBalanceByType(accountId: string, transactionType: UpdateTransactionByType, amount: number): Promise<number | void>;
  getLatestTransactions(userId: string): Promise<TLatestTransactions[] | []>;
  getDeletedTransactions(args: GetDeletedTransactionsArgs): Promise<DeletedTransactionReturn>;
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
          date: true,
          details: true,
          merchant: true,
          account: {
            select: {
              id: true,
              userId: true,
              currencyId: true,
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

      const {
        account: { userId },
      } = transaction;
      if (!userId || userId !== args.userId) {
        return {
          isSucess: false,
          message: 'Forbidden. Not allowed to edit / delete other users transactions',
        };
      }

      console.log('Passed all checks, transaction is valid', args.transactionId);
      return {
        isSucess: true,
        message: 'Passed all checks',
        data: {
          amount: String(transaction.amount),
          transactionType: transaction.type ?? '',
          accountId: transaction.account.id ?? '',
          details: transaction.details ?? '',
          merchant: transaction.merchant ?? '',
          transactionDate: transaction.date ?? '',
          currencyId: transaction.account.currencyId,
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
          message: message || 'Transaction was not updated',
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

            await this.updateBalanceByType(accountId, args.transactionType, args.amount);
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

  async deleteTransactionById(args: DeleteTransactionArgs) {
    const { transactionId, userId } = args;

    try {
      const { isSucess, message, data } = await this.validateTransaction({ transactionId: transactionId, userId: userId });

      console.log('data returned from validate', data);

      if (!isSucess || message !== 'Passed all checks') {
        return {
          isSuccess: false,
          message: message || 'Transaction was not updated',
        };
      }

      if (isSucess && data && message === 'Passed all checks') {
        /* 
            Delete transaction 
            Update the user balance 
            Insert deleted transaction    
        */

        /* Insert deleted transaction */
        const { transactionType, transactionDate, amount, details, merchant, accountId, currencyId } = data;

        await this.insertDeletedTransaction({
          amount: new Decimal(amount),
          details: details,
          merchant: merchant,
          deletedAt: new Date(),
          transactionDate: transactionDate,
          transactionType: transactionType,
          accountId: accountId,
          currencyId: currencyId,
        });

        /* Delete transaction from account */
        await prisma.transaction.delete({
          where: {
            id: transactionId,
          },
        });

        /* Update account balance */
        await this.updateBalanceByType(data.accountId, 'Delete', Number(data.amount));

        return {
          isSuccess: true,
          message: 'Transaction deleted',
        };
      }

      return {
        isSuccess: false,
        message: 'Transaction was not deleted',
      };
    } catch (error) {
      console.log('ERRROR deleteTransactionById service - transactionId ', transactionId, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA deleteTransactionById service - transactionId ', transactionId, error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES deleteTransactionById service - transactionId ', transactionId, error);
      throw new Error('Something went wrong. Please try again later');
    }
  },

  async insertDeletedTransaction(args: InsertDeletedTransactionsArgs) {
    try {
      await prisma.deletedTransactions.create({
        data: {
          transactionType: args.transactionType,
          amount: args.amount,
          details: args.details ?? '',
          merchant: args.merchant ?? '',
          transactionDate: args.transactionDate,
          accountId: args.accountId,
          currencyId: args.currencyId,
        },
      });
    } catch (error) {
      console.log('ERRROR insertDeletedTransaction service', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA insertDeletedTransaction service', error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES insertDeletedTransaction service', error);
      throw new Error('Something went wrong. Please try again later');
    }
  },

  async updateBalanceByType(accountId: string, transactionType: UpdateTransactionByType, amount: number) {
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

        case 'Delete': {
          const updatedBalance = Number(balance) - Number(amount);

          await prisma.account.update({
            where: {
              id: account.id,
            },
            data: {
              balance: updatedBalance,
            },
          });

          break;
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

  async getDeletedTransactions({ currentPage, perPage, userId }) {
    const deletedTransactionNo = await prisma.deletedTransactions.count({
      where: {
        account: {
          userId: userId,
        },
      },
    });

    console.log('skip is', (currentPage - 1) * perPage);
    console.log('take is', perPage);

    const deletedTransactionsQuery = await prisma.deletedTransactions.findMany({
      skip: (currentPage - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        transactionDate: true,
        transactionType: true,
        merchant: true,
        deletedAt: true,
        amount: true,
        details: true,
        currency: {
          select: {
            symbol: true,
          },
        },
      },
      where: {
        account: {
          User: {
            id: userId,
          },
        },
      },
      orderBy: {
        deletedAt: 'desc',
      },
    });

    if (deletedTransactionsQuery.length === 0) {
      console.log('No deleted transactions found for userId', userId);
      return {
        deletedTransactions: [],
        deletedTransactionsCount: deletedTransactionNo,
      };
    }

    console.log('deletedTransactionsQuery', deletedTransactionsQuery);

    const deletedTransactions = deletedTransactionsQuery.map((acc) => {
      return {
        id: acc.id,
        amount: acc.amount,
        deletedAt: acc.deletedAt,
        merchant: acc.merchant,
        transactionDate: acc.transactionDate,
        transactionType: acc.transactionType,
        currencySymbol: acc.currency.symbol,
      };
    });

    return {
      deletedTransactions: deletedTransactions,
      deletedTransactionsCount: deletedTransactionNo,
    };
  },
};

export default TransactionService;
