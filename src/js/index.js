var osm = L.tileLayer(
    // standart osm
    // 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    // relief map
    'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(55.86531828981331, 37.630534172058105), zoom: 16, maxZoom: 22}),
    moscow = L.latLng(37, 55);

L.control.scale().addTo(map);

// var vl = L.polyline(medvedkovo).addTo(map);
medvedkovo.forEach(function(ll){
    return ll.reverse();
});

var medvedkovo = L.river(medvedkovo, {
    // weight: 7,
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 10
}).addTo(map);

var medvedkovo_line = medvedkovo.convertToPolyline({color: 'red'}).addTo(map);
// console.log(medvedkovo_line);
console.log(medvedkovo);

map.fitBounds(medvedkovo.getBounds());
