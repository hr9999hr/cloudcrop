import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { fetchRealWeather, getUserLocation, WEATHER_CHECK_INTERVAL_MS } from '@/lib/weatherService';
import { toast } from 'sonner';

export function useRealWeather() {
  const setWeather = useGameStore((s) => s.setWeather);
  const weatherChangedAt = useGameStore((s) => s.weatherChangedAt);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const checkAndUpdateWeather = async () => {
      // Don't fetch if we checked recently
      const timeSinceLastChange = Date.now() - weatherChangedAt;
      if (timeSinceLastChange < WEATHER_CHECK_INTERVAL_MS) return;
      if (fetchingRef.current) return;

      fetchingRef.current = true;
      try {
        const { lat, lon } = await getUserLocation();
        const result = await fetchRealWeather(lat, lon);
        setWeather(result.weather);
        console.log(`🌤️ Real weather updated: ${result.weather} (${result.temperatureC}°C - ${result.description})`);
      } catch (err) {
        console.warn('Could not fetch real weather, using current weather:', err);
        // If geolocation denied, still update timestamp to avoid retrying constantly
        // Fall back to keeping current weather
      } finally {
        fetchingRef.current = false;
      }
    };

    // Check on mount
    checkAndUpdateWeather();

    // Check periodically
    const interval = setInterval(checkAndUpdateWeather, 5 * 60 * 1000); // Re-check every 5 min
    return () => clearInterval(interval);
  }, [setWeather, weatherChangedAt]);
}
