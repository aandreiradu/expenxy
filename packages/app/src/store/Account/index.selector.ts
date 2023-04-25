import { createSelector } from '@reduxjs/toolkit';
import { IState } from '../store';

/* Account Selectors */
export const accountState = (state: IState) => state.account;

export const selectUserAccounts = createSelector(accountState, (state) => state.accounts);

export const selectAccountById = (id: string) => {
  return createSelector(accountState, (state) => {
    return state.accounts.find((acc) => acc.id === id);
  });
};

export const selectBalanceEvolutionById = (accountId: string) => {
  return createSelector(accountState, (state) => {
    return state.accounts.find((acc) => acc.id === accountId)?.balanceEvolution;
  });
};

export const selectBalanceEvolutionWidgetData = (accountId: string) => {
  return createSelector(accountState, (state) => {
    const account = state.accounts.find((acc) => acc.id === accountId);

    if (account) {
      return {
        balanceEvolutionCategoriesData: account.balanceEvolutionCategoriesData,
        balanceEvolutionDates: account.balanceEvolutionDates,
        balanceEvoluton: account.balanceEvolution,
      };
    }
  });
};
