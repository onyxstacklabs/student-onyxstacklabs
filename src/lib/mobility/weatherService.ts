import { WeatherCondition } from '@/types/mobility';

const WEATHER_CODE_MAP: Record<number, string> = {
  0: 'Clear Sky',
  1: 'Mostly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  80: 'Rain Showers',
  81: 'Rain Showers',
  82: 'Violent Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Hail',
  99: 'Thunderstorm with Hail',
};

export async function getCampusWeather(lat: number, lon: number): Promise<WeatherCondition> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&hourly=precipitation_probability&forecast_days=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Could not fetch live weather data.');
  }

  const data = await response.json();
  const current = data.current;
  const currentHourIndex = new Date().getHours();
  const precipitationProbability =
    data.hourly?.precipitation_probability?.[currentHourIndex] ?? 0;

  return {
    temperatureCelsius: Math.round(current.temperature_2m),
    condition: WEATHER_CODE_MAP[current.weather_code] || 'Unknown',
    windSpeedKmh: Math.round(current.wind_speed_10m),
    precipitationProbability,
    isSafeForTransit: precipitationProbability <= 70 && current.wind_speed_10m <= 45,
  };
}

export function evaluateTransitSafety(weather: WeatherCondition): {
  isSafe: boolean;
  warningMessage?: string;
} {
  if (weather.precipitationProbability > 70) {
    return {
      isSafe: false,
      warningMessage: 'High chance of heavy rainfall. Use covered shuttle routes or take caution on EV scooters.',
    };
  }

  if (weather.windSpeedKmh > 45) {
    return {
      isSafe: false,
      warningMessage: 'Strong wind advisory on campus. Open-air cycling and light EV vehicles advised against.',
    };
  }

  return { isSafe: true };
}
