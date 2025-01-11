import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appSlice from './slices/appSlice';
import themeSlice from './slices/themeSlice';
import authSlice from './slices/authSlice';
import postSlice from './slices/postSlice';

const persistConfig = {
  key: 'root',
  storage,
};

// Assuming these slices are created using createSlice from Redux Toolkit
const rootReducer = combineReducers({
  app: appSlice,
  auth: authSlice,
  post: postSlice,
  theme: themeSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistedStore = persistStore(store);

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;