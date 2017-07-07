/*
* @class River
* @aka L.River
* @inherits LayerGroup
*
* A class for drawing polygon overlays on a map. Extends `LayerGroup`.
 */

L.River = L.LayerGroup.extend({
    options: {
        weight: 5
    },

    initialize: function (latLngs, options) {
        L.LayerGroup.prototype.initialize.call(this, [], options);
        this._latLngs = latLngs;

        L.Util.setOptions(this, options);

        this._buildLines(latLngs);
    },

    onAdd: function (map) {
        this._calculateLength(map);

        this._setStyle();

        L.LayerGroup.prototype.onAdd.call(this, map);
    },

    _buildLines: function (latLngs) {
        for (var i = 0; i < latLngs.length - 1; i++) {
            var line = L.polyline([latLngs[i], latLngs[i+1]]);

            this.addLayer(line);
        }
    },

    _calculateLength: function (map) {
        var latLngs = this._latLngs,
            totalLength = 0;

        for (var i = 0; i < latLngs.length - 1; i++) {
            totalLength += map.distance(latLngs[i], latLngs[i+1]);
        }

        return this._length = totalLength;
    },

    _setStyle: function (style) {

        this.options = L.extend(this.options, style);

        var opt = this.options,
            totalLength = this._length,
            map = this._map,
            layers = this._layers,
            length = 0,
            layer, latLngs;

        for (var key in layers) {
            layer = layers[key];
            latLngs = layer.getLatLngs();
            length += map.distance(latLngs[0], latLngs[1]);

            layer.setStyle(L.extend({}, opt, {
                color: 'black',
                weight: length / 100000 * opt.weight
            }));
        }
    },

    /* pubic interface */
    setStartWidth: function (width) {
        this._setStyle({
            weight: width
        })
    }
});

L.river = function (latLngs, options) {
    return new L.River(latLngs, options);
};
