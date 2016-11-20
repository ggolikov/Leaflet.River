// var findLinearCoef = require('./findLinearCoef');
// var findOrientation = require('./findOrientation');
// var squareCircleSystem = require('./squareCircleSystem');
// var triangleSystem = require('./triangleSystem');
// var findSquareRoots = require('./findSquareRoots');

// require('./js/squareCircleSystem.js');
// require('./js/triangleSystem.js');
// require('./js/findOrientation.js');
// require('./js/findSquareRoots.js');

// var COEF = 1.337972467;
// var COEF = 794;

var osm = L.tileLayer(
    // standart osm
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    // relief map
    // 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(55.86531828981331, 37.630534172058105), zoom: 16, maxZoom: 22}),
    moscow = L.latLng(37, 55);

L.control.scale().addTo(map);

var circlesCentersOptions = {
    weight: 1,
    radius: 3,
    color: 'black',
    fill: true,
    fillColor: 'blue',
    fillOpacity: 0.8
};

var upperPointsOptions = {
    weight: 1,
    radius: 3,
    color: 'black',
    fill: true,
    fillColor: 'yellow',
    fillOpacity: 0.8
};

var rightPointsOptions = {
    weight: 1,
    radius: 3,
    color: 'black',
    fill: true,
    fillColor: 'green',
    fillOpacity: 0.8
};

// var coordinates = medvedkovo;
// var coordinates = los;
var coordinates = mongolia;
// var coordinates = world;

coordinates.forEach(function(ll){
    return ll.reverse();
});

var polygonLL = [];
// test polyline
var testRiver = L.polyline(coordinates, {color: 'blue', weight: 1, smooth: 3});
testRiver.addTo(map);

map.fitBounds(testRiver.getBounds());
// map.setZoom(14);
var startPoint = testRiver.getLatLngs()[0];

polygonLL.push(
    {id: 0, latLng: startPoint}
)

var widthRange = {
    startWidth: 0,
    endWidth: 1000
};

L.setOptions(testRiver, {
    points: setPoints(testRiver)
})

function setPoints(polyline) {
    var latLngs = polyline.getLatLngs(),
        points = [];

    for (var i = 0; i < latLngs.length; i++) {
        points.push({
            id: i,
            lat: latLngs[i].lat,
            lng: latLngs[i].lng,
            _map: map,
            _latlng: L.latLng(latLngs[i].lat, latLngs[i].lng),
            _point: null,
            _radius: null,
            _radiusY: null,
            projected: map.options.crs.project(latLngs[i]/*, map.getZoom()*/),
            x: null,
            y: null,
            milestone: null,
            percent: null,
            _mRadius: null,
            x: null,
            y: null,
            ll1: null,
            ll2: null,
            _updateBounds: function() {return;}
        });
    }

    return points;
}

/**
 * API
 */

// counting milestones in meters on every vertex on polyline
function countMileStones(polyline) {
    var points = polyline.options.points,
        totalLength = points[0].milestone = 0;

    for (var i = 0; i < points.length - 1; i++) {
        var length = map.distance(points[i]._latlng, points[i+1]._latlng);

        totalLength += length;
        points[i+1].milestone = totalLength;
    }
    return points;
}

// count percentage
function countPercentage(points) {
    var totalLength = points[points.length-1].milestone;

    points.forEach(function(point){
        point.percent = point.milestone / totalLength;
    });

    return points;
}

// interpolate range
function interpolateRange(points, range) {
    var interval = range.endWidth - range.startWidth;

    for (var i = 0; i < points.length; i++) {
        points[i]._mRadius = range.startWidth + points[i].percent * interval;
    }

    return points;
}

// draw end circles
function drawEndCircles(points) {
    for (var i = 1; i < points.length; i++) {
        var circle = L.circle(points[i]._latlng, {radius: points[i]._mRadius, color: 'red'}).bindPopup('id: ' + i).addTo(map);
    }
    return points;
}

// line equation
function getLineAndEndCircleIntersections(points) {
    var first, second,
        linearParams,
        a, b, c,
        x2, y2,
        r,
        squareParams,
        roots,
        res1 = {
            x: null,
            y: null
        },
        res2 = {
            x: null,
            y: null
        }

    for (var i = 0; i < points.length - 1; i++) {
        // var COEF = Math.cos((Math.PI*map.unproject(points[i].projected).lat)/180);
        // var COEF = 1;
        // console.log(COEF);
        // console.log(L.Circle.prototype._project);
        // L.Circle.prototype._project.call(points[i+1]);
        findEllipseFocus(points[i+1]);

        // console.log(points[i+1].secondFocus.lat - points[i+1]._latlng.lat);
        // console.log(map.project(points[i+1].secondFocus).y - points[i+1].projected.y);
        first = points[i].projected;
        second = points[i+1].projected;
        linearParams = findLinearCoef(first, second);
        a = linearParams.a;
        b = linearParams.b;
        c = linearParams.c;
        x2 = second.x;
        y2 = second.y;
        r = points[i+1]._mRadius /         Math.cos((Math.PI*points[i].lat)/180);
        // console.log(r);
        squareParams = squareCircleSystem(linearParams, second, r);
        roots = findSquareRoots(squareParams);
        // console.log(squareParams);
        // console.log(roots);
        // каждая следующая точка не может повторять себя
        // a и b не могут быть равны 0 одновременно
        if (!a) {
            res1.x = x2 - r;
            res1.y = y2;
            res2.x = x2 + r;
            res2.y = y2;
        } else if (!b) {
            res1.x = x2;
            res1.y = y2 - r;
            res2.x = x2;
            res2.y = y2 + r;
        } else {
            res1.x = roots[0];
            res1.y = (-c - a * roots[0]) / b;
            res2.x = roots[1];
            res2.y = (-c - a * roots[1]) / b;
        }
        // console.log(points[i+1]._mRadius);
        // console.log(res1.x, res1.y);
        // console.log(L.point(res1.x, res1.y));
        // console.log(L.point(res2.x, res2.y));
        points[i+1].ll1 = map.options.crs.unproject(L.point(res1.x, res1.y));
        points[i+1].ll2 = map.options.crs.unproject(L.point(res2.x, res2.y));
        // points[i+1].ll1 = map.layerPointToLatLng([res1.x, res1.y]);
        // points[i+1].ll2 = map.layerPointToLatLng([res2.x, res2.y]);
        points[i+1].circleCenter1 = {
            x: res1.x,
            y: res1.y
        };
        points[i+1].circleCenter2 = {
            x: res2.x,
            y: res2.y
        };
        // console.log(res1.y - points[i+1].projected.y);
        // console.log([points[i+1].projected.x, points[i+1].projected.y], [res1.x, res1.y]);
        // console.log(points[i+1]._mRadius);
        // console.log(map.options.crs);
        // console.log(points[i+1].ll1, points[i+1].ll2);
        // console.log(res1, res2);
        // L.circleMarker(points[i+1].ll1, circlesCentersOptions).addTo(map);
        // L.circleMarker(points[i+1].ll2, upperPointsOptions).addTo(map);
    }
    return points;
}

// draw big circles
function drawBigCircles(points) {
    for (var i = 1; i < points.length; i++) {
        var radius = map.distance(points[i].ll1, points[i].ll2),
            radius1 = map.distance(points[i].ll1, points[i]._latlng),
            radius2 = map.distance(points[i].ll2, points[i]._latlng);
        var lat = points[i].lat;
        // Math.cos((Math.PI*points[i].lat)/180)
        // console.log(lat);
        // console.log(radius);
        // console.log(i + '   ' + ( ((radius1) / Math.cos((Math.PI*lat)/180)) / (points[i]._mRadius)) + '  ' + Math.cos((Math.PI*lat)/180));
        // console.log();
        // console.log(i + '   ' + ((radius2 / 2) / (points[i]._mRadius)));
        // console.log(i + '   ' + ((radius / 2) / (points[i]._mRadius))  + '   ' + lat + '   ' + Math.sin((Math.PI*lat)/180) + '   ' + Math.cos((Math.PI*lat)/180) + '   ' + Math.tan((Math.PI*lat)/180) + '   ' + Math.atan((Math.PI*lat)/180));
        // console.log(i + ' / ' + (radius / (points[i]._mRadius) / Math.pow(Math.cos((Math.PI*lat)/180), 1)));
        // console.log(Math.cos((Math.PI*map.unproject(points[i]).lat))/180);
        // console.log(map.unproject(points[i]).lat);
        // console.log(Math.sin((Math.PI*lat)/180));

        // var circle1 = L.circle(points[i].ll1, {radius: radius}).addTo(map);
        // var circle2 = L.circle(points[i].ll2, {radius: radius}).addTo(map);
        points[i].radius = radius;
    }
    return points;
}

// circles intersection
function getTwoCirclesIntersection(points) {
    var center,
        x1,
        y1,
        x2,
        y2,
        radius,
        squareParams,
        roots,
        res1 = {
            x: null,
            y: null
        },
        res2 = {
            x: null,
            y: null
        }

    for (var i = 1; i < points.length; i++) {
        center1 = points[i].circleCenter1;
        center2 = points[i].circleCenter2;
        x1 = points[i].projected.x;
        y1 = points[i].projected.y;
        x2 = center1.x;
        y2 = center1.y;
        a = x2 - x1;
        b = y2 - y1;
        radius = points[i].radius/* / COEF*/;
        squareParams = triangleSystem(points[i], center1, radius);
        // console.log(squareParams);
        // console.log(x1, x2);
        // console.log(y1, y2);
        roots = findSquareRoots(squareParams);
        // console.log(radius);
        res1.x = roots[0];
        res1.y = (-a * (roots[0] - x1) / b) + y1;
        res2.x = roots[1];
        res2.y = (-a * (roots[1] - x1) / b) + y1;
        // console.log(squareParams);
        // res1 = squareParams.res1;
        // res2 = squareParams.res2;

        points[i].upperPoint1 = {
            x: res1.x,
            y: res1.y
        };
        points[i].upperPoint2 = {
            x: res2.x,
            y: res2.y
        };

        L.circleMarker(map.options.crs.unproject(L.point(res1.x, res1.y)), upperPointsOptions).addTo(map);
        L.circleMarker(map.options.crs.unproject(L.point(res2.x, res2.y)), upperPointsOptions).addTo(map);
    }
    return points;
}

// getPoints
function getRightPoints(points) {
    var first, second,
        linearParams,
        a, b, c,
        x2, y2,
        r,
        lr, // left or right
        squareParams,
        roots,
        res1 = {
            x: null,
            y: null
        },
        res2 = {
            x: null,
            y: null
        }

    for (var i = 1; i < points.length; i++) {

        first = points[i].upperPoint1;
        second = points[i].upperPoint2;
        linearParams = findLinearCoef(first, second);

        a = linearParams.a;
        b = linearParams.b;
        c = linearParams.c;
        x2 = points[i].projected.x;
        y2 = points[i].projected.y;
        r = points[i]._mRadius/* / COEF*/;
        squareParams = squareCircleSystem(linearParams, points[i], r);
        roots = findSquareRoots(squareParams);
        // каждая следующая точка не может повторять себя
        // a и b не могут быть равны 0 одновременно
        // console.log(roots);
        // console.log(roots[0].x, roots[1].x);

        if (!a) {
            res1.x = x2 - r;
            res1.y = y2;
            res2.x = x2 + r;
            res2.y = y2;
        } else if (!b) {
            res1.x = x2;
            res1.y = y2 - r;
            res2.x = x2;
            res2.y = y2 + r;
        } else {
            res1.x = roots[0];
            res1.y = (-c - a * roots[0]) / b;
            res2.x = roots[1];
            res2.y = (-c - a * roots[1]) / b;
        }

        lr = findOrientation(points[i-1], points[i], res1);

        if (lr) {
            var temp = res1;

            res1 = res2;
            res2 = temp;
        }

        var j = points.length - 1 + points.length - i;

        var one = map.unproject([res1.x, res1.y]),
            two = map.unproject([res2.x, res2.y]);

        // L.polyline([one, two], {color: 'red', weight: 0.8}).addTo(map);

        L.circleMarker(one, rightPointsOptions).bindPopup('id: ' + i + ' lr: ' + lr).addTo(map);
        L.circleMarker(two, rightPointsOptions).bindPopup('id: ' + j).addTo(map);

        var _mRadius = points[i]._mRadius,
            centersDistance = map.distance(points[i].ll1, points[i].ll2),
            // centersDistance2 = map.distance(map.unproject([points[i].circleCenter1.x, points[i].circleCenter1.y]), map.unproject([points[i].circleCenter2.x, points[i].circleCenter2.y])),
            distance = map.distance(map.unproject([res1.x, res1.y]), map.unproject([res2.x, res2.y]));

        // console.log(i + ' / ' + j);

        polygonLL.push(
            {id: i, latLng: one},
            {id: j, latLng: two}
        )
    }
    return points;

}

var mileStoned = countMileStones(testRiver),
    percentaged = countPercentage(mileStoned),
    interpolated = interpolateRange(percentaged, widthRange),
    circled = drawEndCircles(interpolated),
    lineEqCalculated = getLineAndEndCircleIntersections(circled),
    bigCircled = drawBigCircles(lineEqCalculated),
    twoCirclesCalculated = getTwoCirclesIntersection(bigCircled),
    right = getRightPoints(twoCirclesCalculated);

// polygonLL.push(
//     {id: polygonLL.length, latLng: startPoint}
// )

polygonLL.sort(function(a, b){
    return a.id - b.id;
});



var plg = polygonLL.map(function(obj){
    return obj.latLng;
});
// simple
L.polygon(plg, {weight: 1, fillOpacity: 0.5}).addTo(map);
// beautyfied
// L.polygon(plg, {color: '#8086fc', weight: 1, fillColor: '#97d2e3', fillOpacity: 1}).addTo(map);
// var testRiver = L.polyline(coordinates, {color: 'red', weight: 1}).addTo(map);
