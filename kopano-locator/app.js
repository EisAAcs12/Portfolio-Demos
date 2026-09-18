// Kopano Media & The Medium — OOH Site Locator
// Vanilla JS + MapLibre GL JS (OpenFreeMap tiles). Data comes from data.js (BRANDS).
// Which brand is "active" is held in these module-level `let` bindings —
// every function below reads SITES/AREAS/CONTACT/CONFIG/LANDMARKS via
// closure, so switching brands is just reassigning these and re-running
// the render pipeline (see activateBrandData / switchBrand).

let currentBrandId, SITES, AREAS, CONTACT, CONFIG, LANDMARKS;
let liveSyncTimer = null;
let searchDebounceTimer = null;

const state = {
  search: "",
  area: "all",
  size: "all",
  illuminated: "all",
  availableNow: false,
  selectedCode: null,
  collapsedAreas: new Set(),
  curateMode: false,
  picked: new Set(),      // codes checked while building a client link
  clientView: null,       // Set of codes when viewing a shared link, else null
};

const TODAY = new Date(); // real "today" for availability comparisons

// ---------- helpers ----------

function fmtMoney(n) {
  return "R" + Math.round(n).toLocaleString("en-ZA");
}

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function isAvailableNow(site) {
  return resolveStatus(site) === "available";
}

// Resolves the effective status for a site: "available" | "optioned" | "booked"
// Sheet-driven status wins when present; otherwise falls back to the static
// availability date (past/today = available, future = booked).
function resolveStatus(site) {
  if (site.liveStatus === "available" || site.liveStatus === "optioned" || site.liveStatus === "booked") {
    return site.liveStatus;
  }
  return new Date(site.availability + "T00:00:00") <= TODAY ? "available" : "booked";
}

// The date to show alongside a non-available status: prefer the sheet's
// NextAvailableDate, fall back to AvailableFrom.
function resolveStatusDate(site) {
  return site.liveNextAvailable || site.availability || "";
}

const STATUS_META = {
  available: { label: "Available now", cls: "available" },
  optioned:  { label: "Optioned",       cls: "optioned" },
  booked:    { label: "Booked",         cls: "booked" },
};

function trafficLightHTML(status) {
  return `
    <span class="signal" title="${STATUS_META[status].label}">
      <span class="signal-light red${status === "booked" ? " on" : ""}"></span>
      <span class="signal-light amber${status === "optioned" ? " on" : ""}"></span>
      <span class="signal-light green${status === "available" ? " on" : ""}"></span>
    </span>`;
}

function availabilityBadge(site) {
  const status = resolveStatus(site);
  const meta = STATUS_META[status];

  if (status === "available") {
    return `<span class="avail-badge available">● ${meta.label}</span>`;
  }

  // Booked/Optioned dates are intentionally not shown publicly — dates live
  // in the Google Sheet for staff reference only.
  const client = site.liveClient ? ` — ${site.liveClient}` : "";
  return `<span class="avail-badge ${meta.cls}">● ${meta.label}${client}</span>`;
}

function uniqueSizes() {
  return [...new Set(SITES.map(s => s.size))].sort();
}

function siteKey(site) {
  // group markers that share (near-identical) coordinates
  return site.lat.toFixed(3) + "," + site.lng.toFixed(3);
}

function matchesFilters(site) {
  if (state.clientView && !state.clientView.has(site.code)) return false;
  const q = state.search.trim().toLowerCase();
  if (q) {
    const hay = (site.code + " " + site.title + " " + site.area + " " + site.description).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (state.area !== "all" && site.area !== state.area) return false;
  if (state.size !== "all" && site.size !== state.size) return false;
  if (state.illuminated === "yes" && !site.illuminated) return false;
  if (state.illuminated === "no" && site.illuminated) return false;
  if (state.availableNow && !isAvailableNow(site)) return false;
  return true;
}

function filteredSites() {
  return SITES.filter(matchesFilters);
}

// ---------- map ----------

let map;
const markersByCode = new Map(); // site code -> maplibregl.Marker
let landmarkMarkers = []; // { marker, el } for every currently-built landmark

// Landmarks only appear once zoomed in this far — keeps the wide view clean
// and focused on the billboards themselves.
const LANDMARK_MIN_ZOOM = 14;

const LANDMARK_META = {
  mall:          { emoji: "🛍️", label: "Shopping" },
  dining:        { emoji: "🍴", label: "Dining" },
  entertainment: { emoji: "🎬", label: "Entertainment" },
  transport:     { emoji: "🚉", label: "Transport" },
  education:     { emoji: "🎓", label: "Education" },
  office:        { emoji: "🏢", label: "Office" },
  fuel:          { emoji: "⛽", label: "Fuel" },
  health:        { emoji: "🏥", label: "Health" },
  landmark:      { emoji: "📍", label: "Landmark" },
};

function landmarkElement(lm) {
  const meta = LANDMARK_META[lm.category] || LANDMARK_META.landmark;
  const tierClass = lm.tier === "close" ? "tier-close" : "tier-area";
  const el = document.createElement("div");
  el.className = `landmark-pin ${tierClass}`;
  el.innerHTML = `<span>${meta.emoji}</span>`;
  return el;
}

function rebuildLandmarks() {
  landmarkMarkers.forEach(({ marker }) => marker.remove());
  landmarkMarkers = [];

  const visibleCodes = new Set(filteredSites().map(s => s.code));
  const showNow = map.getZoom() >= LANDMARK_MIN_ZOOM;

  LANDMARKS.forEach(lm => {
    if (!lm.sites.some(code => visibleCodes.has(code))) return;
    const meta = LANDMARK_META[lm.category] || LANDMARK_META.landmark;
    const tierLabel = lm.tier === "close" ? "Right by the board" : "Nearby area";
    const el = landmarkElement(lm);
    const popup = new maplibregl.Popup({ offset: 14, maxWidth: "190px" }).setHTML(
      `<div class="landmark-popup landmark-popup-${lm.tier}"><strong>${meta.emoji} ${lm.name}</strong><span>${meta.label} · ${tierLabel}</span></div>`
    );
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([lm.lng, lm.lat])
      .setPopup(popup)
      .addTo(map);
    el.style.display = showNow ? "" : "none";
    landmarkMarkers.push({ marker, el });
  });
}

function updateLandmarkVisibility() {
  const shouldShow = map.getZoom() >= LANDMARK_MIN_ZOOM;
  landmarkMarkers.forEach(({ el }) => {
    el.style.display = shouldShow ? "" : "none";
  });
}

// Applies a dark recolor to OpenFreeMap's Liberty style at runtime, rather
// than depending on a third party's separately-hosted "dark" style file —
// this way we own the whole look and it can't break if someone else's
// project moves or changes. Liberty is the actively-maintained OpenFreeMap
// style with real building-height data, which is why it's the base here
// instead of the (explicitly unfinished) official Dark style.
// Recolors OpenFreeMap's Liberty style dark — mutating the style JSON
// itself (via transformStyle, below) rather than repainting an
// already-rendered map after the fact. Doing it after load causes a real,
// visible flash of the original light theme before the dark colors kick
// in; doing it here means the very first pixels painted are already dark.
function darkenStyle(style) {
  if (!style || !style.layers) return style;
  const layers = style.layers.map(layer => {
    const paint = { ...(layer.paint || {}) };
    try {
      if (layer.type === "background") {
        paint["background-color"] = "#181d24";
      } else if (layer.type === "fill") {
        const src = (layer["source-layer"] || "").toLowerCase();
        if (src.includes("water")) paint["fill-color"] = "#12232b";
        else if (src.includes("landuse") || src.includes("landcover") || src.includes("park")) {
          paint["fill-color"] = "#1c2129";
        } else if (src.includes("building")) {
          paint["fill-color"] = "#262d37";
        }
      } else if (layer.type === "line") {
        const src = (layer["source-layer"] || "").toLowerCase();
        if (src.includes("road") || src.includes("transportation")) {
          paint["line-color"] = "#3d4753";
        } else if (src.includes("water") || src.includes("waterway")) {
          paint["line-color"] = "#12232b";
        } else if (src.includes("boundary")) {
          paint["line-color"] = "#414b58";
        }
      } else if (layer.type === "symbol" && layer.layout && layer.layout["text-field"]) {
        paint["text-color"] = "#aab0b6";
        paint["text-halo-color"] = "#12151a";
        paint["text-halo-width"] = 1.2;
      }
    } catch (err) {
      // some layers don't support every paint property — safe to skip
    }
    return { ...layer, paint };
  });
  return { ...style, layers };
}

// Adding the 3D buildings layer is a nice-to-have on top of the core map —
// wrapped defensively so that if OpenFreeMap's building source ever has an
// issue, it can't take the rest of map setup (pins!) down with it.
function add3dBuildingsLayer() {
  try {
    const style = map.getStyle();
    const labelLayer = style.layers.find(l => l.type === "symbol" && l.layout && l.layout["text-field"]);
    if (map.getLayer("boardbase-3d-buildings")) return;
    // Add our own explicit vector source for the buildings layer, rather than
    // assuming what Liberty's own internal source is named internally — this
    // matches MapLibre's own official "Display buildings in 3D" example.
    if (!map.getSource("boardbase-buildings")) {
      map.addSource("boardbase-buildings", {
        type: "vector",
        url: "https://tiles.openfreemap.org/planet",
      });
    }
    map.addLayer(
      {
        id: "boardbase-3d-buildings",
        source: "boardbase-buildings",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 14,
        filter: ["!=", ["get", "hide_3d"], true],
        paint: {
          "fill-extrusion-color": [
            "interpolate", ["linear"], ["coalesce", ["get", "render_height"], 5],
            0, "#2c3842",
            50, "#3d4753",
            150, "#4d5866",
          ],
          "fill-extrusion-height": [
            "interpolate", ["linear"], ["zoom"],
            14, 0,
            16, ["coalesce", ["get", "render_height"], 5],
          ],
          "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
          "fill-extrusion-opacity": 0.85,
        },
      },
      labelLayer ? labelLayer.id : undefined
    );
  } catch (err) {
    // 3D buildings are a bonus visual, not core functionality — if this
    // ever fails, the map/pins/everything else still needs to work fine.
  }
}

function initMap() {
  map = new maplibregl.Map({
    container: "map",
    center: [27.99, -26.13],
    zoom: 10,
    pitch: 0,
    bearing: 0,
    attributionControl: { compact: true },
  });

  // setStyle (rather than passing style: in the constructor above) so we
  // can pass transformStyle, which recolors the style before it's ever
  // committed/rendered — this is what actually kills the light-then-dark
  // flash, rather than repainting after the fact.
  map.setStyle("https://tiles.openfreemap.org/styles/liberty", {
    transformStyle: (previous, next) => darkenStyle(next),
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "bottom-right");

  map.on("load", () => {
    // Core functionality first, guaranteed to run regardless of what
    // happens below — the map and its pins are the whole point of the
    // page, everything after this is a bonus that must not be able to
    // block it if something about it goes wrong.
    fitMapToBrand();
    rebuildMarkers();
    updateLandmarkVisibility();
    add3dBuildingsLayer();
  });

  map.on("zoomend", updateLandmarkVisibility);

  // Prevent trackpad-pinch and mobile-pinch gestures over the map from
  // zooming the whole browser page instead of just the map.
  const mapEl = document.getElementById("map");
  mapEl.addEventListener("wheel", (e) => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });

  // Tapping/clicking empty map area (not a marker) dismisses the preview
  map.on("click", () => {
    hideMapPreview();
  });
}

// Fits the map to whichever brand is active — Kopano's sites are all
// within Gauteng, but The Medium's stretch as far as Mokopane in Limpopo,
// so a fixed center/zoom wouldn't work well for both.
function fitMapToBrand() {
  if (!map || !SITES || SITES.length === 0) return;
  const lngs = SITES.map(s => s.lng);
  const lats = SITES.map(s => s.lat);
  const bounds = [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
  map.fitBounds(bounds, { padding: 40, maxZoom: 12, duration: 0 });
}

function pinElement(selected) {
  const el = document.createElement("div");
  el.className = `kop-pin${selected ? " selected" : ""}`;
  el.innerHTML = `<div class="kop-pin-board"></div><div class="kop-pin-post"></div>`;
  return el;
}

function rebuildMarkers() {
  if (!map || !map.isStyleLoaded()) return;
  markersByCode.forEach(marker => marker.remove());
  markersByCode.clear();

  const visible = filteredSites();

  // Group only to detect sites that share (near-identical) coordinates, so
  // each one can be nudged into its own spot — every site always gets its
  // own marker, never merged, so hover/click always shows the exact site.
  const groups = new Map();
  visible.forEach(site => {
    const key = siteKey(site);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(site);
  });

  groups.forEach((sites) => {
    const n = sites.length;
    sites.forEach((site, i) => {
      let lat = site.lat, lng = site.lng;
      if (n > 1) {
        // spread sites sharing a spot evenly around it in a small ring so
        // every pin is individually visible and clickable
        const angle = (2 * Math.PI * i) / n;
        const radiusDeg = 0.00018 + (n > 4 ? 0.00006 : 0);
        const latRad = (site.lat * Math.PI) / 180;
        lat += radiusDeg * Math.sin(angle);
        lng += (radiusDeg / Math.cos(latRad)) * Math.cos(angle);
      }

      const selected = state.selectedCode === site.code;
      const el = pinElement(selected);

      el.addEventListener("mouseenter", () => showMapPreview(site));
      el.addEventListener("mouseleave", () => {
        if (state.selectedCode !== site.code) hideMapPreview();
      });
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        showMapPreview(site);
        selectSite(site.code, { fromMap: true });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);
      markersByCode.set(site.code, marker);
    });
  });

  rebuildLandmarks();
}

function flyToSite(site) {
  map.flyTo({ center: [site.lng, site.lat], zoom: Math.max(map.getZoom(), 13), duration: 600 });
  showMapPreview(site);
}

// ---------- map preview overlay ----------

const mapPreviewEl = document.getElementById("map-preview");
const mapPreviewImg = document.getElementById("map-preview-img");
const mapPreviewCode = document.getElementById("map-preview-code");
const mapPreviewTitle = document.getElementById("map-preview-title");
const mapPreviewSub = document.getElementById("map-preview-sub");

function showMapPreview(site) {
  mapPreviewImg.src = site.image;
  mapPreviewImg.alt = site.code;
  mapPreviewCode.textContent = site.code;
  mapPreviewTitle.textContent = " — " + site.title;
  mapPreviewSub.textContent = `${site.area} · ${site.size}`;
  mapPreviewEl.classList.add("show");
}

function hideMapPreview() {
  mapPreviewEl.classList.remove("show");
}

// ---------- rendering ----------

const listEl = document.getElementById("site-list");
const resultCountEl = document.getElementById("result-count");

function illuminatedIconSvg(on) {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 18h6"/><path d="M10 22h4"/>
    <path d="M12 2a6 6 0 0 0-4 10.5c.5.5 1 1.5 1 2.5h6c0-1 .5-2 1-2.5A6 6 0 0 0 12 2z" ${on ? 'fill="currentColor"' : ""}/>
  </svg>`;
}

function calcBlockHTML(site) {
  const durations = [1, 3, 6, 12];
  const hasProduction = site.production > 0;
  const calcTotal = site.suggestedRate * 1 + (site.production || 0);
  return `
    <div class="calc-block">
      <div class="calc-head">Estimate a campaign cost</div>
      <div class="calc-durations">
        ${durations.map(m => `<button class="duration-btn${m === 1 ? " active" : ""}" data-code="${site.code}" data-months="${m}">${m} mo</button>`).join("")}
      </div>
      <div class="calc-total">
        <span class="calc-total-label">Estimated total</span>
        <span class="calc-total-figure" data-calc-total="${site.code}">${fmtMoney(calcTotal)}</span>
      </div>
      <p class="calc-disclaimer">Estimate only — suggested rate × months${hasProduction ? " + production" : ""}. Final pricing confirmed via Contact for pricing.</p>
    </div>`;
}

function detailGridHTML(site) {
  const isDigital = site.format === "digital";
  // Kopano's sites have LSM/material/traffic-flow; The Medium's don't carry
  // those fields at all — fall back cleanly rather than printing "undefined".
  return isDigital ? `
      <div class="detail-grid">
        <div class="detail-field"><dt>Slots</dt><dd>${site.slots ?? "—"}</dd></div>
        <div class="detail-field"><dt>Spot length</dt><dd>${site.spotLength || "—"}</dd></div>
        <div class="detail-field"><dt>Loop</dt><dd>${site.loop || "—"}</dd></div>
        <div class="detail-field"><dt>Spots per day</dt><dd>${site.spotsPerDay ?? "—"}</dd></div>
        <div class="detail-field"><dt>Traffic count</dt><dd>${site.trafficCount || "—"}</dd></div>
        <div class="detail-field"><dt>Illuminated</dt><dd>${site.illuminated ? "Yes" : "No"}</dd></div>
      </div>` : `
      <div class="detail-grid">
        <div class="detail-field"><dt>LSM / SEM</dt><dd>${site.lsm || "Not specified"}</dd></div>
        <div class="detail-field"><dt>Material</dt><dd>${site.material || "Not specified"}</dd></div>
        <div class="detail-field"><dt>Traffic count</dt><dd>${site.trafficCount || "—"}</dd></div>
        <div class="detail-field"><dt>Illuminated</dt><dd>${site.illuminated ? "Yes" : "No"}</dd></div>
        ${site.trafficFlow ? `<div class="detail-field" style="grid-column: 1 / -1;"><dt>Traffic flow</dt><dd>${site.trafficFlow}</dd></div>` : ""}
      </div>`;
}

function siteCardHTML(site, expanded) {
  const status = resolveStatus(site);
  const badge = availabilityBadge(site);
  const signal = trafficLightHTML(status);
  const isDigital = site.format === "digital";

  const noteRow = site.liveNote ? `<p class="live-note">📌 ${site.liveNote}</p>` : "";

  const detail = expanded ? `
    <div class="site-detail">
      <img class="detail-img" src="${site.image}" alt="${site.code} — ${site.title}" loading="lazy" onload="this.style.animation='none'" />
      ${noteRow}
      <p>${site.description}</p>
      ${detailGridHTML(site)}
      ${calcBlockHTML(site)}
      <div class="gps-row">
        <span>${site.lat.toFixed(6)}, ${site.lng.toFixed(6)}</span>
        <a class="copy-btn" href="https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}" target="_blank" rel="noopener">Open in Maps</a>
      </div>
    </div>` : "";

  return `
    <div class="site-card${state.selectedCode === site.code ? " selected" : ""}" data-code="${site.code}">
      <div class="site-card-top">
        ${state.curateMode ? `<input type="checkbox" class="pick-check" data-pick="${site.code}" ${state.picked.has(site.code) ? "checked" : ""} />` : ""}
        <img class="card-thumb" src="${site.thumb}" alt="${site.code}" loading="lazy" onload="this.style.animation='none'" />
        <div class="site-title-line">
          <span class="site-shield">${site.code}</span>
          ${isDigital ? `<span class="format-badge">📺 Digital</span>` : ""}
          <p class="site-title">${site.title}</p>
          <span class="site-size">${site.size}</span>
        </div>
        <span class="illum-icon ${site.illuminated ? "on" : "off"}" title="${site.illuminated ? "Illuminated" : "Not illuminated"}">
          ${illuminatedIconSvg(site.illuminated)}
        </span>
      </div>
      <div class="rate-row">
        <span class="rate-figure">Media Rate from ${fmtMoney(site.suggestedRate)}<span class="rate-per">/mo</span></span>
        <span class="rate-flag" title="Indicative estimate only — final pricing confirmed via Contact for pricing">estimate*</span>
      </div>
      <div class="site-card-bottom">
        ${signal}
        ${badge}
        <button class="enquire-btn" data-enquire="${site.code}">Contact for pricing</button>
      </div>
      ${detail}
    </div>`;
}

function renderFocusView() {
  const visible = filteredSites();
  const idx = visible.findIndex(s => s.code === state.selectedCode);
  const site = visible[idx];
  if (!site) { exitFocusView(); return; }

  const status = resolveStatus(site);
  const isDigital = site.format === "digital";
  const noteRow = site.liveNote ? `<p class="live-note">📌 ${site.liveNote}</p>` : "";
  const posLabel = visible.length > 1 ? `${idx + 1} of ${visible.length}` : "";

  resultCountEl.textContent = `${visible.length} of ${state.clientView ? state.clientView.size : SITES.length} boards`;

  listEl.innerHTML = `
    <div class="focus-view">
      <div class="focus-header">
        <button class="focus-back" title="Back to list (Esc)">← All boards</button>
        <div class="focus-nav">
          <span class="focus-position">${posLabel}</span>
          <button class="focus-prev" title="Previous (↑)" ${visible.length < 2 ? "disabled" : ""}>↑</button>
          <button class="focus-next" title="Next (↓)" ${visible.length < 2 ? "disabled" : ""}>↓</button>
        </div>
      </div>
      <div class="focus-body">
        <img class="focus-img" src="${site.image}" alt="${site.code} — ${site.title}" loading="lazy" onload="this.style.animation='none'" />
        <div class="focus-title-row">
          <span class="site-shield">${site.code}</span>
          ${isDigital ? `<span class="format-badge">📺 Digital</span>` : ""}
          <span class="focus-size">${site.size}</span>
        </div>
        <h2 class="focus-title">${site.title}</h2>
        <div class="focus-status-row">
          ${trafficLightHTML(status)}
          ${availabilityBadge(site)}
          <span class="illum-icon ${site.illuminated ? "on" : "off"}" title="${site.illuminated ? "Illuminated" : "Not illuminated"}">
            ${illuminatedIconSvg(site.illuminated)}
          </span>
        </div>
        <div class="rate-row">
          <span class="rate-figure">Media Rate from ${fmtMoney(site.suggestedRate)}<span class="rate-per">/mo</span></span>
          <span class="rate-flag" title="Indicative estimate only — final pricing confirmed via Contact for pricing">estimate*</span>
        </div>
        ${noteRow}
        <p class="focus-desc">${site.description}</p>
        ${detailGridHTML(site)}
        ${calcBlockHTML(site)}
        <div class="gps-row">
          <span>${site.lat.toFixed(6)}, ${site.lng.toFixed(6)}</span>
          <a class="copy-btn" href="https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}" target="_blank" rel="noopener">Open in Maps</a>
        </div>
        <button class="enquire-btn focus-enquire" data-enquire="${site.code}">Contact for pricing</button>
      </div>
    </div>`;
}

function moveFocus(delta) {
  const visible = filteredSites();
  if (visible.length < 2) return;
  const idx = visible.findIndex(s => s.code === state.selectedCode);
  if (idx === -1) return;
  const nextIdx = (idx + delta + visible.length) % visible.length;
  const oldCode = state.selectedCode;
  const newSite = visible[nextIdx];
  state.selectedCode = newSite.code;
  state.collapsedAreas.delete(newSite.area);
  renderFocusView();
  updateMarkerSelection(oldCode, newSite.code);
  flyToSite(newSite);
}

function exitFocusView() {
  state.selectedCode = null;
  hideMapPreview();
  renderList();
  rebuildMarkers();
}

// Swaps just the two affected pin icons instead of rebuilding every marker
// on the map — keeps arrow-key browsing feeling instant rather than
// re-drawing the whole marker layer on every keypress.
function updateMarkerSelection(oldCode, newCode) {
  const oldMarker = markersByCode.get(oldCode);
  const newMarker = markersByCode.get(newCode);
  if (oldMarker) oldMarker.getElement().classList.remove("selected");
  if (newMarker) newMarker.getElement().classList.add("selected");
}

document.addEventListener("keydown", (e) => {
  if (!state.selectedCode) return;
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (e.key === "ArrowDown") { e.preventDefault(); moveFocus(1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); moveFocus(-1); }
  else if (e.key === "Escape") { e.preventDefault(); exitFocusView(); }
});

function renderList() {
  if (state.selectedCode && !state.curateMode) {
    renderFocusView();
    return;
  }

  const visible = filteredSites();
  const total = state.clientView ? state.clientView.size : SITES.length;
  resultCountEl.textContent = `${visible.length} of ${total} boards`;

  if (visible.length === 0) {
    listEl.innerHTML = `<div class="empty-state">No boards match those filters.<br>Try clearing search or the area filter.</div>`;
    return;
  }

  const byArea = new Map();
  visible.forEach(site => {
    if (!byArea.has(site.area)) byArea.set(site.area, []);
    byArea.get(site.area).push(site);
  });

  let html = "";
  // preserve AREAS order
  AREAS.forEach(area => {
    if (!byArea.has(area)) return;
    const sites = byArea.get(area);
    const collapsed = state.collapsedAreas.has(area);
    html += `
      <div class="area-group${collapsed ? " collapsed" : ""}" data-area="${area}">
        <div class="area-group-head">
          <span class="area-group-name">${area}</span>
          <span style="display:flex;align-items:center;">
            <span class="area-group-count">${sites.length}</span>
            <span class="area-chevron">▾</span>
          </span>
        </div>
        <div class="area-body">
          ${sites.map(s => siteCardHTML(s, state.selectedCode === s.code)).join("")}
        </div>
      </div>`;
  });

  listEl.innerHTML = html;
}

function selectSite(code, opts = {}) {
  state.selectedCode = state.selectedCode === code ? null : code;
  renderList();
  rebuildMarkers();

  if (state.selectedCode) {
    const site = SITES.find(s => s.code === state.selectedCode);
    // ensure its area group is expanded
    state.collapsedAreas.delete(site.area);
    flyToSite(site);
    // Curate mode keeps the old inline-expand-within-the-list behaviour
    // (reps still need to see checkboxes for every card), so that's the
    // only case that still needs to scroll a card into view. Otherwise
    // the focus view has already replaced the whole panel.
    if (state.curateMode) {
      const card = listEl.querySelector(`.site-card[data-code="${code}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else {
    hideMapPreview();
  }
}

// ---------- events ----------

listEl.addEventListener("click", (e) => {
  if (e.target.closest(".copy-btn")) {
    e.stopPropagation();
    return; // let the link's default navigation happen, just don't also toggle the card
  }
  if (e.target.closest(".focus-back")) {
    exitFocusView();
    return;
  }
  if (e.target.closest(".focus-next")) {
    moveFocus(1);
    return;
  }
  if (e.target.closest(".focus-prev")) {
    moveFocus(-1);
    return;
  }
  const pickCheck = e.target.closest(".pick-check");
  if (pickCheck) {
    e.stopPropagation();
    const code = pickCheck.dataset.pick;
    if (pickCheck.checked) state.picked.add(code);
    else state.picked.delete(code);
    updateShareBar();
    return;
  }
  const durationBtn = e.target.closest(".duration-btn");
  if (durationBtn) {
    e.stopPropagation();
    const site = SITES.find(s => s.code === durationBtn.dataset.code);
    const months = parseInt(durationBtn.dataset.months, 10);
    const total = site.suggestedRate * months + site.production;
    const calcBlock = durationBtn.closest(".calc-block");
    calcBlock.querySelectorAll(".duration-btn").forEach(b => b.classList.toggle("active", b === durationBtn));
    const totalEl = calcBlock.querySelector(".calc-total-figure");
    if (totalEl) totalEl.textContent = fmtMoney(total);
    return;
  }
  const enquireBtn = e.target.closest(".enquire-btn");
  if (enquireBtn) {
    e.stopPropagation();
    const site = SITES.find(s => s.code === enquireBtn.dataset.enquire);
    openContactModal(site);
    return;
  }
  const head = e.target.closest(".area-group-head");
  if (head) {
    const area = head.closest(".area-group").dataset.area;
    if (state.collapsedAreas.has(area)) state.collapsedAreas.delete(area);
    else state.collapsedAreas.add(area);
    renderList();
    return;
  }
  const card = e.target.closest(".site-card");
  if (card) selectSite(card.dataset.code);
});

document.getElementById("search-input").addEventListener("input", (e) => {
  state.search = e.target.value;
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    renderList();
    rebuildMarkers();
  }, 180);
});

document.getElementById("area-select").addEventListener("change", (e) => {
  state.area = e.target.value;
  renderList();
  rebuildMarkers();
  closeFilterMorePanel();
  if (state.area !== "all") {
    const first = filteredSites()[0];
    if (first) map.flyTo({ center: [first.lng, first.lat], zoom: 12, duration: 600 });
  }
});

document.getElementById("size-select").addEventListener("change", (e) => {
  state.size = e.target.value;
  renderList();
  rebuildMarkers();
  closeFilterMorePanel();
});

document.getElementById("illum-toggle").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  const cycle = { all: "yes", yes: "no", no: "all" };
  state.illuminated = cycle[state.illuminated];
  btn.classList.toggle("active", state.illuminated !== "all");
  btn.textContent = state.illuminated === "yes" ? "☀ Illuminated" : state.illuminated === "no" ? "☾ Non-illuminated" : "☀ Any lighting";
  renderList();
  rebuildMarkers();
  closeFilterMorePanel();
});

document.getElementById("avail-toggle").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  state.availableNow = !state.availableNow;
  btn.classList.toggle("active", state.availableNow);
  renderList();
  rebuildMarkers();
});

// ---------- curate & share (send a filtered set of sites to a client) ----------

const curateToggleBtn = document.getElementById("curate-toggle");
const shareBar = document.getElementById("share-bar");
const shareCountEl = document.getElementById("share-count");
const shareLinkBtn = document.getElementById("share-link-btn");
const shareClearBtn = document.getElementById("share-clear-btn");
const clientViewBanner = document.getElementById("client-view-banner");
const clientViewText = document.getElementById("client-view-text");
const clientViewClearBtn = document.getElementById("client-view-clear");

function updateShareBar() {
  shareCountEl.textContent = `${state.picked.size} selected`;
  shareBar.classList.toggle("show", state.curateMode && state.picked.size > 0);
}

// ---------- 3D map view toggle ----------
// This now drives MapLibre's real camera (pitch + bearing) over actual
// vector map data — not the old CSS-transform trick on flat tiles, which
// couldn't render readable text or standing buildings. Billboard pins
// stay upright automatically here: MapLibre keeps HTML markers facing
// the camera by default, so no counter-rotation hack is needed — they
// read as little billboards standing on the tilted streets.
const tiltToggleBtn = document.getElementById("tilt-toggle");
let is3dView = false;
if (tiltToggleBtn) {
  tiltToggleBtn.addEventListener("click", () => {
    is3dView = !is3dView;
    tiltToggleBtn.classList.toggle("active", is3dView);
    tiltToggleBtn.textContent = is3dView ? "🗺️ 2D View" : "🗺️ 3D View";
    map.easeTo({
      pitch: is3dView ? 58 : 0,
      bearing: is3dView ? -17 : 0,
      duration: 900,
    });
  });
}

// ---------- more-filters dropdown (area, size, lighting, curate) ----------
const filterMoreBtn = document.getElementById("filter-more-btn");
const filterMorePanel = document.getElementById("filter-more-panel");

function closeFilterMorePanel() {
  if (!filterMoreBtn || !filterMorePanel) return;
  filterMorePanel.classList.remove("show");
  filterMoreBtn.classList.remove("active");
  filterMoreBtn.setAttribute("aria-expanded", "false");
}

if (filterMoreBtn && filterMorePanel) {
  filterMoreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = filterMorePanel.classList.toggle("show");
    filterMoreBtn.classList.toggle("active", isOpen);
    filterMoreBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (isOpen) {
      // position: fixed, so this has to be set from the button's real
      // on-screen location — there's no CSS-only way to anchor a fixed
      // element to a specific other element the way absolute positioning
      // normally would.
      const rect = filterMoreBtn.getBoundingClientRect();
      filterMorePanel.style.top = `${rect.bottom + 8}px`;
      filterMorePanel.style.left = `${rect.left}px`;
    }
  });
  filterMorePanel.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", closeFilterMorePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFilterMorePanel();
  });
}

curateToggleBtn.addEventListener("click", () => {
  state.curateMode = !state.curateMode;
  curateToggleBtn.classList.toggle("active", state.curateMode);
  updateShareBar();
  renderList();
  closeFilterMorePanel();
  // Switching brands mid-curation would mix site codes from two different
  // companies into one link, which makes no sense — hide the option for
  // as long as a curated selection is in progress.
  const switcherWrap = document.getElementById("brand-switcher-wrap");
  if (switcherWrap) switcherWrap.style.display = state.curateMode ? "none" : "";
});

shareClearBtn.addEventListener("click", () => {
  state.picked.clear();
  updateShareBar();
  renderList();
});

shareLinkBtn.addEventListener("click", async () => {
  const codes = [...state.picked];
  if (codes.length === 0) return;
  const url = new URL(location.href);
  url.search = "";
  if (currentBrandId !== "kopano") url.searchParams.set("brand", currentBrandId);
  url.searchParams.set("sites", codes.join(","));
  const shareUrl = url.toString();
  const shareText = `${codes.length} ${brandFullName()} billboard site${codes.length === 1 ? "" : "s"} selected for you — view the map:`;

  if (navigator.share) {
    try {
      await navigator.share({ title: `${brandFullName()} — selected sites`, text: shareText, url: shareUrl });
      return;
    } catch (err) {
      // user cancelled the native share sheet — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(shareUrl);
    const original = shareLinkBtn.textContent;
    shareLinkBtn.textContent = "Link copied!";
    setTimeout(() => (shareLinkBtn.textContent = original), 1600);
  } catch (err) {
    prompt("Copy this link to send to your client:", shareUrl);
  }
});

function applyClientViewFromUrl() {
  const params = new URLSearchParams(location.search);
  const sitesParam = params.get("sites");
  if (!sitesParam) return;
  const codes = sitesParam.split(",").map(s => s.trim()).filter(Boolean);
  const valid = codes.filter(c => SITES.some(s => s.code === c));
  if (valid.length === 0) return;

  state.clientView = new Set(valid);
  curateToggleBtn.style.display = "none";
  const switcherEl = document.getElementById("brand-switcher-wrap");
  if (switcherEl) switcherEl.style.display = "none";
  clientViewText.textContent = `Viewing ${valid.length} board${valid.length === 1 ? "" : "s"} hand-picked by ${brandFullName()}`;
  clientViewBanner.classList.add("show");
}

clientViewClearBtn.addEventListener("click", () => {
  state.clientView = null;
  const url = new URL(location.href);
  url.searchParams.delete("sites");
  history.replaceState(null, "", url.toString());
  curateToggleBtn.style.display = "";
  const switcherEl2 = document.getElementById("brand-switcher-wrap");
  if (switcherEl2) switcherEl2.style.display = "";
  clientViewBanner.classList.remove("show");
  renderList();
  rebuildMarkers();
});

// ---------- contact modal ----------

const contactModal = document.getElementById("contact-modal");
const contactSubtitle = document.getElementById("contact-subtitle");
const contactEmailLink = document.getElementById("contact-email-link");
const contactWhatsappLink = document.getElementById("contact-whatsapp-link");

function waNumber() {
  // wa.me needs digits only, no + or spaces
  return CONTACT.phoneHref.replace(/[^\d]/g, "");
}

function openContactModal(site) {
  const firstName = CONTACT.name.split(" ")[0];
  if (site) {
    contactSubtitle.textContent = `Enquiring about ${site.code} — ${site.title}`;
    const subject = encodeURIComponent(`Rate enquiry — ${site.code} (${site.title})`);
    const body = encodeURIComponent(
      `Hi ${firstName},\n\nPlease could you send me the current rate card for ${site.code} — ${site.title} (${site.area})?\n\nThanks`
    );
    contactEmailLink.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    const waText = encodeURIComponent(
      `Hi, I'd like the current rate card for ${site.code} — ${site.title} (${site.area}).`
    );
    contactWhatsappLink.href = `https://wa.me/${waNumber()}?text=${waText}`;
  } else {
    contactSubtitle.textContent = `Get today's rate card for any ${brandFullName()} site`;
    contactEmailLink.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Rate card enquiry")}`;
    const waText = encodeURIComponent(`Hi, I'd like a rate card for a ${brandFullName()} site.`);
    contactWhatsappLink.href = `https://wa.me/${waNumber()}?text=${waText}`;
  }
  contactModal.classList.add("show");
}

function closeContactModal() {
  contactModal.classList.remove("show");
}

document.getElementById("header-contact-btn").addEventListener("click", () => openContactModal(null));
document.getElementById("contact-close").addEventListener("click", closeContactModal);
contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) closeContactModal();
});

// ---------- live availability sync (Google Sheet, published as CSV) ----------

const syncStatusEl = document.getElementById("sync-status");

function parseCsv(text) {
  // minimal CSV parser: handles quoted fields containing commas
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (field !== "" || row.length) { row.push(field); rows.push(row); }
        row = []; field = "";
        if (c === "\r" && text[i + 1] === "\n") i++;
      } else field += c;
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ""));
}

function setSyncStatus(text, ok) {
  if (!syncStatusEl) return;
  syncStatusEl.textContent = text;
  syncStatusEl.classList.toggle("ok", !!ok);
}

async function fetchLiveAvailability() {
  if (!CONFIG.SHEET_CSV_URL) {
    setSyncStatus("Static data — no live sheet connected", false);
    return;
  }
  try {
    const res = await fetch(CONFIG.SHEET_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    const rows = parseCsv(text);
    if (rows.length < 2) throw new Error("Empty sheet");

    // normalize header names: lowercase, strip spaces, so "Next Available Date"
    // and "NextAvailableDate" both resolve to the same column key
    const header = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, ""));
    const iCode = header.indexOf("code");
    const iStatus = header.indexOf("status");
    const iAvail = header.indexOf("availablefrom");
    const iNote = header.indexOf("note");
    const iClient = header.indexOf("client");
    const iNextAvail = header.indexOf("nextavailabledate");
    // "area" column is intentionally not consumed — it's there purely so
    // staff editing the sheet can see which site a row refers to.
    if (iCode === -1 || iStatus === -1) throw new Error("Missing Code/Status columns");

    const byCode = new Map();
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r];
      const code = (cells[iCode] || "").trim();
      if (!code) continue;
      byCode.set(code, {
        status: (cells[iStatus] || "").trim().toLowerCase(),
        availableFrom: iAvail !== -1 ? (cells[iAvail] || "").trim() : "",
        nextAvailable: iNextAvail !== -1 ? (cells[iNextAvail] || "").trim() : "",
        note: iNote !== -1 ? (cells[iNote] || "").trim() : "",
        client: iClient !== -1 ? (cells[iClient] || "").trim() : "",
      });
    }

    let matched = 0;
    SITES.forEach(site => {
      const row = byCode.get(site.code);
      if (!row) return;
      matched++;
      if (row.status === "booked" || row.status === "optioned" || row.status === "available") {
        site.liveStatus = row.status;
      } else {
        site.liveStatus = null;
      }
      if (row.availableFrom) site.availability = row.availableFrom;
      site.liveNextAvailable = row.nextAvailable || "";
      site.liveNote = row.note || "";
      site.liveClient = row.client || "";
    });

    const now = new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
    setSyncStatus(`Live — synced ${now} (${matched}/${SITES.length} sites)`, true);
    renderList();
    rebuildMarkers();
  } catch (err) {
    setSyncStatus("Live sheet unreachable — showing last known data", false);
  }
}

// ---------- brand switching (Kopano Media / The Medium) ----------

function brandFullName() {
  const b = BRANDS[currentBrandId];
  return `${b.name} ${b.nameAccent}`;
}

// Points SITES/AREAS/CONTACT/CONFIG/LANDMARKS at the given brand's data.
// Pure data assignment only — no DOM/map work here, so it's safe to call
// before the map or DOM listeners exist (used at first load).
function activateBrandData(id) {
  const brand = BRANDS[id] || BRANDS.kopano;
  currentBrandId = brand.id;
  SITES = brand.SITES;
  AREAS = brand.AREAS;
  CONTACT = brand.CONTACT;
  CONFIG = brand.CONFIG;
  LANDMARKS = brand.LANDMARKS || [];
}

function updateBrandHeaderUI() {
  document.title = "BoardBase";
  document.body.dataset.brand = currentBrandId;
  document.querySelectorAll(".brand-pill").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.brand === currentBrandId);
  });
}

// Re-runs everything that depends on which brand is active: dropdowns,
// contact card, map markers/landmarks, the list, and live sync — used
// both at first load and whenever the user switches brands.
function refreshUIForBrand() {
  state.search = "";
  state.area = "all";
  state.size = "all";
  state.illuminated = "all";
  state.availableNow = false;
  state.selectedCode = null;
  state.collapsedAreas = new Set();
  state.curateMode = false;
  state.picked = new Set();

  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";
  const areaSelect = document.getElementById("area-select");
  const sizeSelect = document.getElementById("size-select");
  if (areaSelect) areaSelect.innerHTML = '<option value="all">All areas</option>';
  if (sizeSelect) sizeSelect.innerHTML = '<option value="all">All sizes</option>';
  const illumBtn = document.getElementById("illum-toggle");
  const availBtn = document.getElementById("avail-toggle");
  if (illumBtn) { illumBtn.classList.remove("active"); illumBtn.textContent = "☀ Any lighting"; }
  if (availBtn) availBtn.classList.remove("active");

  populateSelects();
  populateContactStatic();
  updateBrandHeaderUI();
  hideMapPreview();
  renderList();
  rebuildMarkers();
  if (map) fitMapToBrand();

  if (liveSyncTimer) clearInterval(liveSyncTimer);
  fetchLiveAvailability();
  if (CONFIG.SHEET_CSV_URL) {
    liveSyncTimer = setInterval(fetchLiveAvailability, CONFIG.REFRESH_SECONDS * 1000);
  }
}

// Switching brands mid-session (user picks the other company from the
// dropdown). A client-share link is brand-specific, so it's cleared here —
// it wouldn't mean anything against the other brand's site codes.
function switchBrand(id) {
  if (id === currentBrandId || !BRANDS[id]) return;
  const layoutEl = document.querySelector(".layout");
  if (layoutEl) layoutEl.classList.add("brand-switching");

  setTimeout(() => {
    activateBrandData(id);
    state.clientView = null;
    if (clientViewBanner) clientViewBanner.classList.remove("show");
    if (curateToggleBtn) curateToggleBtn.style.display = "";
    refreshUIForBrand();
    const url = new URL(location.href);
    url.searchParams.set("brand", id);
    url.searchParams.delete("sites");
    history.replaceState(null, "", url.toString());

    if (layoutEl) {
      // let the new content paint at opacity 0 first, then fade it in —
      // avoids a flash of the old layout mid-transition
      requestAnimationFrame(() => layoutEl.classList.remove("brand-switching"));
    }
  }, 160);
}

// ---------- init ----------

function populateSelects() {
  const areaSelect = document.getElementById("area-select");
  AREAS.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a; opt.textContent = a;
    areaSelect.appendChild(opt);
  });

  const sizeSelect = document.getElementById("size-select");
  uniqueSizes().forEach(sz => {
    const opt = document.createElement("option");
    opt.value = sz; opt.textContent = sz;
    sizeSelect.appendChild(opt);
  });
}

function populateContactStatic() {
  document.getElementById("contact-name").textContent = CONTACT.name;
  document.getElementById("contact-role").textContent = CONTACT.role;
  document.getElementById("contact-email-display").textContent = CONTACT.email;
  const initials = CONTACT.name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const avatarEl = document.getElementById("modal-avatar");
  if (avatarEl) avatarEl.textContent = initials;
}

// Which brand to start on: the URL's ?brand= param if valid, else Kopano.
const startParams = new URLSearchParams(location.search);
const startBrandId = BRANDS[startParams.get("brand")] ? startParams.get("brand") : "kopano";
activateBrandData(startBrandId);

const brandPills = document.querySelectorAll(".brand-pill");
brandPills.forEach(pill => {
  pill.addEventListener("click", () => switchBrand(pill.dataset.brand));
});

populateSelects();
populateContactStatic();
updateBrandHeaderUI();
applyClientViewFromUrl();
initMap();
renderList();
rebuildMarkers();
fetchLiveAvailability();
if (CONFIG.SHEET_CSV_URL) {
  liveSyncTimer = setInterval(fetchLiveAvailability, CONFIG.REFRESH_SECONDS * 1000);
}

// ---------- PWA install prompt ----------

let deferredInstallEvent = null;
const installBanner = document.getElementById("install-banner");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallEvent = e;
  installBanner.classList.add("show");
});

document.getElementById("install-btn").addEventListener("click", async () => {
  if (!deferredInstallEvent) return;
  deferredInstallEvent.prompt();
  await deferredInstallEvent.userChoice;
  installBanner.classList.remove("show");
  deferredInstallEvent = null;
});

document.getElementById("dismiss-install").addEventListener("click", () => {
  installBanner.classList.remove("show");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
