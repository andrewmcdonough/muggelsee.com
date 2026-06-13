mapboxgl.accessToken = MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map-tag',
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

map.on('load', () => {
  const geojson = window.PLACES_GEOJSON;
  const filtered = geojson.features.filter(
    f => (f.properties.tags || []).includes(TAG_FILTER)
  );

  if (filtered.length) {
    const bounds = new mapboxgl.LngLatBounds();
    filtered.forEach(f => bounds.extend(f.geometry.coordinates));
    map.fitBounds(bounds, { padding: 60, maxZoom: 15 });
  }

  filtered.forEach(feature => {
    const props = feature.properties;
    const tags = props.tags || [];

    const el = document.createElement('div');
    el.className = 'map-place-marker';
    el.style.backgroundColor = categoryColor(tags);

    const popup = new mapboxgl.Popup({ offset: 12, closeButton: false })
      .setHTML(`
        <div class="map-popup">
          <a href="${props.url}"><strong>${props.title}</strong></a>
          ${props.rating ? `<span class="popup-rating">${props.rating} / 10</span>` : ''}
        </div>
      `);

    new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat(feature.geometry.coordinates)
      .setPopup(popup)
      .addTo(map);
  });
});
