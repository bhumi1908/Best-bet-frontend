/**
 * Root Reducer
 * Combines all reducers into a single root reducer
 */

import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice';
import supportReducer from '../slice/supportSlice';
import profileReducer from '../slice/profileSlice';
import subscriptionPlanReducer from '../slice/subscriptionPlanSlice';
import stripeIntegrationReducer from '../slice/stripeSlice';
import subscriptionReducer from '../slice/subscriptionSlice';

// Combine all reducers
export const rootReducer = combineReducers({
  user: userReducer,
  support: supportReducer,
  profile: profileReducer,
  subscriptionPlan: subscriptionPlanReducer,
  stripeIntegration: stripeIntegrationReducer,
  subscription: subscriptionReducer
  
  // Add other reducers here as needed
});

export type RootState = ReturnType<typeof rootReducer>;

