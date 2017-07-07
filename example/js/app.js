var L = global.L || require('leaflet');
require('../../index.js');
var testRivers = require('./data/testriver.js');
// var testRivers = require('./data/ns.js');

var osm = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    otm = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	   maxZoom: 17,
	   attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
   }),

    // map
    map = new L.Map('map', {
        layers: [
            osm
            // otm
        ],
        center: new L.LatLng(48.935130721045326, 100.22),
        zoom: 8,
        maxZoom: 22,
        closePopupOnClick: false
    }),
    // test rivers
    rivers = L.geoJson(testRivers, {
        onEachFeature: onEachFeature
    });

    var minInput = document.getElementById('mininput'),
        maxInput = document.getElementById('maxinput'),
        minValue = document.getElementById('minvalue'),
        maxValue = document.getElementById('maxvalue');

function onEachFeature(feature, layer) {
    var latLngs = L.GeoJSON.coordsToLatLngs(feature.geometry.coordinates);
        window.river = L.river(latLngs, {
            weight: 1,
            color: '#A3DDE8',
            fillOpacity: 0.5
        }).addTo(map);
        var b = layer.getBounds();

        // window.river = river;
        river.on('click', function (e) {
            var _this = this;
            this.eachLayer(function (l) {
                l.setStyle({color: 'yellow'});
            })

            minInput.value = river.options.minWidth;
            maxInput.value = river.options.maxWidth;
            console.log(minValue);
            minInput.oninput = function (e) {
                _this.setMinWidth(Number(e.target.value));
                minValue.innerHTML = e.target.value;
            }
            maxInput.oninput = function (e) {
                _this.setMaxWidth(Number(e.target.value));
                maxValue.innerHTML = e.target.value;
            }
        })
}
