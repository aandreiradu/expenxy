import { Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import {
  CreateBankAccountArgs,
  HasExistingAccountReturn,
  TGetAccountsData,
  THasExistingAccount,
  TGetBalanceEvolution,
  AccountOverviewFilter,
  AccountOverviewReturn,
} from './types';
import { addYears } from '../../utils/dates';
import db from '../../config/database';

interface IAccount {
  getBankingProducts(): Promise<{
    bankingProducts: { name: string; id: string }[];
    availableCurrecies: { id: string; code: string; name: string }[];
  }>;

  createBankAccount(args: CreateBankAccountArgs): Promise<{ accountId: string } | null>;

  // hasExistingAccount(args: THasExistingAccount): Promise<HasExistingAccountReturn | null>;
  hasExistingAccount(args: THasExistingAccount): Promise<HasExistingAccountReturn | null>;

  getBankingProductId(id: string): Promise<{ id: string; name: string } | null>;

  getCurrencyId(id: string): Promise<string | null>;

  needsBankAccount(id: string): Promise<boolean>;

  getAccounts(userId: string): Promise<TGetAccountsData | null>;

  getAccountById(accountId: string): Promise<{ balance: unknown; name: string; id: string } | null>;

  getBalanceEvolution(accountId: string): Promise<TGetBalanceEvolution>;

  getAccountOverview(accountId: string, filter: AccountOverviewFilter): Promise<AccountOverviewReturn>;
}

export const BankAccountService: IAccount = {
  async getBankingProducts() {
    const bankingProducts = await prisma.bankAccountType.findMany({
      select: {
        name: true,
        id: true,
      },
    });

    const availableCurrecies = await prisma.currency.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    console.log({
      availableCurrecies,
      bankingProducts,
    });

    return {
      bankingProducts,
      availableCurrecies,
    };
  },

  async getBankingProductId(id: string) {
    const bankingProduct = await prisma.bankAccountType.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return bankingProduct ?? null;
  },

  async getCurrencyId(currencyId: string) {
    const currency = await prisma.currency.findFirst({
      where: {
        id: currencyId,
      },
      select: {
        id: true,
      },
    });

    console.log('currency', currency);

    if (currency) {
      return currency.id;
    }

    console.log(`No currency found for id`, currencyId);
    return null;
  },

  async createBankAccount(args: CreateBankAccountArgs) {
    const selectedBankingProduct = await this.getBankingProductId(args.accountTypeId);
    const currencyId = await this.getCurrencyId(args.currency);
    console.log('selectedBankingProduct', selectedBankingProduct);

    if (!selectedBankingProduct) {
      console.log('couldnt identify the banking product, retun null', selectedBankingProduct);
      return null;
    }

    if (!currencyId) {
      console.log('couldnt identify the currencyid, retun null', currencyId);
      return null;
    }

    const { id: bankAccountTypeId } = selectedBankingProduct;

    const expiresAt = addYears(new Date(), Number(process.env.EXPENXY_ACCOUNT_EXPIRES_AFTER_YEARS) || 3);

    const bankAccount = await prisma.account.create({
      data: {
        name: args.accountName,
        balance: args.balance,
        currencyId: currencyId,
        bankAccountTypeId: bankAccountTypeId,
        userId: args.userId,
        status: 'Active',
        expiresAt: expiresAt,
      },
      select: {
        id: true,
      },
    });

    if (bankAccount?.id) {
      return { accountId: bankAccount.id };
    }

    return null;
  },

  async hasExistingAccount(args: THasExistingAccount) {
    const { id: bankingProductId } = (await this.getBankingProductId(args.accountTypeId)) || {};
    const currencyId = await this.getCurrencyId(args.currency);

    if (!bankingProductId) {
      console.log('couldnt identify the banking product for id', args.accountTypeId, 'retun null', bankingProductId);
      throw new Error('Could not identify the Banking Product');
    } else if (!currencyId) {
      console.log('couldnt identify the currency for id', args.currency, 'retun null', currencyId);
      throw new Error('Could not identify the Currency');
    }

    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: args.userId,
        currencyId: currencyId,
        bankAccountTypeId: bankingProductId,
      },
      select: {
        balance: true,
        currency: {
          select: {
            code: true,
          },
        },
        bankAccountType: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log('existingAccount', existingAccount);

    if (existingAccount) {
      return {
        currency: existingAccount.currency.code,
        accountType: existingAccount.bankAccountType.name,
        userId: args.userId,
      };
    }

    return null;
  },

  /*
    Used to count the bank account for a specific User. After Register / Login, if an user does not have a banking account,
    he will be redirected to create one
  */
  async needsBankAccount(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });

    if (!user) {
      return false;
    }

    const {
      _count: { accounts: accountNo },
    } = user;

    if (!accountNo) {
      return false;
    }

    return true;
  },

  async getAccounts(userId: string) {
    try {
      const existingAccounts = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          accounts: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              expiresAt: true,
              name: true,
              balance: true,
              currency: {
                select: {
                  name: true,
                  code: true,
                },
              },
              bankAccountType: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      if (existingAccounts) {
        return existingAccounts;
      }

      return null;
    } catch (error) {
      console.log('ERRROR __getAccounts service - userId ', userId, error);
      if (error instanceof Error) {
        const { message } = error;

        throw new Error(message);
      }

      throw new Error('Something went wrong. Please try again later');
    }
  },

  async getAccountById(accountId: string) {
    try {
      return await prisma.account.findFirst({
        where: {
          id: accountId,
        },
        select: {
          balance: true,
          name: true,
          id: true,
        },
      });
    } catch (error) {
      console.log('ERRROR __getAccountById service - accountId ', accountId);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA __getAccountById service - accountId ', accountId, error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES __getAccountById service - accountId ', accountId, error);
      throw new Error('Something went wrong. Please try again later');
    }
  },

  async getBalanceEvolution(accountId: string) {
    try {
      const balanceEvolution = await prisma.account_ADT.findMany({
        where: {
          accountId: accountId,
        },
        select: {
          balance: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return balanceEvolution;
    } catch (error) {
      console.log('ERRROR getBalanceEvolution service - accountId ', accountId, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
        console.log('ERRROR PRISMA getBalanceEvolution service - accountId ', accountId, error);
        throw new Error('Something went wrong, please try again later!');
      }

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES getBalanceEvolution service - accountId ', accountId, error);
      throw new Error('Something went wrong. Please try again later');
    }
  },
  async getAccountOverview(accountId: string, filter: AccountOverviewFilter) {
    console.log('getAccountOverview received', { accountId, filter });

    try {
      const sqlParams = [accountId, filter, filter, filter, filter];
      const sql = `
              set @income = 0,@expense = 0, @sum = 0;
              set @beginThisMonth := date_add(date_add(LAST_DAY(now()),interval 1 DAY),interval -1 MONTH);
              set @endThisMonth := LAST_DAY(now());
              set @beginLastMonth := DATE_ADD(LAST_DAY(DATE_SUB(NOW(), INTERVAL 2 MONTH)), INTERVAL 1 DAY);
              set @endLastMonth := LAST_DAY(DATE_SUB(NOW(), INTERVAL 1 MONTH));
              set @beginPastSixMonths := DATE_ADD(LAST_DAY(DATE_SUB(NOW(), INTERVAL 7 MONTH)), INTERVAL 1 DAY);
    
              select
                acc.name as 'AccountName',
                acc.balance as 'AccountBalance',
                @income := SUM(CASE WHEN tr.type = 'Income' then tr.amount end) as 'IncomesTotal',
                @expense := SUM(CASE WHEN tr.type = 'Expense' then tr.amount end) as 'ExpensesTotal',
                @sum := SUM(CASE WHEN tr.type = 'Expense' then - + tr.amount else tr.amount end) as 'TotalSum',
                round((@expense / acc.balance) * 100,2) as 'ExpensesPercentage',
                round((@income / acc.balance) * 100,2) as 'IncomesPercentage'
              from Account as  acc
              left join Transaction as tr
              on acc.id = tr.accountId
              where acc.id = ?
              and CASE
                  WHEN ? = 'THIS MONTH' THEN tr.date between @beginMonth and @endMonth
                  WHEN ? = 'LAST MONTH' THEN tr.date between @beginLastMonth  AND @endLastMonth
                        WHEN ? = 'LAST SIX MONTHS' THEN tr.date between @beginPastSixMonths  AND NOW()
                        WHEN ? = 'ALL' THEN tr.date between (SELECT min(date) from Transaction where accountId = acc.id) and NOW()
                        ELSE tr.date
                END
              group by acc.id,acc.name,acc.name
              order by acc.id,acc.name,acc.name ASC;
      `;

      return new Promise((resolve, reject) => {
        db.query(sql, sqlParams, function (err, result) {
          if (err) {
            reject(err);
          }

          console.log('result', result);
          console.log('hm2', { ...result[result.length - 1][0] });
          resolve({ ...result[result.length - 1][0] });
        });
      });
    } catch (error) {
      console.log('ERRROR getAccountOverview service - accountId ', accountId, error);

      if (error instanceof Error) {
        const { message } = error;
        throw new Error(message);
      }

      console.log('ERRROR NOT CHECKED INSTANCES getBalanceEvolution service - accountId ', accountId, error);
      throw new Error('Something went wrong. Please try again later');
    }
  },
};
