import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getUserInfo, setIsLoading } from '@stores/user/store';

export const useAsyncApp = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setIsLoading(true));
      try {
        const actions = [getUserInfo()];
        await Promise.all(actions.map(dispatch));
      } catch (error) {
        if (__DEV__) {
          console.error('AsyncApp Error:', error);
        }
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    fetchData();
  }, [dispatch]);
  return null;
};
