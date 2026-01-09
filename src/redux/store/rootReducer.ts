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
import gameHistoryReducer from '../slice/gameHistorySlice';
import statesReducer from '../slice/statesSlice';
import gameTypesReducer from '../slice/gameTypesSlice';
import drawHistoryReducer from '../slice/drawHistorySlice';

// Combine all reducers
export const rootReducer = combineReducers({
  user: userReducer,
  support: supportReducer,
  profile: profileReducer,
  subscriptionPlan: subscriptionPlanReducer,
  stripeIntegration: stripeIntegrationReducer,
  subscription: subscriptionReducer,
  gameHistory: gameHistoryReducer,
  states: statesReducer,
  gameTypes: gameTypesReducer,
  drawHistory: drawHistoryReducer,
  
  // Add other reducers here as needed
});

export type RootState = ReturnType<typeof rootReducer>;

