# Kopano Media — OOH Site Locator (Portfolio Demo)

An installable, offline-capable PWA for locating out-of-home (billboard) advertising sites on a map, built from a real 27-site inventory deck.

> **This is a portfolio demo.** It is not an official Kopano Media product, and the contact details shown in the app are placeholders — not real business contacts.

## What it does

- Interactive dark map of Gauteng, South Africa with every billboard site plotted at its real GPS coordinates
- Hover a pin on desktop (or tap on mobile) to preview the actual site photo before clicking through
- Site list grouped by area, filterable by area, board size, illumination, and current availability
- Tapping a card flies the map to that site and opens its photo popup; tapping a pin scrolls the matching card into view
- Each site expands into a full spec sheet — description, LSM/SEM, material, traffic counts, GPS with a one-tap copy button
- "Contact for pricing" flow instead of hardcoded rates, since ad rates change often — opens a pre-filled enquiry (email pre-fills the site code/name so nothing needs retyping)
- Installable as a home-screen app (manifest + service worker), with the app shell cached for offline use

## Source data

The original PowerPoint deck listed 27 billboard sites with GPS coordinates, sizes, traffic data, and site photos. The build pipeline:

1. Parsed the deck's text content (`markitdown`) into a structured dataset
2. Extracted the actual site photograph from each slide with `python-pptx`, picking the largest embedded JPEG per slide (verified against the smaller template/background images and icons also present on each slide)
3. Resized/compressed photos into two sizes — small thumbnails for the map hover preview and card thumbnails, larger versions for the expanded detail view
4. Hand-verified coordinates, codes, and site descriptions against the source deck

## Tech

- Vanilla JS, no framework/build step — just open `index.html`
- [Leaflet](https://leafletjs.com/) + CARTO dark basemap tiles for the map (no API key required)
- Custom PWA install banner, `manifest.json`, and a cache-first service worker for the app shell
- Design: dark "asphalt" theme with an amber signal accent, condensed road-sign-style display type (Oswald) paired with Inter for body text and JetBrains Mono for data/GPS figures

## Running it locally

No build step — it's static files. Serve the folder with anything that can host static assets, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` also works for browsing, but the service worker and PWA install prompt need to be served over `http(s)://` (or `localhost`) to register.

## Deploying (e.g. GitHub Pages)

1. Push this repo to GitHub
2. Repo → Settings → Pages → Deploy from branch → select `main` (or your default branch) and `/ (root)`
3. Your live demo will be at `https://<username>.github.io/<repo-name>/`

## Project structure

```
├── index.html        # app shell
├── styles.css         # design tokens + styling
├── app.js             # map, filters, list rendering, contact modal, PWA install
├── data.js            # the 27-site dataset + placeholder contact info
├── manifest.json       # PWA manifest
├── sw.js               # service worker (app-shell caching)
├── icons/              # PWA icons
└── images/
    ├── thumb/           # small site photos (map hover preview, card thumbnails)
    └── full/             # larger site photos (expanded detail view)
```

## Notes for anyone adapting this

- Swap `CONTACT` in `data.js` for real details before using this for anything beyond a demo
- The dataset in `data.js` is a flat array — easy to point at a real backend/CMS instead of a static file
- Pricing was intentionally left out of the UI in favor of a "contact for pricing" flow, since ad rates change often; the data model has no price fields at all
