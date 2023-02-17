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
    setAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
    setResetPwToken: (
      state,
      action: PayloadAction<{ resetPwToken: string }>,
    ) => {
      state.resetPwToken = action.payload.resetPwToken;
    },
  },
});

export const { setAccessToken, setResetPwToken } = userSlice.actions;
export default userSlice.reducer;

interface State {
  user: IUserState;
}

// Selectors
const userState = (state: State) => state.user;

export const selectAccessToken = createSelector(
  userState,
  (state) => state.accessToken,
);

export const selectResetToken = createSelector(
  userState,
  (state) => state.resetPwToken,
);
