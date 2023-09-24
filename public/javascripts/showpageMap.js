mapboxgl.accessToken = maptoken;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: campground.geometry.coordinates,
    zoom: 11,
    projection: 'naturalEarth'
  });

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.tittle}</h3><p>${campground.Location}</p>`
            )
    )
    .addTo(map)

