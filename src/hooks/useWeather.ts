import { useState, useEffect, useCallback } from 'react';
import { TripApi } from '@api/trip';

export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const data = await TripApi.getWeatherByCoords(lat, lon);
    return data;
  } catch (err: any) {
    console.error('Error fetching weather:', err);
    throw err;
  }
};

export const useWeather = (lat?: number, lon?: number) => {
  const [weather, setWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    if (lat == null || lon == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      setWeather(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return { weather, loading, error, loadWeather };
};
