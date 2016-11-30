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
var rivers = [];

function  filter(feature, layer) {
    return feature.properties.scalerank === 9;
}

function each(feature, layer) {
    var river = L.river(feature.geometry.coordinates, {
        color: 'blue', weight: 1, fillColor: 'blue',
        fillOpacity: 1,
        startWidth: 1,
        endWidth: 1000
        // startWidth: 0.002,
        // endWidth: 0.008
    });
    // river.adjustWidth();
    river.addTo(map);
    layer.bindPopup(feature.properties);
    // console.log(feature.properties);
}

var monRiversJson = L.geoJson(world10, {
    // filter: filter,
    onEachFeature: each
});/*.addTo(map)*/
// console.log(rivers);



map.setView(L.latLng(49.34117458931808, 102.34906196594238), 9);
