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

    _createPolygon: function() {
        var points = this._points,
            length1, length2, length3,
            ortVector1, ortVector2, ortVector3,
            bVector1, bVector2,
            bPoint1, bPoint2,
            pos, lr,
            coss,
            r;

        this._latlngs.push(
            {id: 0, latLng: points[0]._latlng}
        );

        for (var i = 0; i < points.length - 2; i++) {
            r = points[i+1].offset / Math.cos((Math.PI*points[i+1].lat)/180);

            length1 = findLength(points[i+1], points[i]);
            length2 = findLength(points[i+1], points[i+2]);

            // vector1 && vector2 have to be ort-vectors
            ortVector1 = divideVector(convertToVector(points[i+1], points[i]), length1);
            ortVector2 = divideVector(convertToVector(points[i+1], points[i+2]), length2);

            // ort-vector3
            ortVector3 = addVectors(ortVector1, ortVector2);

            ortPoint = findVectorCoords(points[i+1], ortVector3);
            length3 = findVectorLength(points[i+1], ortPoint);

            // ort-angles
            coss = findVectorCos(ortVector3, length3);

            //
            bVector1 = findVectorfromOrts(coss, r);
            bVector2 = multipleVector(bVector1, -1)
            bPoint1 = findVectorCoords(points[i+1], bVector1);
            bPoint2 = findVectorCoords(points[i+1], bVector2);

            lr = findOrientation(points[i], points[i+1], bPoint1);

            if (lr) {
                var temp = {x: bPoint1.x, y: bPoint1.y};

                bPoint1 = bPoint2;
                bPoint2 = temp;
            }

            points[i+1].bisectorPoint = L.point(bPoint1.x, bPoint1.y);
            points[i+1].bisectorPoint2 = L.point(bPoint2.x, bPoint2.y);

            points[i+1].llb = map.options.crs.unproject(points[i+1].bisectorPoint);
            points[i+1].llb2 = map.options.crs.unproject(points[i+1].bisectorPoint2);

            var j = points.length  + points.length - i;

            this._latlngs.push(
                {id: i+1, latLng: points[i+1].llb},
                {id: j, latLng: points[i+1].llb2}
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
