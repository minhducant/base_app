import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  refreshToken: '',
  roles: [],
  status: '0',
};
const store = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStatusApp(state, action) {
      state.status = action.payload;
      return state;
    },
    setRole(state, action) {
      state.roles = action.payload;
      return state;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      console.log(action.payload)
      return state;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
      return state;
    },
  },
});

export const {setRole, setStatusApp, setAccessToken, setRefreshToken} =
  store.actions;

export const stores = {
  reducer: store.reducer,
  ...store.actions,
};
