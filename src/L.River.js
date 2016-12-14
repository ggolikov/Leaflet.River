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
            polygon,
            polygonGeoJson;

        // one segment river is senceless
        if (points.length === 2) {
            return;
        }


        for (var i = 1; i <= 369; i++) {
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

            // L.polyline([cur.llb, cur.llb2], {color: 'red'}).addTo(map);

            // building polygon
            // from the stsrt point to the end
            if (i === 1) {
                polygon = L.polygon([this._startPoint, cur.llb, cur.llb2], {fillColor: 'yellow', fillOpacity: 0.1}).addTo(map);
                polygonGeoJson = polygon.toGeoJSON();
                this._polys.push(polygonGeoJson);
            } else {
                var prevSegment = {point1: prev.bisectorPoint, point2: prev.bisectorPoint2},
                    curSegment = {point1: cur.bisectorPoint, point2: cur.bisectorPoint2},
                    intersects = L.Util.checkIntersection(prevSegment, curSegment);

                    if (intersects) {
                        polygon = L.polygon([prev.llb, cur.llb, prev.llb2, cur.llb2], {fillColor: 'yellow', fillOpacity: 0.1})//.addTo(map);
                        polygonGeoJson = polygon.toGeoJSON();
                    } else {
                        polygon = L.polygon([prev.llb2, prev.llb, cur.llb, cur.llb2], {fillColor: 'yellow', fillOpacity: 0.1})//.addTo(map);
                        polygonGeoJson = polygon.toGeoJSON();
                    }

                    if (i === 367) {
                        polygon.setStyle({
                            color: 'yellow',
                            fillColor: 'yellow'
                        }).addTo(map);
                        // L.polyline([cur.llb, cur.llb2], {color: 'red'}).addTo(map);

                    }

                    if (i === 368) {
                        polygon.setStyle({
                            color: 'green',
                            fillColor: 'green'
                        }).addTo(map);
                        // L.polyline([cur.llb, cur.llb2], {color: 'red'}).addTo(map);

                    }

                    if (i === 369) {

                        polygon = L.polygon([prev.llb, prev.llb2, cur.llb,  cur.llb2], {fillColor: 'yellow', fillOpacity: 0.1})//.addTo(map);
                        polygonGeoJson = polygon.toGeoJSON();
                        polygon.setStyle({
                            color: 'red',
                            fillColor: 'red'
                        }).addTo(map);
                        var warnStyle1 = {
                            fillColor: 'red',
                            radius: 10
                        };

                        var warnStyle2 = {
                            fillColor: 'orange',
                            radius: 4
                        };

                        var prevStyle = {
                            fillColor: 'blue',
                            radius: 10
                        };

                        var curStyle = {
                            fillColor: 'green',
                            radius: 10
                        };

                        // var warn1 = L.latLng([48.877105846724376, 99.93987257947543]);
                        // var warn2 = L.latLng([48.87600398315773, 99.94012480197676]);
                        // var warn3 = L.latLng([48.88999387797361, 99.93692243975103]);
                        // var warn4 = L.latLng([48.87600398315773, 99.94012480197676]);

                        // L.circleMarker(warn1, warnStyle1).bindPopup('1').addTo(map);
                        // L.circleMarker(warn2, warnStyle1).bindPopup('2').addTo(map);
                        // L.circleMarker(warn3, warnStyle1).bindPopup('3').addTo(map);
                        // L.circleMarker(warn4, warnStyle1).bindPopup('4').addTo(map);

                        // var warn5 = L.latLng([48.877105846724376, 99.93987257947543]);
                        // var warn6 = L.latLng([48.87600398315773, 99.94012480197676]);
                        // var warn7 = L.latLng([48.88999387797361, 99.93692243975103]);
                        // var warn8 = L.latLng([48.87710584672436, 99.93987257947545]);

                        // L.circleMarker(warn5, warnStyle2).bindPopup('5').addTo(map);
                        // L.circleMarker(warn6, warnStyle2).bindPopup('6').addTo(map);
                        // L.circleMarker(warn7, warnStyle2).bindPopup('7').addTo(map);
                        // L.circleMarker(warn8, warnStyle2).bindPopup('8').addTo(map);

                        map.setView(polygon.getCenter(), 15);

                        L.circleMarker(prev.llb, prevStyle).bindPopup('prev.llb').addTo(map);
                        L.circleMarker(prev.llb2, prevStyle).bindPopup('prev.llb2').addTo(map);
                        L.circleMarker(cur.llb, curStyle).bindPopup('cur.llb').addTo(map);
                        L.circleMarker(cur.llb2, curStyle).bindPopup('cur.llb2').addTo(map);

                        // L.polyline([cur.llb, cur.llb2], {color: 'red'}).addTo(map);
                        // L.polyline([prev.llb, prev.llb2], {color: 'red'}).addTo(map);


                        console.log([prev.llb2.lng, prev.llb2.lat]);
                        // console.log([cur.llb2.lng, cur.llb2.lat]);

                    }
                // turf
                // this._polys[0] = union(this._polys[0], polygon);
                // martinez
                // var uni =
                this._polys[0].geometry.coordinates = union(this._polys[0].geometry.coordinates, polygonGeoJson.geometry.coordinates, 1);
            }
        }

        this._polys[0].geometry.coordinates.forEach(function(arr) {
            console.log(arr);
            arr.forEach(function(value, index, array){
                // L.circleMarker(L.latLng([value[1], value[0]]), prevStyle).bindPopup('#' + index).addTo(map);
            })
        })

        var lls = [];
        this._pol = L.geoJson(this._polys[0], {
            onEachFeature: function(feature, layer) {
                lls = layer._latlngs;
            }
        });
        this._latlngs = lls[0];
    }
});

L.river = function (latlngs, options) {
    return new L.River(latlngs, options);
};
