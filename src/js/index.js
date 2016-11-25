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

// L.polyline(vorya).addTo(map);
vorya.forEach(function(ll){
    return ll.reverse();
});

pazha.forEach(function(ll){
    return ll.reverse();
});
torgosha.forEach(function(ll){
    return ll.reverse();
});
noname.forEach(function(ll){
    return ll.reverse();
});
// console.log(torgosha);

var vorya = L.river(vorya, {
    fillOpacity: 0,
    startWidth: 1,
    endWidth: 130
}).addTo(map);

var pazha = L.river(pazha, {
    startWidth: 1,
    endWidth: 60
}).addTo(map);

var torgosha = L.river(torgosha, {
    startWidth: 1,
    endWidth: 40
}).addTo(map);

var noname = L.river(noname, {
    startWidth: 1,
    endWidth: 20
}).addTo(map);

torgosha.plg.forEach(function(ll) {
    console.log(ll);
})

// console.log(torgosha);

var rivers = [vorya, pazha, torgosha, noname];

rivers.forEach(function(river){
    river._countMileStones();
    river._countPercentage();
    river._interpolateRange();
    river._createPolygon();
});

var vorya_pol = L.polygon(vorya.plg, {weight: 1, fillOpacity: 1}).addTo(map);
var pazha_pol = L.polygon(pazha.plg, {weight: 1, fillOpacity: 1}).addTo(map);
var torgosha_pol = L.polygon(torgosha.plg, {weight: 1, fillOpacity: 1}).addTo(map);
var noname_pol = L.polygon(noname.plg, {weight: 1, fillOpacity: 1}).addTo(map);
// console.log(vorya_pol);
map.fitBounds(vorya_pol.getBounds());
