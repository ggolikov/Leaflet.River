L.River = L.Polygon.extend({
    initialize: function (latlngs, options) {
        L.Polygon.prototype.initialize.call(this, latlngs, options);
        this._setPoints(this._latlngs[0]);
        this._interpolateLength();
        this._countOffset();
    },

    onAdd: function (map) {
        this._getProjectedPoints(map);
        this._createPolygon();
        L.Polygon.prototype.onAdd.call(this, map);
    },

    // conversion method
    convertToPolyline: function(options) {
        var points = this._points,
            latlngs = [];

        for (var i = 0; i < points.length; i++) {
            latlngs.push(points[i]._latlng);
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
    },

    setEndWidth: function(endWidth) {
        this.options.endWidth = endWidth;
        this._countOffset();
    },

    getStartWidth: function() {
        return this.options.startWidth;
    },

    getEndWidth: function() {
        return this.options.endWidth;
    },

    _setPoints: function(latlngs) {
        var points = [],
            startPoint = latlngs[0].clone(),
            pol,
            polys = [];
            polygonLL = [];

        for (var i = 0; i < latlngs.length; i++) {
            points.push({
                id: i,
                lat: latlngs[i].lng,
                lng: latlngs[i].lat,
                _latlng: L.latLng(latlngs[i].lng, latlngs[i].lat),
                _point: null,
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
        this._latlngs = polygonLL;
    },

    _getProjectedPoints: function(map) {
        var points = this._points;

        for (var i = 0; i < points.length; i++) {
            var projectedPoint = map.options.crs.project(points[i]._latlng);

            points[i].x = projectedPoint.x;
            points[i].y = projectedPoint.y;
        }
    },

    // counting milestones in meters on every vertex on polyline
    _interpolateLength: function() {
        var points = this._points,
            totalLength = points[0].milestone = 0;

        for (var i = 0; i < points.length - 1; i++) {
            var length = map.distance(points[i]._latlng, points[i+1]._latlng);

            totalLength += length;
            points[i+1].milestone = totalLength;
        }
    },

    // count percentage
    _countOffset: function() {
        var points = this._points,
            start = this.options.startWidth,
            end = this.options.endWidth,
            interval = end - start,
            totalLength = points[points.length-1].milestone;

        points.forEach(function(point){
            point.percent = point.milestone / totalLength;
            point.offset = start + point.percent * interval;
        });
    },

    // creating polygon from initial latlngs;
    _createPolygon: function() {
        var points = this._points,
            prev, cur, next,
            length1, length2,
            vector1, vector2,
            ortVector1, ortVector2, ortVector3,
            ortLength,
            rVector, virtualVector,
            bVector1, bVector2,
            bPoint1, bPoint2,
            pos, lr,
            coss,
            endPoints,
            r;

        // one segment river is senceless
        if (points.length === 2) {
            return;
        }


        for (var i = 1; i <= points.length - 1; i++) {
            prev = points[i-1];
            cur = points[i];
            r = cur.offset / Math.cos((Math.PI*cur.lat)/180);

            if (i < points.length - 1) {
                next = points[i+1];

            // in case of last point,
            // we have to build purpendicular to that point
            } else {
                rVector = convertToVector(prev, cur),

                // this point lies on the extention of last segment
                virtualVector = multipleVector(rVector, 2),
                next = findVectorCoords(prev, virtualVector);
            }

            // we add two vectors from the current point
            // there are 2 cases: the angle between them is Math.PI * n or not
            // if the length of vector sum is > 0,
            // then we use bisector angle
            // else we use a purpendicular
            vector1 = convertToVector(cur, prev);
            vector2 = convertToVector(cur, next);

            length1 = findLength(cur, prev);
            length2 = findLength(cur, next);

            ortVector1 = divideVector(vector1, length1);
            ortVector2 = divideVector(vector2, length2);

            // ort-vector3
            ortVector3 = addVectors(ortVector1, ortVector2);

            ortPoint = findVectorCoords(cur, ortVector3);
            ortLength = findVectorLength(cur, ortPoint);

            if (ortLength) {
                // ort-vectors

                // ort-angles
                coss = findVectorCos(ortVector3, ortLength);
                bVector1 = findVectorfromOrts(coss, r);

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
                next = findVectorCoords(cur, vector2);
                length2 = findLength(cur, next);
                bVector1 = multipleVector(vector2, r / length2);
            }

            bVector2 = multipleVector(bVector1, -1)
            bPoint1 = findVectorCoords(cur, bVector1);
            bPoint2 = findVectorCoords(cur, bVector2);

            // we check position of a point
            // left  or right from the segment
            lr = findOrientation(prev, cur, bPoint1);

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

            var markersOptions = {
                weight: 1,
                radius: 1,
                color: 'black',
                fill: true,
                fillColor: 'yellow',
                fillOpacity: 0.8
            };

            // L.circleMarker(cur.llb, markersOptions).addTo(map);
            // L.circleMarker(cur.llb2, markersOptions).addTo(map);
            // L.polyline([cur.llb, cur.llb2], {color: 'red', weight: 0.8}).addTo(map);

            var j = points.length  + points.length - i;

            if (i === 1) {
                var polygon = L.polygon([this._startPoint, cur.llb, cur.llb2], {fillOpacity: 0.1}).toGeoJSON();
                this._polys.push(polygon);
            } else {
                var prevSegment = {point1: prev.bisectorPoint, point2: prev.bisectorPoint2},
                    curSegment = {point1: cur.bisectorPoint, point2: cur.bisectorPoint2},
                    intersects = checkIntersection(prevSegment, curSegment);

                    if (intersects) {
                        var polygon = L.polygon([prev.llb, cur.llb, prev.llb2, cur.llb2], {fillOpacity: 0.1}).toGeoJSON();
                    } else {
                        var polygon = L.polygon([prev.llb2, prev.llb, cur.llb, cur.llb2], {fillOpacity: 1}).toGeoJSON();
                    }
                if (i > 576) {
                    debugger;

                    console.log(JSON.stringify(polygon));
                }
                this._polys[0] = turf.union(this._polys[0], polygon);
            }
        }

            // collection of points
            // this._latlngs.push(
            //     {id: i+1, latLng: cur.llb},
            //     {id: j, latLng: cur.llb2}
            // );
        // }
        //
        // this._latlngs.sort(function(a, b){
        //     return a.id - b.id;
        // });
        //
        // this._latlngs = this._latlngs.map(function(obj){
        //     return obj.latLng;
        // });
        var _this = this;
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
