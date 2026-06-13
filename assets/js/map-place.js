mapboxgl.accessToken = MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map-place',
  style: MAPBOX_STYLE,
  center: [PLACE_LON, PLACE_LAT],
  zoom: 15,
  attributionControl: true,
  scrollZoom: false
});

new mapboxgl.Marker({ color: '#2d6a4f' })
  .setLngLat([PLACE_LON, PLACE_LAT])
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(PLACE_TITLE))
  .addTo(map);

map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
