var L = global.L || require('leaflet');
require('../../index.js');
var testRivers = require('./data/testrivers.js');

var osm = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    map = new L.Map('map', {
        layers: [
            osm
        ],
        center: new L.LatLng(48.88657146475083, 99.88243413924278),
        zoom: 8,
        maxZoom: 22,
        closePopupOnClick: false
    }),
    riverGroup = [],
    rivers = L.geoJson(testRivers, {
        onEachFeature: onEachFeature
    }),
    minInput = document.querySelector('.min-input'),
    maxInput = document.querySelector('.max-input'),
    minValue = document.querySelector('.min-value'),
    maxValue = document.querySelector('.max-value'),
    resetButton = document.querySelector('.reset');

for (var i = 0; i < riverGroup.length; i++) {
    var r = riverGroup[i];
    r.on('click', function (e) {
        var _this = this;

        clearRivers();

        minInput.removeAttribute('disabled');
        maxInput.removeAttribute('disabled');

        this.setStyle({color: 'yellow'});

        minInput.value = this.options.minWidth;
        minValue.innerHTML = this.options.minWidth;
        maxInput.value = this.options.maxWidth;
        maxValue.innerHTML = this.options.maxWidth;

        this.useLength(0);
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

resetButton.onclick = clearRivers;

function onEachFeature(feature, layer) {
    var latLngs = L.GeoJSON.coordsToLatLngs(feature.geometry.coordinates),
        river = L.river(latLngs, {
            /**
             * ratio
             * is used to draw the longest river in the demo data
             * 10px width at the end
             * use our own ratio depending on your own data
             */
            ratio: 145.7
        }).addTo(map);

    riverGroup.push(river);
}

function clearRivers() {
    for (var j = 0; j < riverGroup.length; j++) {
        var r2 = riverGroup[j];
        r2.setStyle({color: 'blue'});
    }
    minInput.setAttribute('disabled', true);
    maxInput.setAttribute('disabled', true);

    minInput.value = 1;
    maxInput.value = 1;

    minValue.innerHTML = 1;
    maxValue.innerHTML = 1;
}
