import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  name: string;
  latitude: number;
  longitude: number;
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
    addTrip(state, action: PayloadAction<TripItem>) {
      state.trip.push(action.payload);
    },
  },
});

export const { setTrip, endOngoingTrips, addTrip } = store.actions;

export const stores = {
  reducer: store.reducer,
  ...store.actions,
};
