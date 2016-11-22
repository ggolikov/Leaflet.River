L.River = L.Polyline.extend({
    // initialize: function (latlngs, options) {
    //     L.setOptions(this, options);
    //     // this._setLatLngs(latlngs);
    // },
    // onAdd: function (map) {
    //     L.Polyline.prototype.onAdd.call(this, map);
    // }
});

L.river = function (latlngs, options) {
    return new L.River(latlngs, options);
};
