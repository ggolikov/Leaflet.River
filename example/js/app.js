var L = global.L || require('leaflet');
require('../../index.js');
var testRivers = require('./data/testrivers.js');
var osm = L.tileLayer(
    // standart osm
    // 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    // relief map
    // 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    // ESRI Terrain
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
    {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),

    // map
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(48.935130721045326, 100.22), zoom: 8, maxZoom: 22}),

    // test rivers
    rivers = L.geoJson(testRivers, {
        onEachFeature: onEachFeature
    });

function onEachFeature(feature, layer) {
    var river = L.river(feature.geometry.coordinates, {
        weight: 0,
        // color: 'blue',
        fillColor: 'blue',
        fillOpacity: 1,
        startWidth: 1,
        // endWidth: 1
        endWidth: feature.properties.length / 400
    });
    river.addTo(map);
}
