import { Decimal } from '@prisma/client/runtime';
import { z } from 'zod';

export const zTransactionTypesEnums = z.enum(['Expense', 'Income'], {
  errorMap: (issue) => {
    switch (issue.code) {
      case 'invalid_enum_value':
      case 'invalid_type':
        return { message: 'Invalid Transaction Type' };

      default:
        console.log(`__ Unhandled transaction type`);
        return { message: 'Invalid Transaction Type' };
    }
  },
});

export type TransactionType = z.infer<typeof zTransactionTypesEnums>;

export const createTransactionSchema = z.object({
  account: z.string().uuid(),
  transactionType: zTransactionTypesEnums,
  amount: z
    .number()
    .min(1, { message: 'Amount should be greater than 0. In case of a Expense transaction, just select the Type' }),
  date: z.string() || z.date(),
  merchant: z.string().optional(),
  details: z.string().optional(),
});

export type CreateTransactionArgs = z.infer<typeof createTransactionSchema> & {
  userId: string;
};

export type TLatestTransactions = {
  date: Date;
  createdAt: Date;
  amount: Decimal;
  merchant: string | null;
  currency: string;
  currencySymbol: string;
  accountId: string;
};