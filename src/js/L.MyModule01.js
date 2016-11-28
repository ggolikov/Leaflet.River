L.River = L.Polygon.extend({
    initialize: function (latlngs, options) {
        L.Polygon.prototype.initialize.call(this, latlngs, options);
        this._setPoints(this._latlngs[0]);
    },

    onAdd: function (map) {
        this._getProjectedPoints(map);
        this._interpolateLength();
        this._countOffset();
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

    _setPoints: function(latlngs) {
        var points = [],
            polygonLL = [];

        for (var i = 0; i < latlngs.length; i++) {
            points.push({
                id: i,
                lat: latlngs[i].lat,
                lng: latlngs[i].lng,
                _latlng: L.latLng(latlngs[i].lat, latlngs[i].lng),
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
        this._latlngs = polygonLL;
    },

    _getProjectedPoints: function(map) {
        var points = this._points;

        for (var i = 0; i < points.length; i++) {
            points[i].projected = map.options.crs.project(points[i]._latlng);
            points[i].x = points[i].projected.x;
            points[i].y = points[i].projected.y;
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
            length1, length2, length3,
            vector1, vector2, vector3,
            vectorsSumPoint,
            ortVector1, ortVector2, ortVector3,
            ortLength,
            rVector, virtualVector,
            bVector1, bVector2,
            bPoint1, bPoint2,
            pos, lr,
            coss,
            endPoints,
            r;

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
            vector3 = addVectors(vector1, vector2);
            vectorsSumPoint = findVectorCoords(cur, vector3);

            length3 = findVectorLength(cur, vectorsSumPoint);
            length1 = findLength(cur, prev);
            length2 = findLength(cur, next);

            if (length3) {
                // ort-vectors
                ortVector1 = divideVector(vector1, length1);
                ortVector2 = divideVector(vector2, length2);

                // ort-vector3
                ortVector3 = addVectors(ortVector1, ortVector2);

                ortPoint = findVectorCoords(cur, ortVector3);
                ortLength = findVectorLength(cur, ortPoint);

                // ort-angles
                coss = findVectorCos(ortVector3, ortLength);
                bVector1 = findVectorfromOrts(coss, r);

            // handle 180 degrees angle
            // this builds a purpendicular to the segment
            } else {
                // custom value to find purpendicular vectorsSumPoint
                // we find y from in vector scalar product
                var CUSTOM_X = 100;
                
                vector2 = {x: CUSTOM_X, y: - (vector1.x * CUSTOM_X) / vector1.y};
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

            var j = points.length  + points.length - i;

            // collection of points
            this._latlngs.push(
                {id: i+1, latLng: cur.llb},
                {id: j, latLng: cur.llb2}
            );
        }

        this._latlngs.sort(function(a, b){
            return a.id - b.id;
        });

        this._latlngs = this._latlngs.map(function(obj){
            return obj.latLng;
        });
    }
});

L.river = function (latlngs, options) {
    return new L.River(latlngs, options);
};
