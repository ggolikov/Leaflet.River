// var findLinearCoef = require('./findLinearCoef');
// var findOrientation = require('./findOrientation');
// var squareCircleSystem = require('./squareCircleSystem');
// var triangleSystem = require('./triangleSystem');
// var findSquareRoots = require('./findSquareRoots');

// require('./js/squareCircleSystem.js');
// require('./js/triangleSystem.js');
// require('./js/findOrientation.js');
// require('./js/findSquareRoots.js');

var COEF = 1.337972467;

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

var coordinates = mongolia;

coordinates.forEach(function(ll){
    return ll.reverse();
});

var polygonLL = [];
// test polyline
var testRiver = L.polyline(coordinates, {color: 'blue', weight: 1, smooth: 3});
testRiver.addTo(map);

map.fitBounds(testRiver.getBounds());

var startPoint = testRiver.getLatLngs()[0];

polygonLL.push(
    {id: 0, latLng: startPoint}
)

var widthRange = {
    startWidth: 5,
    endWidth: 12
};

L.setOptions(testRiver, {
    points: setPoints(testRiver)
})

function setPoints(polyline) {
    var latLngs = polyline.getLatLngs(),
        points = [];

    for (var i = 0; i < latLngs.length; i++) {
        points.push({
            milestone: 0
        });
    }
}

/**
 * API
 */

// counting milestones in meters on every vertex on polyline
function countMileStones(polyline) {
    var latLngs = polyline.getLatLngs(),
        points = polyline.options.points;
        totalLength = latLngs[0].mileStone = 0;

    for (var i = 0; i < latLngs.length - 1; i++) {
        var length = map.distance(latLngs[i], latLngs[i+1]);

        totalLength += length;
        latLngs[i+1].mileStone = totalLength;
    }
    return latLngs;
}

// count percentage
function countPercentage(latLngs) {
    var totalLength = latLngs[latLngs.length-1].mileStone;

    latLngs.forEach(function(latLng){
        latLng.percent = latLng.mileStone / totalLength;
    });

    return latLngs;
}

// interpolate range
function interpolateRange(latLngs, range) {
    var range = range.endWidth - range.startWidth;

    latLngs.forEach(function(latLng){
        latLng.offset = latLng.percent * range;
    });

    return latLngs;
}

// draw end circles
function drawEndCircles(latLngs) {
    for (var i = 0; i < latLngs.length; i++) {
        var circle = L.circle(latLngs[i], latLngs[i].offset).addTo(map);
    }
    return latLngs;
}

// project
function projectAll(latLngs) {
    return latLngs.map(function(ll) {
        var offset = ll.offset;
        ll = map.project(ll);
        ll.offset = offset;
        return ll;
    });
}

// line equation
function getLineAndEndCircleIntersections(points) {
    var first, second,
        next,
        nextLinearParams,
        linearParams,
        an, bn, cn,
        a, b, c,
        x2, y2,
        r,
        squareParams,
        nextSquareParams,
        roots,
        nextRoots,
        res1 = {
            x: null,
            y: null
        },
        res2 = {
            x: null,
            y: null
        },
        nres1 = {
            x: null,
            y: null
        },
        nres2 = {
            x: null,
            y: null
        }

    for (var i = 0; i < points.length - 1; i++) {
        first = points[i];
        second = points[i+1];
        next = points[i+2];
        linearParams = findLinearCoef(first, second);
        // last point has 180 degrees angle
        nextLinearParams = i === points.length - 2 ? linearParams : findLinearCoef(second, next);
        // console.log(linearParams);
        an = nextLinearParams.a;
        bn = nextLinearParams.b;
        cn = nextLinearParams.c;
        a = linearParams.a;
        b = linearParams.b;
        c = linearParams.c;
        x2 = second.x;
        y2 = second.y;
        r = second.offset / COEF;
        squareParams = squareCircleSystem(linearParams, second, r);
        nextSquareParams = squareCircleSystem(nextLinearParams, second, r);
        roots = findSquareRoots(squareParams);
        nextRoots = findSquareRoots(nextSquareParams);
        // console.log();
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

        if (!an) {
            nres1.x = x2 - r;
            nres1.y = y2;
            nres2.x = x2 + r;
            nres2.y = y2;
        } else if (!bn) {
            nres1.x = x2;
            nres1.y = y2 - r;
            nres2.x = x2;
            nres2.y = y2 + r;
        } else {
            nres1.x = nextRoots[0];
            nres1.y = (-cn - an * nextRoots[0]) / bn;
            nres2.x = nextRoots[1];
            nres2.y = (-cn - an * nextRoots[1]) / bn;
        }
        var limits1 = [first, second],
            limits2 = [second, next];

        var coords1 = filterPoints([res1, res2], limits1),
            coords2 = filterPoints([nres1, nres2], limits2);
        console.log(coords1);
        console.log(coords2);

        points[i+1].ll1 = map.unproject([res1.x, res1.y]);
        points[i+1].ll2 = map.unproject([res2.x, res2.y]);
        points[i+1].circleCenter1 = {
            x: res1.x,
            y: res1.y
        };
        points[i+1].circleCenter2 = {
            x: res2.x,
            y: res2.y
        };
        // L.circleMarker(map.unproject(coords1), upperPointsOptions).addTo(map);
        // L.circleMarker(map.unproject(coords2), circlesCentersOptions).addTo(map);


        L.circleMarker(map.unproject([res1.x, res1.y]), upperPointsOptions).addTo(map);
        L.circleMarker(map.unproject([res2.x, res2.y]), upperPointsOptions).addTo(map);
        L.circleMarker(map.unproject([nres1.x, nres1.y]), circlesCentersOptions).addTo(map);
        L.circleMarker(map.unproject([nres2.x, nres2.y]), circlesCentersOptions).addTo(map);
    }

    function filterPoints(points, limits) {
        var x1 = Math.min(limits[0].x, limits[1].x),
            y1 = Math.min(limits[0].y, limits[1].y),
            x2 = Math.max(limits[0].x, limits[1].x),
            y2 = Math.max(limits[0].y, limits[1].y);

        return points.filter(function(point){
            return point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2;
        })
    }

    return points;
}

// draw big circles
function drawBigCircles(points) {
    for (var i = 1; i < points.length; i++) {
        var radius = map.distance(points[i].ll1, points[i].ll2);
        // var circle1 = L.circle(points[i].ll1, radius).addTo(map);
        // var circle2 = L.circle(points[i].ll2, radius).addTo(map);
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
        x1 = points[i].x;
        y1 = points[i].y;
        x2 = center1.x;
        y2 = center1.y;
        a = x2 - x1;
        b = y2 - y1;
        radius = points[i].radius / COEF;
        squareParams = triangleSystem(points[i], center1, radius);
        // console.log(squareParams);
        // console.log(x1, x2);
        // console.log(y1, y2);
        roots = findSquareRoots(squareParams);

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

        // L.circleMarker(map.unproject([res1.x, res1.y]), upperPointsOptions).addTo(map);
        // L.circleMarker(map.unproject([res2.x, res2.y]), upperPointsOptions).addTo(map);
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
        x2 = points[i].x;
        y2 = points[i].y;
        r = points[i].offset / COEF;
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

        // L.circleMarker(one, rightPointsOptions).bindPopup('id: ' + i + ' lr: ' + lr).addTo(map);
        // L.circleMarker(two, rightPointsOptions).bindPopup('id: ' + j).addTo(map);

        var offset = points[i].offset,
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
    projected = projectAll(circled),
    lineEqCalculated = getLineAndEndCircleIntersections(projected),
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
