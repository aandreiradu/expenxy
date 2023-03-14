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
  transactionType: TransactionTypesEnums,
  amount: z.number().min(1, { message: 'Amount should be greater than 0.' }),
  merchant: z.string(),
  currency: CurrencyEnums,
  date: z.string(),
});

export type AddTransactionProps = z.infer<typeof addTransactionSchema>;
