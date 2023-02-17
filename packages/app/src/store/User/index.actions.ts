import { IUserState } from './index.slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { LoginSchema } from '../../pages/Login/schema';
import { useAppDispatch } from '../hooks';
import { AppDispatch } from '../store';

// export const setAccessToken = (
//   state: IUserState,
//   action: PayloadAction<{ accessToken: string }>,
// ) => {
//   state.accessToken = action.payload.accessToken;
// };

// export const authUser = (userData: LoginSchema) => {
//   return async (useAppDispatch: AppDispatch) => {};
// };
