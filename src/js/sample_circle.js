var osm = L.tileLayer(
    // standart osm
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    // relief map
    // 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    moscow = new L.LatLng(55, 37),
    map = new L.Map('map', {layers: [osm], center: moscow, zoom: 16, maxZoom: 22}),
    t, b, p,
    top, bottom, p, topMarker, bottomMarker, pMarker,
    radius = 100;
L.marker(moscow).addTo(map);
L.control.scale().addTo(map);

L.circle(moscow, {radius: radius}).addTo(map);
t = [10112932.977777777, 5306524.535414506];
b = [10112932.977777777, 5306670.6760921795];
p = [10112932.977777777, 5306597.605753343];
ttop = map.unproject(t);
bottom = map.unproject(b);
point = map.unproject(p);
topMarker = L.marker(map.unproject(t)).addTo(map);
bottomMarker = L.marker(map.unproject(b)).addTo(map);
pMarker = L.marker(map.unproject(p)).addTo(map);

console.log(map.distance(point, bottom));
console.log(map.distance(point, ttop));
// console.log(map.distance(bottom, ttop));
console.log(map.distance(point, moscow));
// console.log(p);
// console.log(map.project(moscow));
