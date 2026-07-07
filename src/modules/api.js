import { processPlace, processCurrent } from './process.js';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

async function jsonGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function geocode(name) {
  const { results } = await jsonGet(`${GEOCODE_URL}?name=${encodeURIComponent(name)}&count=1`);
  return results?.[0];
}

export async function getWeather(location) {
  const place = await geocode(location);
  if (!place) return null;
  const url = `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`;
  const { current_weather } = await jsonGet(url);
  return { place: processPlace(place), current: processCurrent(current_weather) };
}
