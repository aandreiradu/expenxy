import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import accountSlice, { IAccountState } from './Account/index.slice';
import userSlice, { IUserState } from './User/index.slice';

export interface IState {
  user: IUserState;
  account: IAccountState;
}

export const store = configureStore({
  reducer: {
    user: userSlice,
    account: accountSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
