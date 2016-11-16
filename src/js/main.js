var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(55.86531828981331, 37.630534172058105), zoom: 16}),
    moscow = L.latLng(37, 55);

// test polyline data
var coordinates = [
          [
            37.62821674346924,
            55.86890627080961
          ],
          [
            37.62924671173096,
            55.86871363595487
          ],
          [
            37.629804611206055,
            55.868039406438854
          ],
          [
            37.63014793395996,
            55.86736516521821
          ],
          [
            37.630276679992676,
            55.866618670213754
          ],
          [
            37.630276679992676,
            55.86594440432944
          ],
          [
            37.630534172058105,
            55.86531828981331
          ],
          [
            37.63147830963135,
            55.86510155551395
          ],
          [
            37.63212203979492,
            55.865029310478775
          ],
          [
            37.63263702392578,
            55.86469216520454
          ],
          [
            37.632508277893066,
            55.8642346062232
          ],
          [
            37.632808685302734,
            55.86387337164131
          ],
          [
            37.63345241546631,
            55.86339172030652
          ],
          [
            37.634267807006836,
            55.86329538932288
          ],
          [
            37.63465404510498,
            55.863102726639
          ],
          [
            37.63443946838379,
            55.862813730821536
          ],
          [
            37.633881568908684,
            55.86252473285406
          ],
          [
            37.634053230285645,
            55.86221164929642
          ],
          [
            37.634267807006836,
            55.861850395902216
          ],
          [
            37.63465404510498,
            55.86144097132764
          ],
          [
            37.635040283203125,
            55.86124829944651
          ]
      ];
coordinates.forEach(function(ll){
    return ll.reverse();
});

// test polyline
var testRiver = L.polyline(coordinates, {color: 'blue', weight: 1}).addTo(map);

var widthRange = {
    startWidth: 0,
    endWidth: 10
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
function interpolateRange (latLngs, range) {
    var range = range.endWidth - range.startWidth;

    latLngs.forEach(function(latLng){
        latLng.offset = latLng.percent * range;
    });

    return latLngs;
}

// draw end circles
function drawEndCircles(latLngs) {
    for (var i = 0; i < latLngs.length; i++) {
        var circle = L.circle(latLngs[i], latLngs[i].offset)/*.addTo(map)*/;
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
        squareParams,
        roots,
        x2, y2,
        r,
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

        points[i].ll1 = map.unproject([res1.x, res1.y]);
        points[i].ll2 = map.unproject([res2.x, res2.y]);
        L.marker(map.unproject([res1.x, res1.y])).addTo(map);
        L.marker(map.unproject([res2.x, res2.y])).addTo(map);
    }
    return points;
}


// draw big circles
function drawBigCircles(points) {
    for (var i = 1; i < points.length; i++) {
        var length = map.distance(points[i].ll1, points[i].ll2);
        var circle1 = L.circle(points[i].ll1, length).addTo(map);
        var circle2 = L.circle(points[i].ll2, length).addTo(map);
        points[i].circle1 = circle1;
        points[i].circle2 = circle2;
        points[i].length = length;
    }
    return points;
}

function getTwoCirclesIntersection(points) {
    for (var i = 1; i < points.length; i++) {

    }

}

var mileStoned = countMileStones(testRiver),
    percentaged = countPercentage(mileStoned),
    interpolated = interpolateRange(percentaged, widthRange),
    circled = drawEndCircles(interpolated),
    projected = projectAll(circled),
    lineEqCalculated = getLineAndEndCircleIntersections(projected),
    bigCircled = drawBigCircles(lineEqCalculated);
console.log(testRiver);
