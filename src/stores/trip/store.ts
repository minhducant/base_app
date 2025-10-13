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

interface CurrentTripState {
  distance?: number;
  duration?: string;
  co2?: number;
}

// Update interface state ban đầu
interface TripState {
  trip: TripItem[];
  currentTrip: CurrentTripState;
}

const initialState: TripState = {
  trip: [],
  currentTrip: {
    distance: 0,
    duration: '0 phút',
    co2: 0,
  },
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
    setCurrentTripData(state, action: PayloadAction<CurrentTripState>) {
      state.currentTrip = {
        ...state.currentTrip,
        ...action.payload,
      };
    },
    resetCurrentTrip(state) {
      state.currentTrip = initialState.currentTrip;
    },
  },
});

export const { setTrip, endOngoingTrips, addTrip, setCurrentTripData, resetCurrentTrip } = store.actions;

export const stores = {
  reducer: store.reducer,
  ...store.actions,
};
