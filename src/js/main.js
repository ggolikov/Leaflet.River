require('leaflet-draw');
require('leaflet-snap');
require('leaflet-editable');
require('leaflet-geometryutil');

/*
** adding initHook to existing class
 */

L.Marker.addInitHook(initFunc2);

function initFunc2() {
    // console.log(this.options);
}

/*
** extending existing class
*/
console.log(L);
console.log(L);
L.MyMarker = L.Marker.extend({
    initialize: function (LatLng, options) {
        L.Marker.prototype.initialize.apply(this, arguments);
        console.log('My marker is created');
    },
    options: {
        draggable: true
    }
});

L.myMarker = function (latLng, options) {
    return new L.MyMarker(latLng, options);
};
