mapboxgl.accessToken = MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map-home',
  style: MAPBOX_STYLE,
  center: MAP_CENTER,
  zoom: MAP_ZOOM,
  attributionControl: true
});

map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

map.on('load', () => {
  AREAS.forEach(area => {
    const el = document.createElement('div');
    el.className = 'map-area-marker';
    el.style.backgroundColor = area.color;
    el.innerHTML = `<span>${area.label}</span>`;

    el.addEventListener('click', () => {
      window.location.href = area.url;
    });

    new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([area.center[1], area.center[0]])
      .addTo(map);
  });
});
