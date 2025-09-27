import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { t } from '@i18n/index';
import { TripApi } from '@api/trip';
import { showMessage } from '@utils/index';

export const useTrip = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [ongoingTrips, setOngoingTrips] = useState<any>({});

  const fetchTrips = useCallback(async (params: any) => {
    setLoading(true);
    try {
      const res = await TripApi.getTrips(params);
      if (res?.code === 200) {
        setTrips(res.data || []);
      } else {
        showMessage.fail(t('failed_to_fetch_trips'));
      }
    } catch (error) {
      showMessage.fail(t('error_occurred_fetching_trips'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOngoingTrips = useCallback(async (params: any) => {
    setLoading(true);
    try {
      const res: any = await TripApi.getOngoingTrips(params);
      if (res.code === 200) {
        setOngoingTrips(res.data || []);
      }
    } catch (error) {
      showMessage.fail(t('error_occurred_fetching_ongoing_trips'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOngoingTrips({});
    }, [fetchTrips, fetchOngoingTrips]),
  );

  return { trips, ongoingTrips, loading, fetchTrips, fetchOngoingTrips };
};
