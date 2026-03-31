import type { WeatherType } from "@/store/gameStore";

// Open-Meteo WMO weather codes → game weather mapping
// https://open-meteo.com/en/docs
function mapWeatherCode(code: number): WeatherType {
  // Thunderstorm / heavy rain → monsoon
  if (code >= 95) return 'monsoon';
  // Rain / drizzle / freezing rain
  if (code >= 51 && code <= 82) return 'rainy';
  // Fog, depositing rime fog
  if (code >= 45 && code <= 48) return 'rainy';
  // Snow / sleet (treat as monsoon for game purposes)
  if (code >= 71 && code <= 86) return 'monsoon';
  // Clear sky or mainly clear with high temp → check temperature
  // Overcast / partly cloudy → sunny (default)
  return 'sunny';
}

function mapWithTemperature(code: number, temperatureC: number): WeatherType {
  const baseWeather = mapWeatherCode(code);
  
  // If it's clear/partly cloudy and very hot (>35°C), it's a heatwave
  if (baseWeather === 'sunny' && temperatureC >= 35) return 'heatwave';
  // Hot but not extreme (>32°C) has a chance of heatwave
  if (baseWeather === 'sunny' && temperatureC >= 32) return 'heatwave';
  
  return baseWeather;
}

interface WeatherResult {
  weather: WeatherType;
  temperatureC: number;
  description: string;
}

// Check interval: 6-8 hours (2-3 changes per day)
export const WEATHER_CHECK_INTERVAL_MS = 8 * 60 * 60 * 1000; // 8 hours

export async function fetchRealWeather(lat: number, lon: number): Promise<WeatherResult> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  const data = await response.json();
  const weatherCode = data.current.weather_code as number;
  const temperature = data.current.temperature_2m as number;
  
  const gameWeather = mapWithTemperature(weatherCode, temperature);
  
  return {
    weather: gameWeather,
    temperatureC: temperature,
    description: getWeatherDescription(weatherCode),
  };
}

export function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10000, maximumAge: 60 * 60 * 1000 } // Cache for 1 hour
    );
  });
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown';
}
