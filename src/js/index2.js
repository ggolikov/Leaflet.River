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

var rivers = [
    river1,
    river2,
    river3,
    river4,
    river5,
    river6,
    river7,
    river8,
    river9,
    river10,
    river11,
    river12,
    river13,
    river14,
    river15
];

rivers.forEach(function(river){
    river.forEach(function(arr){
        arr.reverse();
    })
});

// broken
L.river(river1, {
    color: '#97d2e3', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 3000
})
.addTo(map);


L.river(river3, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 1000
})
.addTo(map);

L.river(river4, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 1000
})
.addTo(map);

L.river(river5, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 1000
})
.addTo(map);

// broken
L.river(river6, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 1000
})
.addTo(map);

L.river(river7, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 1000
})
.addTo(map);

L.river(river8, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 700
})
.addTo(map);

L.river(river9, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 700
})
.addTo(map);

L.river(river10, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 700
})
.addTo(map);

L.river(river11, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 700
})
.addTo(map);

L.river(river12, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 600
})
.addTo(map);

L.river(river13, {
    color: '#97d2e3', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 600
})
.addTo(map);

L.river(river14, {
    color: '#97d2e3', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 1000
})
.addTo(map);

L.river(river15, {
    color: '#97d2e3', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 1000
})
.addTo(map);

// main
var mainRiver = L.river(river2, {
    color: '#8086fc', weight: 1, fillColor: '#97d2e3',
    fillOpacity: 1,
    startWidth: 1,
    endWidth: 3000
})
.addTo(map);

map.fitBounds(L.polyline(river2).getBounds());
