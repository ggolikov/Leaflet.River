var COEF = 1.337972467;


var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
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

coordinates.forEach(function(ll){
    return ll.reverse();
});

var polygonLL = [];
// test polyline
var testRiver = L.polyline(coordinates, {color: 'blue', weight: 1}).addTo(map);

var startPoint = testRiver.getLatLngs()[0];

polygonLL.push(
    {id: 0, latLng: startPoint}
)

var widthRange = {
    startWidth: 0,
    endWidth: 100
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
        // var circle = L.circle(latLngs[i], latLngs[i].offset).addTo(map);
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
        first = points[i];
        second = points[i+1];
        linearParams = findLinearCoef(first, second);
        // console.log(linearParams);
        a = linearParams.a;
        b = linearParams.b;
        c = linearParams.c;
        x2 = second.x;
        y2 = second.y;
        r = second.offset;

        squareParams = squareCircleSystem(linearParams, second, r);
        roots = findSquareRoots(squareParams);

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
        // L.circleMarker(map.unproject([res1.x, res1.y]), circlesCentersOptions).addTo(map);
        // L.circleMarker(map.unproject([res2.x, res2.y]), circlesCentersOptions).addTo(map);
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

        // points[i+1].ll1 = map.unproject([res1.x, res1.y]);
        // points[i+1].ll2 = map.unproject([res2.x, res2.y]);
        // points[i+1].circleCenter1 = {
        //     x: res1.x,
        //     y: res1.y
        // };
        // points[i+1].circleCenter2 = {
        //     x: res2.x,
        //     y: res2.y
        // };

        var one = map.unproject([res1.x, res1.y]),
            two = map.unproject([res2.x, res2.y]);


        // L.circleMarker(map.unproject([res1.x, res1.y]), rightPointsOptions).addTo(map);
        // L.circleMarker(map.unproject([res2.x, res2.y]), rightPointsOptions).addTo(map);

        var offset = points[i].offset,
            centersDistance = map.distance(points[i].ll1, points[i].ll2),
            // centersDistance2 = map.distance(map.unproject([points[i].circleCenter1.x, points[i].circleCenter1.y]), map.unproject([points[i].circleCenter2.x, points[i].circleCenter2.y])),
            distance = map.distance(map.unproject([res1.x, res1.y]), map.unproject([res2.x, res2.y]));
            // console.log(points[i]);
        // console.log(offset * 2);
        // console.log(distance);
        // console.log(centersDistance);
        // console.log(centersDistance2);
        // console.log(centersDistance / (offset * 2));

        var j = points.length - 1 + points.length - i;
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


polygonLL.push(
    {id: polygonLL.length, latLng: startPoint}
)
// console.log(polygonLL);
// polygonLL.forEach(function(obj){
//     console.log(obj.id);
// });
polygonLL.sort(function(a, b){
    return a.id - b.id;
});



var plg = polygonLL.map(function(obj){
    return obj.latLng;
});

var curved = plg.map(function(ll){
    return [ll.lat, ll.lng];
});
curved.unshift('C');
// curv/

// console.log(polygonLL);
// console.log(plg);
// L.polygon(polygonLL).addTo(map);
L.polygon(plg, {fillOpacity: 1}).addTo(map);
// var testRiver = L.polyline(coordinates, {color: 'red', weight: 1}).addTo(map);
// var path = L.curve(curved,{fillOpacity: 1}).addTo(map);
