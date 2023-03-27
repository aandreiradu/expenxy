import { createSelector } from '@reduxjs/toolkit';
import { IState } from '../store';

/* Account Selectors */
const accountState = (state: IState) => state.account;

export const selectUserAccounts = createSelector(accountState, (state) => state.accounts);
