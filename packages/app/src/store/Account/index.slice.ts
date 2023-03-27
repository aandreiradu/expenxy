import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { BANK_ACCOUNT_TYPES } from '../../components/BankCard';

export type Account = {
  id: string;
  balance: string;
  bankAccountType: { name: keyof typeof BANK_ACCOUNT_TYPES | '' };
  currency: { name: string; code: string } | Record<string, string>;
};

export interface IAccountState {
  accounts: Account[];
}

const initialState: IAccountState = {
  accounts: [
    {
      id: '',
      balance: '',
      bankAccountType: {
        name: '',
      },
      currency: {},
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
  },
});

export const { setAccountData } = accountSlice.actions;
export default accountSlice.reducer;
