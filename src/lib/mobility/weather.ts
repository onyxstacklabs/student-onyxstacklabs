export interface CampusWeather {
  temperatureC: number;
  condition: string;
  windSpeedKmh: number;
  aqi: number | null;
  aqiLabel: string;
}

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

function describeAqi(aqi: number | null): string {
  if (aqi === null) return 'Unknown';
  if (aqi <= 50) return 'Good Quality';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (Sensitive)';
  if (aqi <= 200) return 'Unhealthy';
  return 'Very Unhealthy';
}

export async function getCurrentLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location services are not available on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => reject(new Error('Location access was denied.')),
      { timeout: 8000 }
    );
  });
}

export async function getCampusWeather(lat: number, lon: number): Promise<CampusWeather> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error('Could not fetch weather data.');
  }

  const weatherData = await weatherRes.json();
  const current = weatherData.current;

  let aqi: number | null = null;
  if (aqiRes && aqiRes.ok) {
    const aqiData = await aqiRes.json();
    aqi = aqiData.current?.us_aqi ?? null;
  }

  return {
    temperatureC: Math.round(current.temperature_2m),
    condition: WEATHER_CODE_MAP[current.weather_code] || 'Unknown',
    windSpeedKmh: Math.round(current.wind_speed_10m),
    aqi,
    aqiLabel: describeAqi(aqi),
  };
}
