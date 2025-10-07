import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { t } from '@i18n/index';
import { TripApi } from '@api/trip';
import { showMessage } from '@utils/index';
import { setIsLoading } from '@stores/action';

export const useGoal = (month?: Date) => {
  const dispatch = useDispatch();
  const [goalList, setGoalList] = useState<any>({});
  const currentMonth = month || new Date();
  const formattedMonth = `${String(currentMonth.getMonth() + 1).padStart(
    2,
    '0',
  )}/${currentMonth.getFullYear()}`;

  const fetchGoals = useCallback(async () => {
    try {
      // dispatch(setIsLoading(true));
      const res = await TripApi.getGoal({ month: formattedMonth });
      if (res?.data) {
        setGoalList(res.data);
      } else {
        setGoalList({});
      }
    } catch (error) {
      showMessage.fail('Không thể tải danh sách mục tiêu');
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, month]);

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [fetchGoals]),
  );

  const onRefresh = useCallback(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goalList,
    onRefresh,
    reload: fetchGoals,
  };
};
