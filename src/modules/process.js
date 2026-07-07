
// Icons sourced from Makin-Things/weather-icons under MIT License.
// Copyright (c) 2019 Custom cards for Home Assistant.
// Full MIT text: src/assets/weather/LICENSE.txt
import clearDay from '../assets/weather/clear-day.svg';
import cloudy1Day from '../assets/weather/cloudy-1-day.svg';
import cloudy from '../assets/weather/cloudy.svg';
import fog from '../assets/weather/fog.svg';
import rainy1 from '../assets/weather/rainy-1.svg';
import rainy2 from '../assets/weather/rainy-2.svg';
import rainy3 from '../assets/weather/rainy-3.svg';
import snowy2 from '../assets/weather/snowy-2.svg';
import thunderstorms from '../assets/weather/thunderstorms.svg';
import severeThunderstorm from '../assets/weather/severe-thunderstorm.svg';

const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
  80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ slight hail', 99: 'Thunderstorm w/ heavy hail',
};

// WMO weathercode → bundled SVG (day variants only; open-meteo current_weather has no is_day).
const WMO_TO_ICON = {
  0: clearDay,
  1: cloudy1Day, 2: cloudy1Day,
  3: cloudy,
  45: fog, 48: fog,
  51: rainy1, 53: rainy1, 55: rainy1,
  61: rainy2, 63: rainy2, 65: rainy2,
  71: snowy2, 73: snowy2, 75: snowy2,
  80: rainy3, 81: rainy3, 82: rainy3,
  95: thunderstorms, 96: thunderstorms,
  99: severeThunderstorm,
};

export function processPlace({ name, admin1, country, latitude, longitude }) {
  return {
    name,
    region: admin1 ?? null,
    country: country ?? null,
    lat: latitude,
    lon: longitude,
  };
}

export function processCurrent({ temperature, windspeed, winddirection, weathercode, time }) {
  return {
    temperature,
    windspeed,
    winddirection,
    conditions: WEATHER_CODES[weathercode] ?? 'Unknown',
    code: weathercode,
    iconUrl: WMO_TO_ICON[weathercode] ?? cloudy,
    observedAt: time,
  };
}
