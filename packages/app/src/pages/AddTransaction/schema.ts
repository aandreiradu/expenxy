import { z } from 'zod';

export const CurrencyEnums = z.enum(['EUR', 'RON'], {
  errorMap: (issue) => {
    switch (issue.code) {
      case 'invalid_enum_value':
      case 'invalid_type':
        return { message: 'Invalid Currency' };

      default:
        return { message: 'Invalid Currency' };
    }
  },
});
const TransactionTypesEnums = z.enum(['Income', 'Expense'], {
  errorMap: (issue) => {
    switch (issue.code) {
      case 'invalid_enum_value':
      case 'invalid_type':
        return { message: 'Invalid Transaction Type' };

      default:
        return { message: 'Invalid Transaction Type' };
    }
  },
});

export const addTransactionSchema = z.object({
  account: z.string().min(1, { message: 'Please select an account' }),
  transactionType: TransactionTypesEnums,
  amount: z.number().min(1, { message: 'Amount should be greater than 0.' }),
  merchant: z.string().optional(),
  date: z.string(),
  details: z.string().optional(),
});

export type AddTransactionProps = z.infer<typeof addTransactionSchema>;
