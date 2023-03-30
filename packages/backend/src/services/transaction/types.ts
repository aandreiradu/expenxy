import { z } from 'zod';

const zTransactionTypesEnums = z.enum(['Expense', 'Income'], {
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

export type CreateTransactionArgs = z.infer<typeof createTransactionSchema>;
