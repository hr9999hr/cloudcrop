import { useEffect, useRef } from 'react';
import { useGameStore, WeatherType } from '@/store/gameStore';

// Random weather change every 8-12 hours
const MIN_INTERVAL_MS = 8 * 60 * 60 * 1000;
const MAX_INTERVAL_MS = 12 * 60 * 60 * 1000;

const WEATHER_TYPES: WeatherType[] = ['sunny', 'rainy', 'heatwave', 'monsoon'];
const WEATHER_WEIGHTS = [0.45, 0.30, 0.15, 0.10]; // sunny most common, monsoon rare

function pickRandomWeather(current: WeatherType): WeatherType {
  // Weighted random, avoid repeating current weather
  const filtered = WEATHER_TYPES.filter(w => w !== current);
  const weights = filtered.map(w => WEATHER_WEIGHTS[WEATHER_TYPES.indexOf(w)]);
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < filtered.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return filtered[i];
  }
  return filtered[filtered.length - 1];
}

function getRandomInterval(): number {
  return MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
}

export function useRealWeather() {
  const setWeather = useGameStore((s) => s.setWeather);
  const weather = useGameStore((s) => s.weather);
  const weatherChangedAt = useGameStore((s) => s.weatherChangedAt);
  const scheduledRef = useRef(false);

  useEffect(() => {
    const checkAndUpdate = () => {
      const elapsed = Date.now() - weatherChangedAt;
      if (elapsed >= MIN_INTERVAL_MS) {
        const newWeather = pickRandomWeather(weather);
        setWeather(newWeather);
        console.log(`🌤️ Weather changed: ${weather} → ${newWeather}`);
      }
    };

    // Check on mount
    checkAndUpdate();

    // Check periodically (every 5 min)
    const interval = setInterval(checkAndUpdate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [setWeather, weather, weatherChangedAt]);
}
