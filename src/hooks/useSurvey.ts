import { useState, useCallback, useEffect } from 'react';

import { SurveyApi } from '@api/survey';

export const useSurvey = () => {
  const [surveyList, setSurveyList] = useState({});

  const fetchSurveys = useCallback(async () => {
    try {
      const res = await SurveyApi.getRating();
      if (res?.data) {
        setSurveyList(res.data);
      } else {
        setSurveyList({});
      }
    } catch (error: any) {
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const refetch = useCallback(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  return {
    surveyList,
    refetch,
  };
};
