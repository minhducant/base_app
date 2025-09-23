import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { AuthApi } from '@api/auth';

const initialState = {
  userInfo: {},
  numNotify: 0,
  appStatus: 2,
  isLoading: false,
  firebaseToken: '',
  isFirstUse: true,
};

const store = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setNumNotify(state, action) {
      state.numNotify = action.payload;
      return state;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
      return state;
    },
    setFirebaseToken(state, action) {
      state.firebaseToken = action.payload;
      return state;
    },
    setIsFirstUse(state, action) {
      state.isFirstUse = action.payload;
      return state;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
      return state;
    },
    setAppStatus(state, action) {
      state.appStatus = action.payload;
      return state;
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload;
    });
  },
});

const getUserInfo: any = createAsyncThunk('getUserInfo', async () => {
  return await AuthApi.getUserInfo({});
});

export const {
  setUserInfo,
  setNumNotify,
  setAppStatus,
  setIsLoading,
  setIsFirstUse,
  setFirebaseToken,
} = store.actions;

export { getUserInfo };

export const stores = {
  reducer: store.reducer,
  ...store.actions,
};
