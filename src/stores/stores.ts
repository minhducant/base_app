import { combineReducers } from '@reduxjs/toolkit';

import { stores as User } from './user/store';
import { stores as Auth } from './auth/store';
import { stores as Trip } from './trip/store';

const rootReducer = combineReducers({
  user: User.reducer,
  auth: Auth.reducer,
  trip: Trip.reducer,
});

export default rootReducer;
