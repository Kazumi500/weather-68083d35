import './style.css';
import { getWeather } from './modules/api.js';

const out = document.getElementById('weather');
const h = (tag) => document.createElement(tag);
const txt = (s) => document.createTextNode(s);

// Header masthead — populate today's date.
(() => {
  const el = document.getElementById('today');
  if (!el) return;
  const d = new Date();
  const day = d.getDate();
  const month = d.toLocaleString('en', { month: 'short' }).toLowerCase();
  const year = d.getFullYear();
  el.textContent = `${day} ${month} ${year}`;
})();

const msg = (text, muted = false) => {
  const p = h('p');
  p.className = `msg${muted ? ' muted' : ''}`;
  p.textContent = text;
  out.append(p);
  return p;
};

const loading = (text) => {
  const p = msg(text, true);
  p.classList.add('loading');
  p.setAttribute('aria-busy', 'true');
  const sp = h('span');
  sp.className = 'spinner';
  sp.setAttribute('aria-hidden', 'true');
  p.append(' ', sp);
};

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
    eyebrow('Observed', weather.current.observedAt.replace('T', ' · ')),
    h('h1', locationLabel(weather.place) || '—'),
  );
  const hero = h('div'); hero.className = 'hero';
  const temp = h('div'); temp.className = 'hero-temp';
  const unit = h('span'); unit.className = 'unit'; unit.textContent = '°C';
  temp.append(txt(String(Math.round(weather.current.temperature))), unit);
  const glyph = h('img');
  glyph.className = 'hero-glyph';
  glyph.src = weather.current.iconUrl;
  glyph.alt = '';
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
  loading(`Reading the sky for "${location}"…`);
  try {
    const weather = await getWeather(location);
    console.log(`Weather for "${location}":`, weather);
    render(weather, location);
  } catch (err) {
    console.error(err.message);
    render(err, location);
  }
});
