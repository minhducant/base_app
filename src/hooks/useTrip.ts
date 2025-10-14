import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { setIsLoading } from '@stores/action';

import { t } from '@i18n/index';
import { TripApi } from '@api/trip';
import { showMessage } from '@utils/index';

export const useTrip = () => {
  const dispatch = useDispatch();
  const { isLoading: loading } = useSelector(
    (state: any) => state.user.isLoading,
  );
  const [page, setPage] = useState(1);
  const [trips, setTrips] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [ongoingTrips, setOngoingTrips] = useState<any>({});

  const fetchTrips = useCallback(
    async (params: any = {}) => {
      const { loadMore = false, limit = 10 } = params;
      const nextPage = loadMore ? page + 1 : 1;
      if (loading || (!hasMore && loadMore)) return;
      dispatch(setIsLoading(true));
      try {
        const res: any = await TripApi.getTrips({ page: nextPage, limit });
        if (res?.code === 200) {
          const newData = res?.data?.result || [];
          if (loadMore) {
            setTrips(trips.concat(newData));
          } else {
            setTrips(newData);
          }
          setPage(nextPage);
          setHasMore(res?.data.lastPage > nextPage);
        } else {
          showMessage.fail(t('failed_to_fetch_trips'));
        }
      } catch (error) {
        showMessage.fail(t('error_occurred_fetching_trips'));
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, loading, page, hasMore],
  );

  const fetchOngoingTrips = useCallback(async (params: any) => {
    try {
      const res: any = await TripApi.getOngoingTrips(params);
      if (res.code === 200) {
        setOngoingTrips(res.data || []);
      }
    } catch (error) {
      showMessage.fail(t('error_occurred_fetching_ongoing_trips'));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOngoingTrips({});
    }, [fetchTrips, fetchOngoingTrips]),
  );

  return {
    trips,
    page,
    setPage,
    hasMore,
    setHasMore,
    ongoingTrips,
    loading,
    fetchTrips,
    fetchOngoingTrips,
  };
};
