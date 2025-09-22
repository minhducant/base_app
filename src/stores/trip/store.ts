import { createSlice } from '@reduxjs/toolkit';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface TripItem {
  startedAt?: string;
  endedAt?: string;
  from: Location;
  to: Location;
  co2?: number;
  distance?: number;
  duration?: number;
  transportation: 'car' | 'motorbike' | 'bus' | 'bicycle' | 'walk';
  status: 'planned' | 'ongoing' | 'ended';
}

const initialState: { trip: TripItem[] } = {
  trip: [],
};

const store = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTrip(state, action) {
      state.trip = action.payload;
      return state;
    },
    endOngoingTrips(state) {
      state.trip = state.trip.map(t =>
        t.status === 'ongoing'
          ? { ...t, status: 'ended', endedAt: new Date().toISOString() }
          : t,
      );
    },
  },
});

export const { setTrip, endOngoingTrips } = store.actions;

export const stores = {
  reducer: store.reducer,
  ...store.actions,
};
