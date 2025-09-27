import AsyncStorage from '@react-native-async-storage/async-storage';

import { store } from '@stores/index';
import {
  setUserInfo,
  setAppStatus,
  setAccessToken,
  setRefreshToken,
} from '@stores/action';
import { navigationRef } from '@navigation/rootNavigation';

export const onLogout = async () => {
  await AsyncStorage.removeItem('accessToken');
  store.dispatch(setUserInfo({}));
  store.dispatch(setAccessToken(''));
  store.dispatch(setRefreshToken(''));
  store.dispatch(setAppStatus(2));
};
