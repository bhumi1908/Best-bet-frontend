/**
 * Root Reducer
 * Combines all reducers into a single root reducer
 */

import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice';
import supportReducer from '../slice/supportSlice';

import subscriptionPlanReducer from '../slice/subscriptionPlanSlice';

// Combine all reducers
export const rootReducer = combineReducers({
  user: userReducer,
  support: supportReducer,
  
  subscriptionPlan: subscriptionPlanReducer
  
  // Add other reducers here as needed
});

export type RootState = ReturnType<typeof rootReducer>;

