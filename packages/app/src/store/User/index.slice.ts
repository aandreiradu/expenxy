import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IUserState {
  accessToken?: string | null;
  username?: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  resetPwToken?: string | null;
}

const initialState: IUserState = {
  accessToken: null,
  username: null,
  fullName: null,
  imageUrl: null,
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
  },
});

export const { setAccessToken, setResetPwToken, logOut, setAuthData } = userSlice.actions;
export default userSlice.reducer;
