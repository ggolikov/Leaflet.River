/*
* @class River
* @aka L.River
* @inherits LayerGroup
*
* A class for drawing 'flowing' ploylines. Extends `LayerGroup`.
 */

L.River = L.FeatureGroup.extend({
    options: {
        minWidth: 1,
        maxWidth: 5
    },

    initialize: function (latLngs, options) {
        L.FeatureGroup.prototype.initialize.call(this, [], options);
        this._latLngs = latLngs;

        L.Util.setOptions(this, options);

        this._buildLines(latLngs);
    },

    onAdd: function (map) {
        L.FeatureGroup.prototype.onAdd.call(this, map);

        this._getLength(map);

        this._setStyle();
    },

    _buildLines: function (latLngs) {
        for (var i = 0; i < latLngs.length - 1; i++) {
            var line = L.polyline([latLngs[i], latLngs[i+1]]);

            this.addLayer(line);
        }
    },
    // ll's
    _getLength: function (map) {
        var latLngs = this._latLngs,
            totalLength = 0;

        for (var i = 0; i < latLngs.length - 1; i++) {
            totalLength += map.distance(latLngs[i], latLngs[i+1]);
        }

        return this._length = totalLength;
    },
    // points
    // _getLength: function (map) {
    //     var totalLength = 0;
    //
    //     this._points = this._latLngs.map(function (ll) {return map.latLngToLayerPoint(ll)});
    //
    //     for (var i = 0; i < this._points.length - 1; i++) {
    //         totalLength += this._points[i].distanceTo(this._points[i+1]);
    //     }
    //
    //     return this._length = totalLength;
    // },
    _setStyle: function (style) {
        this.options = L.extend(this.options, style);

        var opt = this.options,
            totalLength = this._length,
            map = this._map,
            layers = this._layers,
            points = this._points,
            length = 0,
            layer, latLngs;

        for (var key in layers) {
            layer = layers[key];
            latLngs = layer.getLatLngs();
            // points = latLngs.map(function (ll) {return map.latLngToLayerPoint(ll)});
            length += map.distance(latLngs[0], latLngs[1]);
            // length += points[0].distanceTo(points[1]);

            var percent = length / totalLength;
            var w = opt.minWidth + (opt.maxWidth * percent);

            layer.setStyle(L.extend({}, opt, {
                // color: 'black',
                weight: opt.minWidth + (opt.maxWidth - opt.minWidth) * percent
            }));
        }
    },

    /* pubic interface */
    setMinWidth: function (width) {
        this._setStyle({
            minWidth: width
        })
    },

    setMaxWidth: function (width) {
        this._setStyle({
            maxWidth: width
        })
        console.log('min');
        console.log(this.options.minWidth);
        console.log('max');
        console.log(this.options.maxWidth);
    }
});

L.river = function (latLngs, options) {
    return new L.River(latLngs, options);
};
