import { createSelector } from '@reduxjs/toolkit';
import { IState } from '../store';
import { selectAccountById } from '../Account/index.selector';
import { TTransaction } from './index.slice';
import { accountState } from '../Account/index.selector';

// Selectors
const userState = (state: IState) => state.user;

export const selectAccessToken = createSelector(userState, (state) => state.accessToken);

export const selectResetToken = createSelector(userState, (state) => state.resetPwToken);

export const selectUserData = createSelector(userState, (state) => {
  return {
    username: state.username,
    fullName: state.fullName,
  };
});

export const selectLatestTransactions = createSelector(userState, (state) => {
  return {
    latestTransactions: state.latestTransactions,
  };
});

export const selectTransactionById = (transactionId: string) => {
  return createSelector(userState, (state) => {
    const data = state.latestTransactions.find((tr) => tr.transactionId === transactionId);

    if (!data) {
      return null;
    }

    return {
      accountId: data.accountId,
      merchant: data.merchant,
      date: data.date,
      transactionType: data.transactionType,
      amount: data.amount,
    };
  });
};

export const accountSelected = createSelector(userState, (state) => state.accountSelected);
