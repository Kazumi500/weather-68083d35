import './style.css';
import { getWeather } from './modules/api.js';

const out = document.getElementById('weather');
const h = (tag) => document.createElement(tag);
const txt = (s) => document.createTextNode(s);

const msg = (text, muted = false) => {
  const p = h('p');
  p.className = `msg${muted ? ' muted' : ''}`;
  p.textContent = text;
  out.append(p);
};

const STROKE = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
const SUN_CORE = '<circle cx="32" cy="32" r="11"/>';
const SUN_RAYS = '<g><line x1="32" y1="6" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="58"/><line x1="6" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="58" y2="32"/><line x1="14" y1="14" x2="20" y2="20"/><line x1="44" y1="44" x2="50" y2="50"/><line x1="50" y1="14" x2="44" y2="20"/><line x1="14" y1="50" x2="20" y2="44"/></g>';
const CLOUD = '<path d="M18 44 Q9 44 9 34 Q9 26 17 25 Q19 16 29 16 Q40 16 42 25 Q53 25 53 35 Q53 44 45 44 Z"/>';
const CLOUD_OVER = '<path d="M16 46 Q7 46 7 35 Q7 26 16 24 Q18 14 30 14 Q42 14 44 24 Q56 24 56 36 Q56 46 47 46 Z"/>';
const BOLT_FILL = '<path d="M30 22 L24 38 L31 38 L27 50 L40 32 L33 32 L37 22 Z" fill="currentColor"/>';
const SNOWFLAKE = (x, y, r = 4) => `<g transform="translate(${x} ${y})"><line x1="0" y1="-${r}" x2="0" y2="${r}"/><line x1="-${r}" y1="0" x2="${r}" y2="0"/><line x1="-${(r * 0.7).toFixed(1)}" y1="-${(r * 0.7).toFixed(1)}" x2="${(r * 0.7).toFixed(1)}" y2="${(r * 0.7).toFixed(1)}"/><line x1="-${(r * 0.7).toFixed(1)}" y1="${(r * 0.7).toFixed(1)}" x2="${(r * 0.7).toFixed(1)}" y2="-${(r * 0.7).toFixed(1)}"/></g>`;

const GLYPHS = {
  0: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${SUN_CORE}${SUN_RAYS}</svg>`,
  1: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${SUN_CORE}${SUN_RAYS}<path d="M30 50 Q22 50 22 42 Q22 36 28 35 Q30 28 38 28 Q46 28 47 35 Q54 35 54 42 Q54 50 49 50 Z"/></svg>`,
  2: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${SUN_CORE}${SUN_RAYS}${CLOUD}</svg>`,
  3: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD_OVER}</svg>`,
  45: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true"><line x1="10" y1="22" x2="50" y2="22"/><line x1="14" y1="32" x2="54" y2="32"/><line x1="10" y1="42" x2="46" y2="42"/></svg>`,
  48: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true"><line x1="10" y1="22" x2="50" y2="22"/><line x1="14" y1="32" x2="54" y2="32"/><line x1="10" y1="42" x2="46" y2="42"/><circle cx="22" cy="50" r="1" fill="currentColor"/><circle cx="32" cy="52" r="1" fill="currentColor"/><circle cx="42" cy="50" r="1" fill="currentColor"/></svg>`,
  51: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<circle cx="32" cy="52" r="1.5" fill="currentColor"/></svg>`,
  53: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<circle cx="26" cy="52" r="1.5" fill="currentColor"/><circle cx="34" cy="54" r="1.5" fill="currentColor"/></svg>`,
  55: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<circle cx="22" cy="52" r="1.5" fill="currentColor"/><circle cx="32" cy="54" r="1.5" fill="currentColor"/><circle cx="42" cy="52" r="1.5" fill="currentColor"/></svg>`,
  61: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<line x1="24" y1="48" x2="24" y2="56"/><line x1="32" y1="48" x2="32" y2="56"/><line x1="40" y1="48" x2="40" y2="56"/></svg>`,
  63: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<line x1="20" y1="48" x2="20" y2="58"/><line x1="26" y1="48" x2="26" y2="58"/><line x1="32" y1="48" x2="32" y2="58"/><line x1="38" y1="48" x2="38" y2="58"/><line x1="44" y1="48" x2="44" y2="58"/></svg>`,
  65: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<line x1="16" y1="46" x2="16" y2="60"/><line x1="22" y1="46" x2="22" y2="60"/><line x1="28" y1="46" x2="28" y2="60"/><line x1="34" y1="46" x2="34" y2="60"/><line x1="40" y1="46" x2="40" y2="60"/><line x1="46" y1="46" x2="46" y2="60"/><line x1="20" y1="60" x2="58" y2="60"/></svg>`,
  71: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}${SNOWFLAKE(32, 53, 5)}</svg>`,
  73: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}${SNOWFLAKE(20, 51)}${SNOWFLAKE(32, 54, 5)}${SNOWFLAKE(44, 51)}</svg>`,
  75: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}${SNOWFLAKE(20, 50)}${SNOWFLAKE(32, 56, 5)}${SNOWFLAKE(44, 50)}${SNOWFLAKE(28, 60, 3)}${SNOWFLAKE(36, 60, 3)}</svg>`,
  80: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<line x1="22" y1="48" x2="18" y2="58"/><line x1="38" y1="48" x2="34" y2="58"/></svg>`,
  81: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<line x1="18" y1="48" x2="14" y2="58"/><line x1="26" y1="48" x2="22" y2="58"/><line x1="34" y1="48" x2="30" y2="58"/><line x1="42" y1="48" x2="38" y2="58"/></svg>`,
  82: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}<line x1="16" y1="48" x2="12" y2="60"/><line x1="22" y1="48" x2="18" y2="60"/><line x1="28" y1="48" x2="24" y2="60"/><line x1="34" y1="48" x2="30" y2="60"/><line x1="40" y1="48" x2="36" y2="60"/><line x1="46" y1="48" x2="42" y2="60"/></svg>`,
  95: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}${BOLT_FILL}</svg>`,
  96: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}${BOLT_FILL}<circle cx="44" cy="56" r="1.5" fill="currentColor"/></svg>`,
  99: `<svg viewBox="0 0 64 64" ${STROKE} aria-hidden="true">${CLOUD}${BOLT_FILL}<circle cx="20" cy="56" r="2" fill="currentColor"/><circle cx="32" cy="58" r="2" fill="currentColor"/><circle cx="44" cy="56" r="2" fill="currentColor"/></svg>`,
};

function glyphFor(code) {
  return GLYPHS[code] ?? GLYPHS[3];
}

function locationLabel(place) {
  const parts = [];
  if (place.name) parts.push(place.name);
  if (place.region && place.region !== place.name) parts.push(place.region);
  if (place.country) parts.push(place.country);
  return parts.join(', ');
}

function eyebrow(text, rest = '') {
  const el = h('div'); el.className = 'eyebrow';
  const main = h('span'); main.textContent = text; el.append(main);
  if (rest) {
    const sep = h('span'); sep.className = 'sep'; el.append(sep);
    const r = h('span'); r.className = 'rest'; r.textContent = rest; el.append(r);
  }
  return el;
}

function metCell(label, value) {
  const cell = h('div'); cell.className = 'met';
  const l = h('span'); l.className = 'met-label'; l.textContent = label; cell.append(l);
  const v = h('span'); v.className = 'met-value'; v.textContent = value; cell.append(v);
  return cell;
}

function render(weather, location) {
  out.replaceChildren();
  if (weather === null) return msg(`No observation for "${location}".`);
  if (weather instanceof Error) return msg(`Couldn't reach the sky — ${weather.message}`);
  const grid = h('div'); grid.className = 'met-grid';
  out.append(
    eyebrow(weather.current.observedAt.replace('T', ' · '), location),
    h('h1', locationLabel(weather.place) || '—'),
  );
  const hero = h('div'); hero.className = 'hero';
  const temp = h('div'); temp.className = 'hero-temp';
  const unit = h('span'); unit.className = 'unit'; unit.textContent = '°C';
  temp.append(txt(String(Math.round(weather.current.temperature))), unit);
  const glyph = h('span'); glyph.className = 'hero-glyph'; glyph.innerHTML = glyphFor(weather.current.code);
  hero.append(temp, glyph);
  out.append(hero);
  const cond = h('p'); cond.className = 'conditions'; cond.textContent = weather.current.conditions; out.append(cond);
  grid.append(
    metCell('Wind',     `${weather.current.windspeed} km/h · ${weather.current.winddirection}°`),
    metCell('Coords',   `${weather.place.lat.toFixed(2)}° ${weather.place.lon.toFixed(2)}°`),
    metCell('Source',   'open-meteo'),
    metCell('Local',    weather.current.observedAt.split('T')[1] ?? ''),
  );
  out.append(grid);
}

document.getElementById('weather-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = e.target.location.value.trim();
  if (!location) return;
  msg(`Reading the sky for "${location}"…`, true);
  try {
    const weather = await getWeather(location);
    console.log(`Weather for "${location}":`, weather);
    render(weather, location);
  } catch (err) {
    console.error(err.message);
    render(err, location);
  }
});
