import {
  combineReducers,
  configureStore,
  isRejectedWithValue,
  Middleware,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from './api/auth';
import authReducer, { setToken } from './reducer/auth';
import { ErrorCode } from '@/types/response.type';
import infoReducer from './reducer/userInfo';
import { teamApi } from './api/team';
import { playerApi } from './api/player';
import { matchApi } from './api/match';
import { fundApi } from './api/fund';
const reducers = combineReducers({
  // signUpInfo: signUpInfoReducer,
  auth: authReducer,
  info: infoReducer,
  [authApi.reducerPath]: authApi.reducer,
  [teamApi.reducerPath]: teamApi.reducer,
  [playerApi.reducerPath]: playerApi.reducer,
  [matchApi.reducerPath]: matchApi.reducer,
  [fundApi.reducerPath]: fundApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'info'],
  blacklist: [
    authApi.reducerPath,
    teamApi.reducerPath,
    playerApi.reducerPath,
    matchApi.reducerPath,
    fundApi.reducerPath
  ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const rtkQueryErrorLogger: Middleware = api => next => action => {
  if (isRejectedWithValue(action)) {
    if (action.payload.response_code === ErrorCode.NOT_ACCESS) {
      api.dispatch(setToken(null));
      //   api.dispatch(setUser(null));
    }
  }

  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: gDM =>
    gDM({ serializableCheck: false }).concat(
      authApi.middleware,
      teamApi.middleware,
      playerApi.middleware,
      matchApi.middleware,
      fundApi.middleware,
      rtkQueryErrorLogger,
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
