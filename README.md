<div align="center">

# Weather

A minimal weather reader built on the free [open-meteo](https://open-meteo.com/) API. Type a city, get the temperature, wind, and a hand-drawn glyph for the current sky.

![JavaScript](https://img.shields.io/badge/JavaScript-ESM-f7df1e?style=flat-square&logo=javascript&logoColor=black)
![Webpack](https://img.shields.io/badge/Bundler-Webpack%205-1c78c0?style=flat-square&logo=webpack&logoColor=white)
![No framework](https://img.shields.io/badge/Framework-vanilla-2c3e50?style=flat-square)
![No API key](https://img.shields.io/badge/Auth-none-2ea44f?style=flat-square)

[Quickstart](#quickstart) · [How it works](#how-it-works) · [Project layout](#project-layout) · [Customize](#customize) · [Troubleshooting](#troubleshooting)

</div>

> [!NOTE]
> Both open-meteo endpoints (geocoding + forecast) are key-less and free for non-commercial use. No signup, no proxy, no server.

## Features

- **Minimal build** — `npm run build` once, serve `dist/` from anywhere.
- **Inline SVG glyphs** — one per WMO weather code (clear, drizzle, thunderstorm w/ hail, …), no icon assets to manage.
- **Two-step pipeline** — geocode the city, then fetch `current_weather`. Conversion-to-display data lives in `process.js` so the renderer stays dumb.
- **Editorial type system** — Fraunces (display) over JetBrains Mono (data), high-tabular numerals, ink/paper palette with a single amber accent.
- **Accessibility basics** — `aria-live` result region, `prefers-reduced-motion` honored, visible focus rings.

## Quickstart

```bash
npm install
npm run build       # production build → dist/
# or
npm run dev         # development build (also emits to dist/)
```

Then open `dist/index.html` in a browser, or serve it:

```bash
npx serve dist
```

> [!TIP]
> `open-meteo` is a free public API — no `.env`, no token. If you self-host, you may want to add a build-time bundler alias for the API base URL.

## How it works

```
index.html  ──►  src/main.js  ──►  src/modules/api.js  ──►  open-meteo (geocode → forecast)
                    │                       │
                    │                       └─►  src/modules/process.js  (raw API → display shape)
                    ├──►  src/style.css                              (frame + type)
                    └──►  inline SVG glyph map (inside main.js)        (weather icons)
```

1. User types a place and submits.
2. `api.js` geocodes it (`/v1/search?name=…`) and, given the first result's lat/lon, asks for `current_weather=true`.
3. `process.js` turns the raw `place` and `current_weather` objects into the display shape (`name`, `region`, `temperature`, `windspeed`, … including a numeric `code` used by the glyph selector).
4. `main.js` renders the SVG glyph, the big temperature, and a 4-cell metric grid.

`processCurrent` also returns `conditions` (a human string from the WMO `weathercode` → label map) so `current.code` and `current.conditions` stay independent.

## Project layout

```
.
├── index.html              # single <form> + #weather target
├── webpack.config.cjs      # entry: src/main.js, html-webpack-plugin
├── package.json            # build + dev scripts
└── src/
    ├── main.js             # form handler + render()
    ├── style.css           # design tokens + layout
    └── modules/
        ├── api.js          # getWeather(location) — geocode then forecast
        └── process.js      # raw → display shapes + WEATHER_CODES map
```

> [!IMPORTANT]
> `dist/` is gitignored and produced by webpack. `node_modules/` is gitignored. Don't commit either.

## Customize

Two dicts in `src/modules/process.js` and `src/main.js` are the natural extension points — keep them in lockstep when adding coverage:

| Location | Purpose | Example key |
|---|---|---|
| `WEATHER_CODES` in `process.js` | numeric weather code → human label | `71: 'Slight snow'` |
| `GLYPHS` in `main.js` | numeric weather code → SVG markup | `71: \`<svg …>${CLOUD}${SNOWFLAKE(32, 53, 5)}</svg>\`` |

Add a row to **both** for any new WMO code you want to render. If a code has no glyph, the user sees the overcast fallback (`GLYPHS[3]`).

> [!TIP]
> SVG fragments in `main.js` (e.g. `SUN_CORE`, `CLOUD`, `BOLT_FILL`) are reusable building blocks. Reuse them when adding new glyphs instead of hand-rolling paths.

## Troubleshooting

**"No observation for \<city\>."** — `geocode` returned no results. Open-meteo's geocoder is permissive but the city name has to be close: try `Paris` → `Berlin` → `São Paulo` (URL-encoded by `api.js`).

**All icons look the same.** — That means a code came back without a key in `GLYPHS`; the overcast fallback always renders. Add the missing code.

**CORS error in the browser console.** — open-meteo sends `Access-Control-Allow-Origin: *`. If you proxy the app, the proxy must forward that header.

**"Couldn't reach the sky — …".** — Network error or non-2xx. Check the message after the em-dash: it's the upstream status code + URL.

## Resources

- [open-meteo geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [open-meteo forecast API](https://open-meteo.com/en/docs)
- [WMO weather codes](https://open-meteo.com/en/docs#weathervariables)
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
