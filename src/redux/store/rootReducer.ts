/**
 * Root Reducer
 * Combines all reducers into a single root reducer
 */

import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice';

// Combine all reducers
export const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here as needed
});

export type RootState = ReturnType<typeof rootReducer>;

