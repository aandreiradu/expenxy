import { z } from 'zod';
import { Dispatch, SetStateAction } from 'react';
import { TShowComponent } from '../Home';
import { addTransactionSchema } from './schema';

export type AvailableTypes = 'Expense' | 'Income';
export type AvailableCurrency = 'RON' | 'EUR';
export type TAddTransaction = TShowComponent & {
  setShowComponent: Dispatch<SetStateAction<TShowComponent>>;
};

export const typeProps: { value: AvailableTypes }[] = [{ value: 'Expense' }, { value: 'Income' }];

export type AddTransactionProps = z.infer<typeof addTransactionSchema>;

export type EditTransactionProps = Pick<AddTransactionProps, 'amount' | 'date' | 'merchant' | 'transactionType'>;
