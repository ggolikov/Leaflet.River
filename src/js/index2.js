var osm = L.tileLayer(
    // standart osm
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    // relief map
    // 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(55.86531828981331, 37.630534172058105), zoom: 16, maxZoom: 22}),
    moscow = L.latLng(37, 55);

L.control.scale().addTo(map);


// all rivers
var monRiversJson = L.geoJson(allrivers, {
    onEachFeature: function (feature, layer) {
         if (feature.properties && feature.properties.ID) {
             layer.bindPopup(feature.properties.ID);
        }
    }
})
// .addTo(map);

// my rivers
var finalRiversJson = L.geoJson(somerivers, {
    onEachFeature: each
})
// .addTo(map);

function each(feature, layer) {
    var river = L.river(feature.geometry.coordinates, {
        // color: '#8086fc', weight: 1, fillColor: '#97d2e3',
        weight: 0, fillColor: '#97d2e3',
        // weight: 0, fillColor: 'blue',
        // weight: 0, fillColor: 'white',
        fillOpacity: 0.5,
        // fillOpacity: 1,
        startWidth: 1,
        // endWidth: feature.properties.length / 400
    });
    var length = river.getLength();

    river.setEndWidth(length / 200);
    river.addTo(map);
}

map.setView(L.latLng(48.94117458931808, 100.14906196594238), 8);
