// Kopano Media — OOH Site Locator
// Vanilla JS + Leaflet. Data comes from data.js (SITES, AREAS).

const state = {
  search: "",
  area: "all",
  size: "all",
  illuminated: "all",
  availableNow: false,
  selectedCode: null,
  collapsedAreas: new Set(),
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

let map, markerLayer;
const markersByCoord = new Map(); // coordKey -> {marker, codes:[]}

function initMap() {
  map = L.map("map", { zoomControl: false, attributionControl: true }).setView([-26.13, 27.99], 10);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
}

function pinIcon(count, selected) {
  const label = count > 1 ? count : "";
  return L.divIcon({
    className: "kop-pin-wrap",
    html: `<div class="kop-pin${selected ? " selected" : ""}">
             <div class="kop-pin-board">${label}</div>
             <div class="kop-pin-post"></div>
           </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  });
}

function rebuildMarkers() {
  markerLayer.clearLayers();
  markersByCoord.clear();

  const visible = filteredSites();
  const groups = new Map();
  visible.forEach(site => {
    const key = siteKey(site);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(site);
  });

  groups.forEach((sites, key) => {
    const [lat, lng] = key.split(",").map(Number);
    const codes = sites.map(s => s.code);
    const selected = state.selectedCode && codes.includes(state.selectedCode);
    const marker = L.marker([lat, lng], { icon: pinIcon(sites.length, selected) });
    const cover = sites[0];
    const extra = sites.length > 1 ? `<div class="popup-more">+${sites.length - 1} more board${sites.length > 2 ? "s" : ""} at this spot</div>` : "";
    marker.bindPopup(`
      <img class="popup-img" src="${cover.thumb}" alt="${cover.code}" loading="lazy" />
      <div class="popup-title">${cover.code} — ${cover.title}</div>
      <div class="popup-sub">${cover.area} · ${cover.size}</div>
      <div class="popup-signal">${trafficLightHTML(resolveStatus(cover))}</div>
      ${extra}
    `, { maxWidth: 220 });
    marker.bindTooltip(`
      <img class="tip-img" src="${cover.image}" alt="${cover.code}" loading="lazy" />
      <div class="tip-cap">${cover.code} — ${cover.title}${sites.length > 1 ? ` (+${sites.length - 1} more)` : ""}</div>
    `, { direction: "top", offset: [0, -34], opacity: 1, className: "kop-tooltip" });
    marker.on("click", () => {
      selectSite(sites[0].code, { fromMap: true });
    });
    marker.addTo(markerLayer);
    markersByCoord.set(key, { marker, codes });
  });
}

function flyToSite(site) {
  map.flyTo([site.lat, site.lng], Math.max(map.getZoom(), 13), { duration: 0.6 });
  const key = siteKey(site);
  const entry = markersByCoord.get(key);
  if (entry) entry.marker.openPopup();
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

function siteCardHTML(site, expanded) {
  const status = resolveStatus(site);
  const badge = availabilityBadge(site);
  const signal = trafficLightHTML(status);

  const noteRow = site.liveNote ? `<p class="live-note">📌 ${site.liveNote}</p>` : "";

  const durations = [1, 3, 6, 12];
  const calcBlock = `
    <div class="calc-block">
      <div class="calc-head">Estimate a campaign cost</div>
      <div class="calc-durations">
        ${durations.map(m => `<button class="duration-btn${m === 1 ? " active" : ""}" data-code="${site.code}" data-months="${m}">${m} mo</button>`).join("")}
      </div>
      <div class="calc-total">
        <span class="calc-total-label">Estimated total</span>
        <span class="calc-total-figure" data-calc-total="${site.code}">${fmtMoney(site.suggestedRate * 1 + site.production)}</span>
      </div>
      <p class="calc-disclaimer">Estimate only — suggested rate × months + production. Final pricing confirmed via Contact for pricing.</p>
    </div>`;

  const detail = expanded ? `
    <div class="site-detail">
      <img class="detail-img" src="${site.image}" alt="${site.code} — ${site.title}" loading="lazy" />
      ${noteRow}
      <p>${site.description}</p>
      <div class="detail-grid">
        <div class="detail-field"><dt>LSM / SEM</dt><dd>${site.lsm}</dd></div>
        <div class="detail-field"><dt>Material</dt><dd>${site.material}</dd></div>
        <div class="detail-field"><dt>Traffic count</dt><dd>${site.trafficCount}</dd></div>
        <div class="detail-field"><dt>Illuminated</dt><dd>${site.illuminated ? "Yes" : "No"}</dd></div>
        <div class="detail-field" style="grid-column: 1 / -1;"><dt>Traffic flow</dt><dd>${site.trafficFlow}</dd></div>
      </div>
      ${calcBlock}
      <div class="gps-row">
        <span>${site.lat.toFixed(6)}, ${site.lng.toFixed(6)}</span>
        <a class="copy-btn" href="https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}" target="_blank" rel="noopener">Open in Maps</a>
      </div>
    </div>` : "";

  return `
    <div class="site-card${state.selectedCode === site.code ? " selected" : ""}" data-code="${site.code}">
      <div class="site-card-top">
        <img class="card-thumb" src="${site.thumb}" alt="${site.code}" loading="lazy" />
        <div class="site-title-line">
          <span class="site-shield">${site.code}</span>
          <p class="site-title">${site.title}</p>
          <span class="site-size">${site.size}</span>
        </div>
        <span class="illum-icon ${site.illuminated ? "on" : "off"}" title="${site.illuminated ? "Illuminated" : "Not illuminated"}">
          ${illuminatedIconSvg(site.illuminated)}
        </span>
      </div>
      <div class="rate-row">
        <span class="rate-figure">Suggested from ${fmtMoney(site.suggestedRate)}<span class="rate-per">/mo</span></span>
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

function renderList() {
  const visible = filteredSites();
  resultCountEl.textContent = `${visible.length} of ${SITES.length} boards`;

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
    if (!opts.fromMap) flyToSite(site);
    if (!opts.fromMap) {
      renderList();
      const card = listEl.querySelector(`.site-card[data-code="${code}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      const card = listEl.querySelector(`.site-card[data-code="${code}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

// ---------- events ----------

listEl.addEventListener("click", (e) => {
  if (e.target.closest(".copy-btn")) {
    e.stopPropagation();
    return; // let the link's default navigation happen, just don't also toggle the card
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
  renderList();
  rebuildMarkers();
});

document.getElementById("area-select").addEventListener("change", (e) => {
  state.area = e.target.value;
  renderList();
  rebuildMarkers();
  if (state.area !== "all") {
    const first = filteredSites()[0];
    if (first) map.flyTo([first.lat, first.lng], 12, { duration: 0.6 });
  }
});

document.getElementById("size-select").addEventListener("change", (e) => {
  state.size = e.target.value;
  renderList();
  rebuildMarkers();
});

document.getElementById("illum-toggle").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  const cycle = { all: "yes", yes: "no", no: "all" };
  state.illuminated = cycle[state.illuminated];
  btn.classList.toggle("active", state.illuminated !== "all");
  btn.textContent = state.illuminated === "yes" ? "☀ Illuminated" : state.illuminated === "no" ? "☾ Non-illuminated" : "☀ Any lighting";
  renderList();
  rebuildMarkers();
});

document.getElementById("avail-toggle").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  state.availableNow = !state.availableNow;
  btn.classList.toggle("active", state.availableNow);
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
  if (site) {
    contactSubtitle.textContent = `Enquiring about ${site.code} — ${site.title}`;
    const subject = encodeURIComponent(`Rate enquiry — ${site.code} (${site.title})`);
    const body = encodeURIComponent(
      `Hi Peter,\n\nPlease could you send me the current rate card for ${site.code} — ${site.title} (${site.area})?\n\nThanks`
    );
    contactEmailLink.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    const waText = encodeURIComponent(
      `Hi, I'd like the current rate card for ${site.code} — ${site.title} (${site.area}).`
    );
    contactWhatsappLink.href = `https://wa.me/${waNumber()}?text=${waText}`;
  } else {
    contactSubtitle.textContent = "Get today's rate card for any Kopano Media site";
    contactEmailLink.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Rate card enquiry")}`;
    const waText = encodeURIComponent("Hi, I'd like a rate card for a Kopano Media site.");
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
}

populateSelects();
populateContactStatic();
initMap();
renderList();
rebuildMarkers();
fetchLiveAvailability();
if (CONFIG.SHEET_CSV_URL) {
  setInterval(fetchLiveAvailability, CONFIG.REFRESH_SECONDS * 1000);
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
