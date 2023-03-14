import { RootState, store } from '../store';
import { createSelector } from '@reduxjs/toolkit';
import { IUserState } from './index.slice';

interface State {
  user: IUserState;
}

export const userState = (state: State) => state.user;

export const selectAccessToken = createSelector(
  userState,
  (state) => state.accessToken,
);
