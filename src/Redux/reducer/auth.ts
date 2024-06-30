import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/Redux/api/auth';
import { RootState } from '../store';
type TState = {
  token: string | null;
};

const initialState: TState = { token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.data.token;
      },
    );
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state, _) => {
      state.token = null;
    });
    builder.addMatcher(authApi.endpoints.logout.matchRejected, (state, _) => {
      state.token = null;
    });
  },
});

export const { setToken } = authSlice.actions;
export const getToken = (state: RootState) => state.auth.token;
export default authSlice.reducer;
