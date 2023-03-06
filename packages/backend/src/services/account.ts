import { z } from 'zod';
import prisma from '../utils/prisma';
import { Account } from '@prisma/client';

export const bankAccountTypes = z.enum(['Bank Account', 'Savings', 'Morgage'], {
  errorMap: (issue) => {
    console.log('issue', issue);
    switch (issue.code) {
      case 'invalid_enum_value':
      case 'invalid_type':
        return { message: `Invalid Bank Account Type` };

      default:
        return { message: 'Invalid Bank Account Type' };
    }
  },
});

export const currencyAccountTypes = z.enum(['EUR', 'RON'], {
  errorMap: (issue) => {
    switch (issue.code) {
      case 'invalid_enum_value':
      case 'invalid_type':
        return {
          message: `Invalid Currency. Expected currencies: ${Object.keys(
            z.enum(['EUR']),
          )}`,
        };

      default: {
        return { message: 'Invalid Currency' };
      }
    }
  },
});

export const createBankAccountSchema = z
  .object({
    userId: z.string(),
    accountType: bankAccountTypes,
    currency: currencyAccountTypes,
    balance: z.string().default('0'),
  })
  .superRefine((val, ctx) => {
    if (parseFloat(val.balance) < parseFloat('-25000')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum balance value can't be lower than -25.000",
        path: ['balance'],
      });
    }
  });

export type CreateBankAccountArgs = z.infer<typeof createBankAccountSchema>;

export type THasExistingAccount = {
  userId: string;
  type: CreateBankAccountArgs['accountType'];
  currency: CreateBankAccountArgs['currency'];
};

export type HasExistingAccountReturn = Pick<
  Account,
  'balance' | 'currency' | 'type'
>;

interface IAccount {
  createBankAccount(
    args: CreateBankAccountArgs,
  ): Promise<{ accountId: string }>;

  hasExistingAccount(
    args: THasExistingAccount,
  ): Promise<HasExistingAccountReturn | null>;
}

export const BankAccountService: IAccount = {
  async createBankAccount(args: CreateBankAccountArgs) {
    const bankAccount = await prisma.account.create({
      data: {
        balance: parseFloat(args.balance),
        currency: args.currency,
        type: args.accountType,
        userId: args.userId,
      },
      select: {
        id: true,
      },
    });

    return { accountId: bankAccount.id };
  },

  async hasExistingAccount(args: THasExistingAccount) {
    console.log('hasExistingAccount received', args);

    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: args.userId,
        type: args.type,
      },
      select: {
        balance: true,
        currency: true,
        type: true,
      },
    });

    if (existingAccount) {
      return existingAccount;
    }

    return null;
  },
};
