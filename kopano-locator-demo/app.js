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

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function isAvailableNow(iso) {
  return new Date(iso + "T00:00:00") <= TODAY;
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
  if (state.availableNow && !isAvailableNow(site.availability)) return false;
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
      ${extra}
    `, { maxWidth: 220 });
    marker.bindTooltip(`
      <img class="tip-img" src="${cover.thumb}" alt="${cover.code}" loading="lazy" />
      <div class="tip-cap">${cover.code}${sites.length > 1 ? ` +${sites.length - 1}` : ""}</div>
    `, { direction: "top", offset: [0, -26], opacity: 1, className: "kop-tooltip" });
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
  const now = isAvailableNow(site.availability);
  const badge = now
    ? `<span class="avail-badge now">● available now</span>`
    : `<span class="avail-badge soon">● opens ${fmtDate(site.availability)}</span>`;

  const detail = expanded ? `
    <div class="site-detail">
      <img class="detail-img" src="${site.image}" alt="${site.code} — ${site.title}" loading="lazy" />
      <p>${site.description}</p>
      <div class="detail-grid">
        <div class="detail-field"><dt>LSM / SEM</dt><dd>${site.lsm}</dd></div>
        <div class="detail-field"><dt>Material</dt><dd>${site.material}</dd></div>
        <div class="detail-field"><dt>Traffic count</dt><dd>${site.trafficCount}</dd></div>
        <div class="detail-field"><dt>Illuminated</dt><dd>${site.illuminated ? "Yes" : "No"}</dd></div>
        <div class="detail-field" style="grid-column: 1 / -1;"><dt>Traffic flow</dt><dd>${site.trafficFlow}</dd></div>
      </div>
      <div class="gps-row">
        <span>${site.lat.toFixed(6)}, ${site.lng.toFixed(6)}</span>
        <button class="copy-btn" data-copy="${site.lat},${site.lng}">Copy GPS</button>
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
      <div class="site-card-bottom">
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
  const copyBtn = e.target.closest(".copy-btn");
  if (copyBtn) {
    e.stopPropagation();
    navigator.clipboard?.writeText(copyBtn.dataset.copy);
    copyBtn.textContent = "Copied";
    setTimeout(() => (copyBtn.textContent = "Copy GPS"), 1200);
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
const contactPhoneLink = document.getElementById("contact-phone-link");

function openContactModal(site) {
  if (site) {
    contactSubtitle.textContent = `Enquiring about ${site.code} — ${site.title}`;
    const subject = encodeURIComponent(`Rate enquiry — ${site.code} (${site.title})`);
    const body = encodeURIComponent(
      `Hi Peter,\n\nPlease could you send me the current rate card for ${site.code} — ${site.title} (${site.area})?\n\nThanks`
    );
    contactEmailLink.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  } else {
    contactSubtitle.textContent = "Get today's rate card for any Kopano Media site";
    contactEmailLink.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Rate card enquiry")}`;
  }
  contactPhoneLink.href = `tel:${CONTACT.phoneHref}`;
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
  document.getElementById("contact-phone-display").textContent = CONTACT.phone;
  document.getElementById("contact-email-display").textContent = CONTACT.email;
}

populateSelects();
populateContactStatic();
initMap();
renderList();
rebuildMarkers();

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
