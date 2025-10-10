import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { t } from '@i18n/index';
import { TripApi } from '@api/trip';
import { showMessage } from '@utils/index';
import { setIsLoading } from '@stores/action';

interface UseReportProps {
  startDate?: string | null;
  endDate?: string | null;
}

export const useReport = ({ startDate, endDate }: UseReportProps = {}) => {
  const dispatch = useDispatch();
  const [reportData, setReportData] = useState<any>();

  const { defaultStart, defaultEnd } = useMemo(() => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const format = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate(),
      ).padStart(2, '0')}`;

    return {
      defaultStart: format(first),
      defaultEnd: format(last),
    };
  }, []);

  const getReport = useCallback(
    async (sDate?: string, eDate?: string) => {
      try {
        if (!sDate || !eDate) {
          setReportData({});
          return;
        }
        dispatch(setIsLoading(true));
        const params = {
          start_date: sDate || defaultStart,
          end_date: eDate || defaultEnd,
        };
        const res: any = await TripApi.getReport(params);
        if (res?.code === 200) {
          setReportData(res.data);
        } else {
          showMessage.fail(t('no_data_found'));
        }
      } catch (err: any) {
        showMessage.fail(t('error_occurred'));
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, defaultStart, defaultEnd],
  );

  useFocusEffect(
    useCallback(() => {
      getReport(startDate || defaultStart, endDate || defaultEnd);
    }, [getReport, startDate, endDate, defaultStart, defaultEnd]),
  );

  return {
    reportData,
    refetch: getReport,
  };
};
