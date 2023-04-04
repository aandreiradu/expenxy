import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BANK_ACCOUNT_TYPES } from '../../components/BankCard';

export type BalanceEvolution = {
  balance: string;
  createdAt: string;
};

export type Account = {
  id: string;
  name: string;
  balance: string;
  bankAccountType: { name: keyof typeof BANK_ACCOUNT_TYPES | '' };
  currency: { name: string; code: string } | Record<string, string>;
  balanceEvolution: BalanceEvolution[];
};

export interface IAccountState {
  accounts: Account[];
}

const initialState: IAccountState = {
  accounts: [
    {
      id: '',
      name: '',
      balance: '',
      bankAccountType: {
        name: '',
      },
      currency: {},
      balanceEvolution: [],
    },
  ],
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountData: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },

    updateAccountBalanceById: (state, action: PayloadAction<{ accountId: string; balance: string }>) => {
      const { accountId, balance } = action.payload;

      const account = state.accounts.find((acc) => acc.id === accountId);

      if (account) {
        console.log('before update - balance is', account.balance);
        account.balance = balance;
        console.log('after update - balance is', account.balance);
      }
    },

    setBalanceEvolutionById: (state, action: PayloadAction<{ accountId: string; balanceEvolution: BalanceEvolution[] }>) => {
      const { accountId, balanceEvolution } = action.payload;

      const account = state.accounts.find((acc) => acc.id === accountId);

      if (account) {
        account.balanceEvolution = balanceEvolution;
      }
    },
  },
});

export const { setAccountData, updateAccountBalanceById, setBalanceEvolutionById } = accountSlice.actions;
export default accountSlice.reducer;
