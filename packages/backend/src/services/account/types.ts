import { z } from 'zod';
import { Account, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { TransactionType } from '../transaction/types';

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
          message: `Invalid Currency. Expected currencies: ${Object.keys(z.enum(['EUR']))}`,
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
    accountName: z.string().min(1),
    accountTypeId: z.string().uuid(),
    currency: z.string().uuid(),
    balance: z.coerce.number().default(0),
  })
  .superRefine((val, ctx) => {
    if (val.balance < -25000) {
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
  accountTypeId: CreateBankAccountArgs['accountTypeId'];
  currency: CreateBankAccountArgs['currency'];
};

export type HasExistingAccountReturn = {
  currency: string;
  accountType: string;
  userId: string;
};

/* Create Bank Account Types  */
export type CreateBankAccountResSucces = {
  accountId: string;
};

export type CreateBankAccountResExisting = {
  currency: string;
  bankAccountType: string;
};

export type CreateBankAccountResValidationErr = {
  message: string;
  fieldErrors: {
    [key: string]: string[];
  };
};

/* Return Type Get Accounts Data */
export type TGetAccountsData = {
  accounts: {
    id: string;
    name: string;
    balance: Decimal;
    currency: {
      name: string;
      code: string;
    };
    bankAccountType: {
      name: string;
    };
    status: string;
    createdAt: Date;
    expiresAt: Date;
  }[];
};

export const zAccountStatusesEnums = z.enum(['Active', 'Disabled', 'Banned', 'Pending'], {
  errorMap: (issue) => {
    switch (issue.code) {
      case 'invalid_enum_value':
      case 'invalid_type':
        return { message: 'Invalid Account Status' };

      default:
        console.log(`__ Unhandled Account Status`);
        return { message: 'Invalid Account Status' };
    }
  },
});

export type AccountStatuses = z.infer<typeof zAccountStatusesEnums>;

export type TGetBalanceEvolution = {
  balance: Prisma.Decimal;
  createdAt: Date;
}[];

export type AccountOverviewFilter = 'THIS MONTH' | 'LAST MONTH' | 'ALL' | 'LAST SIX MONTHS';

export type AccountOverviewReturn = {
  AccountName: string;
  AccountBalance: number;
  IncomesTotal: number;
  ExpensesTotal: number;
  TotalSum: number;
  ExpensesPercentage: number;
  IncomesPercentage: number;
  Merchant: string;
};
