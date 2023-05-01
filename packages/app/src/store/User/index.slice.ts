import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AvailableTypes as TransactionTypes } from '../../pages/AddTransaction/types';

type OverviewAccount = {
  expensesPercentage: number;
  incomesPercentage: number;
  favoriteMerchant: string;
};

type OverviewAccount = {
  expensesPercentage: number;
  incomesPercentage: number;
  favoriteMerchant: string;
};

export type TTransaction = {
  transactionId: string;
  amount: string;
  merchant: string;
  currency: string;
  currencySymbol: string;
  accountId: string;
  createdAt: string;
  date: string;
  accountSelected: string;
  transactionType: 'Expense' | 'Income';
};

export type DeletedTransaction = {
  id: string;
  merchant: string;
  deletedAt: string;
  transactionDate: string;
  transactionType: TransactionTypes;
  amount: number;
  details: string;
  currencySymbol: string;
};


const initialState: IUserState = {
  accessToken: null,
  username: null,
  fullName: null,
  imageUrl: null,
  latestTransactions: [],
  accountSelected: '',
  accountOverview: null,
  deletedTransactions: {
    transactions: [],
    totalTransactions: 0,
    page: 1,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<{ accessToken: string; username: string }>) => {
      const { accessToken, username } = action.payload;

      state.accessToken = accessToken;
      state.username = username;
    },

    setAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
    setResetPwToken: (state, action: PayloadAction<{ resetPwToken: string }>) => {
      state.resetPwToken = action.payload.resetPwToken;
    },
    logOut: (state) => {
      state.accessToken = null;
    },

    setLatestTransactions: (state, action: PayloadAction<{ latestTransactions: TTransaction[] }>) => {
      state.latestTransactions = action.payload.latestTransactions;
    },

    setAccountSelected: (state, action: PayloadAction<{ accountId: string }>) => {
      state.accountSelected = action.payload.accountId;
    },

    setAccountOverview: (state, action: PayloadAction<OverviewAccount>) => {
      state.accountOverview = action.payload;
    },
    setDeletedTransactions: (
      state,
      action: PayloadAction<{ transactions: DeletedTransaction[]; totalTransactions: number }>,
    ) => {
      const { totalTransactions, transactions } = action.payload;

      state.deletedTransactions.transactions = transactions;
      state.deletedTransactions.totalTransactions = totalTransactions;
    },

    setDeletedTransactionsPageNo: (state, action: PayloadAction<{ pageNo: number }>) => {
      state.deletedTransactions.page = action.payload.pageNo;
    },

  },
});

export const {
  setAccessToken,
  setResetPwToken,
  logOut,
  setAuthData,
  setLatestTransactions,
  setAccountSelected,
  setAccountOverview,
  setDeletedTransactions,
  setDeletedTransactionsPageNo,
} = userSlice.actions;
export default userSlice.reducer;
