/*
* @class River
* @aka L.River
* @inherits Polygon
*
* A class for drawing polygon overlays on a map. Extends `Polygon`.
 */
// var union = require('turf-union');
var union = require('martinez-polygon-clipping');

L.River = L.Polygon.extend({
    initialize: function (latlngs, options) {
        L.Polygon.prototype.initialize.call(this, latlngs, options);
        this._setPoints(this._latlngs[0]);
    },

    onAdd: function (map) {
        L.Polygon.prototype.onAdd.call(this, map);
        this._getProjectedPoints(map);
        this._interpolateLength(map);
        this._countOffset();
        // console.time('createPolygon');
        this._createPolygon(map);
        // console.timeEnd('createPolygon');
    },

    // conversion method
    convertToPolyline: function(options) {
        var points = this._points,
            latlngs = [];

        for (var i = 0; i < points.length; i++) {
            latlngs.push(points[i].latlng);
        }

        return L.polyline(latlngs, options);
    },

    // useful when you bulk load data (e.g. from geojson)
    // without length property
    getLength: function() {
        var points = this._points,
            length = points[points.length-1].milestone;

        return length;
    },

    setStartWidth: function(startWidth) {
        this.options.startWidth = startWidth;
        this._countOffset();

		return this;
    },

    setEndWidth: function(endWidth) {
        this.options.endWidth = endWidth;
        this._countOffset();

		return this;
    },

    getStartWidth: function() {
        return this.options.startWidth;
    },

    getEndWidth: function() {
        return this.options.endWidth;
    },

    _setPoints: function(latlngs) {
        var points = [],
            startPoint = L.latLng(latlngs[0].lat, latlngs[0].lng),
            pol,
            polys = [];

        for (var i = 0; i < latlngs.length; i++) {
            points.push({
                id: i,
                latlng: latlngs[i],
                projected: null,
                x: null,
                y: null,
                milestone: null,
                percent: null,
                offset: null,
                bisectorPoint: null,
                bisectorPoint2: null,
                llb: null,
                llb2: null
            });
        }

        this._points = points;
        this._startPoint = startPoint;
        this._pol = pol;
        this._polys = polys;
        this._latlngs = [];
    },

    _getProjectedPoints: function(map) {
        var points = this._points;

        for (var i = 0; i < points.length; i++) {
            var projectedPoint = map.options.crs.project(points[i].latlng);

            points[i].x = projectedPoint.x;
            points[i].y = projectedPoint.y;
        }
    },

    // counting milestones in meters on every vertex on polyline
    _interpolateLength: function(map) {
        var points = this._points,
            totalLength = points[0].milestone = 0;

        for (var i = 0; i < points.length - 1; i++) {
            var length = map.distance(points[i].latlng, points[i+1].latlng);

            totalLength += length;
            points[i+1].milestone = totalLength;
        }
    },

    // count percentage
    _countOffset: function() {
        var points = this._points,
            options = this.options,
            start = options.startWidth || 1,
            end = options.endWidth || 1,
            interval = end - start,
            totalLength = points[points.length-1].milestone;

        points.forEach(function(point){
            point.percent = point.milestone / totalLength;
            point.offset = start + point.percent * interval;
        });
    },

    // creating polygon from initial latlngs;
    _createPolygon: function(map) {
        var points = this._points,
            prev, cur, next,
            length1, length2,
            vector1, vector2,
            ortVector1, ortVector2, ortVector3,
            ortPoint,
            ortLength,
            rVector, virtualVector,
            bVector1, bVector2,
            bPoint1, bPoint2,
            lr,
            cosines,
            r,
            polygon;

        // one segment river is senceless
        if (points.length === 2) {
            return;
        }


        for (var i = 1; i <= points.length - 1; i++) {
            prev = points[i-1];
            cur = points[i];
            r = cur.offset / Math.cos((Math.PI*cur.latlng.lat)/180);

            if (i < points.length - 1) {
                next = points[i+1];

            // in case of last point,
            // we have to build purpendicular to that point
            } else {
                rVector = L.Util.convertToVector(prev, cur),

                // this point lies on the extention of last segment
                virtualVector = L.Util.multipleVector(rVector, 2),
                next = L.Util.findVectorCoords(prev, virtualVector);
            }

            // we add two vectors from the current point
            // there are 2 cases: the angle between them is Math.PI * n or not
            // if the length of vector sum is > 0,
            // then we use bisector angle
            // else we use a purpendicular
            vector1 = L.Util.convertToVector(cur, prev);
            vector2 = L.Util.convertToVector(cur, next);

            length1 = L.Util.findLength(cur, prev);
            length2 = L.Util.findLength(cur, next);

            ortVector1 = L.Util.divideVector(vector1, length1);
            ortVector2 = L.Util.divideVector(vector2, length2);

            // ort-vector3
            ortVector3 = L.Util.addVectors(ortVector1, ortVector2);

            ortPoint = L.Util.findVectorCoords(cur, ortVector3);
            ortLength = L.Util.findLength(cur, ortPoint);

            if (ortLength) {
                // ort-vectors

                // ort-angles
                cosines = L.Util.findVectorCosines(ortVector3, ortLength);
                bVector1 = L.Util.findVectorfromOrts(cosines, r);

            // handle 180 degrees angle
            // this builds a purpendicular to the segment
            } else {
                // custom value to find purpendicular vectorsSumPoint
                // we find y from in vector scalar product
                var CUSTOM_COORD = 100;

                if (vector1.y) {
                    vector2 = {x: CUSTOM_COORD, y: - (vector1.x * CUSTOM_COORD) / vector1.y};
                } else {
                    vector2 = {x: vector1.x, y: CUSTOM_COORD}
                }
                next = L.Util.findVectorCoords(cur, vector2);
                length2 = L.Util.findLength(cur, next);
                bVector1 = L.Util.multipleVector(vector2, r / length2);
            }

            bVector2 = L.Util.multipleVector(bVector1, -1)
            bPoint1 = L.Util.findVectorCoords(cur, bVector1);
            bPoint2 = L.Util.findVectorCoords(cur, bVector2);

            // we check position of a point
            // left  or right from the segment
            lr = L.Util.findOrientation(prev, cur, bPoint1);

            // because we have to collect points from the left side of the river first
            if (lr) {
                var temp = {x: bPoint1.x, y: bPoint1.y};
                bPoint1 = bPoint2;
                bPoint2 = temp;
            }

            cur.bisectorPoint = L.point(bPoint1.x, bPoint1.y);
            cur.bisectorPoint2 = L.point(bPoint2.x, bPoint2.y);

            cur.llb = map.options.crs.unproject(cur.bisectorPoint);
            cur.llb2 = map.options.crs.unproject(cur.bisectorPoint2);

            // building polygon
            // from the stsrt point to the end
            if (i === 1) {
                polygon = L.polygon([this._startPoint, cur.llb, cur.llb2], {fillOpacity: 0.1}).toGeoJSON();
                this._polys.push(polygon);
            } else {
                var prevSegment = {point1: prev.bisectorPoint, point2: prev.bisectorPoint2},
                    curSegment = {point1: cur.bisectorPoint, point2: cur.bisectorPoint2},
                    intersects = L.Util.checkIntersection(prevSegment, curSegment);

                    if (intersects) {
                        polygon = L.polygon([prev.llb, cur.llb, prev.llb2, cur.llb2], {fillOpacity: 1}).toGeoJSON();
                    } else {
                        polygon = L.polygon([prev.llb2, prev.llb, cur.llb, cur.llb2], {fillOpacity: 1}).toGeoJSON();
                    }
                // turf
                // this._polys[0] = union(this._polys[0], polygon);
                // martinez
                this._polys[0].geometry.coordinates = union(this._polys[0].geometry.coordinates, polygon.geometry.coordinates, 1);
            }
        }

        var lls = [];
        this._pol = L.geoJson(this._polys[0], {
            onEachFeature: function(feature, layer) {
                lls = layer._latlngs;
            }
        });
        this._latlngs = lls[0];
        console.log(this._points.length);
    }
});

L.river = function (latlngs, options) {
    return new L.River(latlngs, options);
};
