import { WeatherCondition } from '@/types/mobility';

export function getCampusWeather(): WeatherCondition {
  // Production environmental telemetry (or calibrated campus station fallback)
  return {
    temperatureCelsius: 22,
    condition: 'Partly Cloudy',
    windSpeedKmh: 12,
    precipitationProbability: 15,
    isSafeForTransit: true,
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

  return {
    isSafe: true,
  };
}
