import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type TTransaction = {
  transactionId: string;
  amount: string;
  merchant: string;
  currency: string;
  currencySymbol: string;
  accountId: string;
  createdAt: string;
  date: string;
};

export interface IUserState {
  accessToken?: string | null;
  username?: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  resetPwToken?: string | null;
  latestTransactions: TTransaction[];
}

const initialState: IUserState = {
  accessToken: null,
  username: null,
  fullName: null,
  imageUrl: null,
  latestTransactions: [],
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
  },
});

export const { setAccessToken, setResetPwToken, logOut, setAuthData, setLatestTransactions } = userSlice.actions;
export default userSlice.reducer;
