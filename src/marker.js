import L from 'leaflet';

const icon = new L.Icon({
    iconUrl: require('./public/marker-icon.png'),
    iconRetinaUrl: null,
    iconAnchor: [12,40],
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(25, 41),
    className: 'leaflet-marker-icon leaflet-zoom-animated leaflet-interactive'
});

export { icon };