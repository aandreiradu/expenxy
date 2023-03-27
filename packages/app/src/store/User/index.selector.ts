import { createSelector } from '@reduxjs/toolkit';
import { IState } from '../store';

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
