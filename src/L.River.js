/*
* @class River
* @aka L.River
* @inherits Polygon
*
* A class for drawing polygon overlays on a map. Extends `Polygon`.
 */
// var union = require('turf-union');
var union = require('martinez-polygon-clipping');
var inside = require('point-in-polygon');
// var leafletPip = require('@mapbox/leaflet-pip');

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
    convertToPolyline: function (options) {
        var points = this._points,
            latlngs = [];

        for (var i = 0; i < points.length; i++) {
            latlngs.push(points[i].latlng);
        }

        return L.polyline(latlngs, options);
    },

    // useful when you bulk load data (e.g. from geojson)
    // without length property
    getLength: function () {
        var points = this._points,
            length = points[points.length-1].milestone;

        return length;
    },

    setStartWidth: function (startWidth) {
        this.options.startWidth = startWidth;
        this._countOffset();

		return this;
    },

    setEndWidth: function (endWidth) {
        this.options.endWidth = endWidth;
        this._countOffset();

		return this;
    },

    getStartWidth: function () {
        return this.options.startWidth;
    },

    getEndWidth: function () {
        return this.options.endWidth;
    },

    _setPoints: function (latlngs) {
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

    _getProjectedPoints: function (map) {
        var points = this._points;

        for (var i = 0; i < points.length; i++) {
            var projectedPoint = map.options.crs.project(points[i].latlng);

            points[i].x = projectedPoint.x;
            points[i].y = projectedPoint.y;
        }
    },

    // counting milestones in meters on every vertex on polyline
    _interpolateLength: function (map) {
        var points = this._points,
            totalLength = points[0].milestone = 0;

        for (var i = 0; i < points.length - 1; i++) {
            var length = map.distance(points[i].latlng, points[i+1].latlng);

            totalLength += length;
            points[i+1].milestone = totalLength;
        }
    },

    // count percentage
    _countOffset: function () {
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
    _createPolygon: function (map) {
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
            polygon,
            polygonGeoJson;

        var llbs = [],
            llb2s = [];

        var sweepPoints = [],
            sweepPoints2 = [];


        var sl = require('sweepline');


        var warnStyle1 = {
            fillColor: 'red',
            radius: 4
        };

        var warnStyle2 = {
            fillColor: 'orange',
            radius: 14
        };

        var prevStyle = {
            fillColor: 'blue',
            radius: 4
        };

        var curStyle = {
            fillColor: 'green',
            radius: 4
        };

        // one segment river is senceless
        if (points.length === 2) {
            return;
        }

        var start = points[0];
        start.sweepPoint = new sl.Point(start.x, start.y);
        console.log(start);

        sweepPoints.push(start.sweepPoint);

        for (var i = 1; i < points.length; i++) {
            prev = points[i-1];
            cur = points[i];
            r = cur.offset / Math.cos((Math.PI * cur.latlng.lat)/180);

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

            cur.sweepPoint = new sl.Point(bPoint1.x, bPoint1.y);
            cur.sweepPoint2 = new sl.Point(bPoint2.x, bPoint2.y);

            cur.llb = map.options.crs.unproject(cur.bisectorPoint);
            cur.llb2 = map.options.crs.unproject(cur.bisectorPoint2);
            sweepPoints.push(cur.sweepPoint);
            sweepPoints2.unshift(cur.sweepPoint2);
            // llbs.push(cur.llb);
            // llb2s.push(cur.llb2);
            // console.log(cur);

            L.polyline([cur.llb, cur.llb2], {color: 'red'}).addTo(map);
            L.circleMarker(map.options.crs.unproject(cur), curStyle).addTo(map);
            L.circleMarker(cur.llb2, warnStyle1).addTo(map);

            // building polygon
            // from the stsrt point to the end

            // var geojson = [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]];
            // var ppoints  = geojson.map(function(pnt){ return new sl.Point(pnt[0],pnt[1]); });
            // var polygon = new sl.Polygon(ppoints);
            // var sweepLine = new sl.SweepLine(polygon);
            // console.log(polygon, sweepLine);
            if (i === 1) {
                // endPolygon.push(this._startPoint, cur.llb, cur.llb2);
            } else {
                var prevSegment = {point1: prev.bisectorPoint, point2: prev.bisectorPoint2},
                    curSegment = {point1: cur.bisectorPoint, point2: cur.bisectorPoint2},
                    intersects = L.Util.checkIntersection(prevSegment, curSegment);

                    if (intersects) {
                        endPolygon = [prev.llb, cur.llb, prev.llb2, cur.llb2];
                        // polygon = L.polygon([prev.llb, cur.llb, prev.llb2, cur.llb2], {fillColor: 'yellow', fillOpacity: 0.1})//.addTo(map);
                    } else {
                    }

                llb2s.push(cur.llb2);
            }
        }
        var sp = sweepPoints.concat(sweepPoints2, [start.sweepPoint]);
        var polygon = new sl.Polygon(sp);
        var sweepLine = new sl.SweepLine(polygon);
        var event_queue = new sl.EventQueue(polygon);
        var intersections = polygon.getIntersections();

        intersections = intersections.map(function(point){
            return map.options.crs.unproject(point);
        });

        intersections.forEach(function(ll){
            L.circleMarker(ll, warnStyle2).addTo(map);
        });
        console.log(intersections);
        // console.log(sweepLine);
        // console.log(event_queue);
        // while (ev = event_queue.events.shift()){
        //     sweepLine.add(ev);
        //     console.log(ev.edge + ':' + ev.type);
        // }
        console.log(sweepLine);
        console.log(event_queue);
        // console.log(polygon.simple_polygon());


        // this._latlngs = endPolygon;

        var line1 = L.polyline(llbs).addTo(map);
        var line2 = L.polyline(llb2s).addTo(map);
        // var  = L.polyline(llb2s).addTo(map);
    }
});

L.river = function (latlngs, options) {
    return new L.River(latlngs, options);
};
