/**
 * Redux Store Configuration for Authentication
 * This file configures the Redux store with Redux Persist for state persistence
 */
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { rootReducer } from './rootReducer';

// Storage configuration for redux-persist
// Using localStorage (works with Next.js App Router via PersistGate)
import storage from 'redux-persist/lib/storage';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // Only persist auth slice, exclude other slices if needed
  whitelist: ['auth'],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Type exports for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

