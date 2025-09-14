import { combineReducers } from '@reduxjs/toolkit';

import { stores as User } from './user/store';
import { stores as Auth } from './auth/store';

const rootReducer = combineReducers({
  user: User.reducer,
  auth: Auth.reducer,
});

export default rootReducer;
