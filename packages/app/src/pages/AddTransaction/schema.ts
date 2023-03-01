import { z } from 'zod';

const CurrencyEnums = z.enum(['EUR', 'RON']);
const TransactionTypesEnums = z.enum(['Income', 'Expense']);

export const addTransactionSchema = z.object({
  transactionType: TransactionTypesEnums,
  amount: z.number().min(1, { message: 'Amount should be greater than 0.' }),
  merchant: z.string(),
  currency: CurrencyEnums,
  date: z.string(),
});
// .refine(
//   (data) =>
//     (data.transactionType as string) === 'Expense' &&
//     (data.transactionType as string) === 'Income',
//   {
//     path: ['transactionType'],
//     message: 'Invalid transaction type',
//   },
// )
// .refine(
//   (data) => (
//     (data.currency as string) !== 'EUR' &&
//       (data.transactionType as string) !== 'RON',
//     {
//       path: ['currency'],
//       message: 'Invalid currency',
//     }
//   ),
// );

export type AddTransactionProps = z.infer<typeof addTransactionSchema>;
