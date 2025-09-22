import { setRole, setAccessToken, setRefreshToken } from './auth/store';

import {
  setUserInfo,
  setNumNotify,
  setIsLoading,
  setAppStatus,
  setIsFirstUse,
  setFirebaseToken,
} from './user/store';

import { setTrip, endOngoingTrips } from './trip/store';

export {
  //Authentication
  setRole,
  setAccessToken,
  setRefreshToken,
  //User
  setUserInfo,
  setNumNotify,
  setIsLoading,
  setAppStatus,
  setIsFirstUse,
  setFirebaseToken,
  //Trip
  setTrip,
  endOngoingTrips,
};
