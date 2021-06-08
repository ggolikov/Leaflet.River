/*
* @class River
* @aka L.River
* @inherits FeatureGroup
*
* A class for drawing 'flowing' ploylines. Extends `FeatureGroup`.
 */

L.River = L.FeatureGroup.extend({
    options: {
        color: 'blue',
        minWidth: 1,
        maxWidth: 10,
        ratio: null
    },

    initialize: function (latLngs, options) {
        L.FeatureGroup.prototype.initialize.call(this, [], options);
        this._latLngs = latLngs;

        L.setOptions(this, options);
        this._buildLines(latLngs);
    },

    onAdd: function (map) {
        L.FeatureGroup.prototype.onAdd.call(this, map);
        this._getLength(map);
        this.setStyle();
    },

    _buildLines: function (latLngs) {
        for (var i = 0; i < latLngs.length - 1; i++) {
            var line = L.polyline([latLngs[i], latLngs[i+1]]);

            this.addLayer(line);
        }
    },

    _getLength: function (map) {
        var latLngs = this._latLngs,
            totalLength = 0;

        for (var i = 0; i < latLngs.length - 1; i++) {
            totalLength += map.latLngToLayerPoint(latLngs[i]).distanceTo(map.latLngToLayerPoint(latLngs[i+1]));
        }

        return this._length = totalLength;
    },

    /* pubic interface */
    setStyle: function (style) {
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
            length += map.latLngToLayerPoint(latLngs[0]).distanceTo(map.latLngToLayerPoint(latLngs[1]));

            var percent = length / totalLength;
            var w = opt.minWidth + (opt.maxWidth * percent);

            layer.setStyle(L.extend({}, opt, {
                weight: opt.ratio ? length / opt.ratio : opt.minWidth + (opt.maxWidth - opt.minWidth) * percent
            }));
        }
    },

    setMinWidth: function (width) {
        this.setStyle({
            minWidth: width
        })
    },

    setMaxWidth: function (width) {
        this.setStyle({
            maxWidth: width
        })
    },

    getMinWidth: function () {
        return this.options.minWidth;
    },

    getMaxWidth: function () {
        return this.options.maxWidth;
    },

    useLength: function (ratio) {
        L.setOptions(this, {ratio: ratio});
        return this;
    },

    convertToPolyline: function (options) {
        return L.polyline(this._latLngs, options);
    }
});

L.river = function (latLngs, options) {
    return new L.River(latLngs, options);
};
