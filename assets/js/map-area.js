mapboxgl.accessToken = MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map-area',
  style: MAPBOX_STYLE,
  center: MAP_CENTER,
  zoom: MAP_ZOOM,
  attributionControl: true
});

map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

function categoryColor(tags) {
  if (!tags || !tags.length) return '#84a98c';
  const cat = CATEGORIES.find(c => tags.includes(c.slug));
  return cat ? cat.color : '#84a98c';
}

let allMarkers = [];

function renderMarkers(features, activeFilters) {
  allMarkers.forEach(m => m.remove());
  allMarkers = [];

  features.forEach(feature => {
    const props = feature.properties;
    const tags = props.tags || [];
    if (activeFilters.length && !tags.some(t => activeFilters.includes(t))) return;

    const el = document.createElement('div');
    el.className = 'map-place-marker';
    el.style.backgroundColor = categoryColor(tags);

    const popup = new mapboxgl.Popup({ offset: 12, closeButton: false })
      .setHTML(`
        <div class="map-popup">
          <a href="${props.url}"><strong>${props.title}</strong></a>
          ${props.rating ? `<span class="popup-rating">${props.rating} / 10</span>` : ''}
          ${tags.length ? `<div class="popup-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        </div>
      `);

    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat(feature.geometry.coordinates)
      .setPopup(popup)
      .addTo(map);

    allMarkers.push(marker);
  });
}

map.on('load', () => {
  const geojson = window.PLACES_GEOJSON;
  const areaFeatures = geojson.features.filter(
    f => f.properties.area === AREA_ID
  );

  renderMarkers(areaFeatures, []);

  window.addEventListener('filter-change', e => {
    renderMarkers(areaFeatures, e.detail.active);
  });
});

function toggleFilter(slug) {
  const filterEl = document.querySelector('.tag-filter[x-data]');
  if (!filterEl) return;
  const active = JSON.parse(filterEl.getAttribute('data-active') || '[]');
  const idx = active.indexOf(slug);
  if (idx === -1) active.push(slug);
  else active.splice(idx, 1);
  filterEl.setAttribute('data-active', JSON.stringify(active));
  document.dispatchEvent(new CustomEvent('filter-change', { detail: { active: [...active] } }));
}
