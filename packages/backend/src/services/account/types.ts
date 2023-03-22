import { z } from 'zod';
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
    accountTypeId: z.string().uuid(),
    currency: z.string().uuid(),
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
  accountTypeId: CreateBankAccountArgs['accountTypeId'];
  currency: CreateBankAccountArgs['currency'];
};

export type HasExistingAccountReturn = {
  currency: string;
  accountType: string;
  userId: string;
};
