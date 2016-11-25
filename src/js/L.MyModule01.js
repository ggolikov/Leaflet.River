L.River = L.Polyline.extend({
    initialize: function (latlngs, options) {
        L.Polyline.prototype.initialize.call(this, latlngs, options);
        this._setPoints(this._latlngs);
        // L.setOptions(this, options);
    },

    onAdd: function (map) {
        L.Polyline.prototype.onAdd.call(this, map);
        this._getProjectedPoints(map);
    },

    _setPoints: function(latlngs) {
        var points = [],
            polygonLL = [],
            plg = [];
            // map = this._map;
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
                projected: null,
                x: null,
                y: null,
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
        this.polygonLL = polygonLL;
        this.plg = plg;
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
    _countMileStones: function() {
        var points = this._points,
            totalLength = points[0].milestone = 0;

        for (var i = 0; i < points.length - 1; i++) {
            var length = map.distance(points[i]._latlng, points[i+1]._latlng);

            totalLength += length;
            points[i+1].milestone = totalLength;
        }
    },

    // count percentage
    _countPercentage: function() {
        var points = this._points,
            totalLength = points[points.length-1].milestone;

        points.forEach(function(point){
            point.percent = point.milestone / totalLength;
        });
    },

    // interpolate range
    _interpolateRange: function() {
        var points = this._points,
            interval = this.options.endWidth - this.options.startWidth;

        for (var i = 0; i < points.length; i++) {
            points[i]._mRadius = this.options.startWidth + points[i].percent * interval;
        }
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

        this.polygonLL.push(
            {id: 0, latLng: points[0]._latlng}
        );

        for (var i = 0; i < points.length - 2; i++) {
            r = points[i+1]._mRadius / Math.cos((Math.PI*points[i+1].lat)/180);

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

            this.polygonLL.push(
                {id: i+1, latLng: points[i+1].llb},
                {id: j, latLng: points[i+1].llb2}
            );
        }

        this.polygonLL.sort(function(a, b){
            return a.id - b.id;
        });

        this.plg = this.polygonLL.map(function(obj){
            return obj.latLng;
        });

    }

});

L.river = function (latlngs, options) {
    return new L.River(latlngs, options);
};
