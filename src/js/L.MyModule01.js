L.River = L.Path.extend({
    initialize: function (latlngs, options) {
        L.setOptions(this, options);
        this._setLatLngs(latlngs);
    },

});

L.river = function (args) {
    return new L.River(args);
};
