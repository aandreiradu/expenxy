import { createSelector } from '@reduxjs/toolkit';
import { IState } from '../store';

/* Account Selectors */
const accountState = (state: IState) => state.account;

export const selectUserAccounts = createSelector(accountState, (state) => state.accounts);

export const selectAccountById = (id: string) => {
  return createSelector(accountState, (state) => {
    return state.accounts.find((acc) => acc.id === id);
  });
};
