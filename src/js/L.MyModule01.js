L.River = L.Polyline.extend({
    initialize: function (latlngs, options) {
        L.Polyline.prototype.initialize.call(this, latlngs, options);
        this._setPoints(this._latlngs);
        // L.setOptions(this, options);
    },
    _setPoints: function(latlngs) {
        var points = [],
            map = this._map;
            // console.log(map);

        for (var i = 0; i < latlngs.length; i++) {
            points.push({
                id: i,
                lat: latlngs[i].lat,
                lng: latlngs[i].lng,
                // _map: this._map,
                _latlng: L.latLng(latlngs[i].lat, latlngs[i].lng),
                _point: null,
                _radius: null,
                _radiusY: null,
                // projected: map.options.crs.project(latlngs[i]),
                // x: map.options.crs.project(latlngs[i]).x,
                // y: map.options.crs.project(latlngs[i]).y,
                milestone: null,
                percent: null,
                _mRadius: null,
                ll1: null,
                ll2: null,
                ll3: null,
                ll4: null
            });
        }

        this._points = points;
    }
    // onAdd: function (map) {
    //     L.Polyline.prototype.onAdd.call(this, map);
    // }
});

L.river = function (latlngs, options) {
    return new L.River(latlngs, options);
};
