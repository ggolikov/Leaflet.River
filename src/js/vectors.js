// var findLinearCoef = require('./findLinearCoef');
// var findOrientation = require('./findOrientation');
// var squareCircleSystem = require('./squareCircleSystem');
// var triangleSystem = require('./triangleSystem');
// var findSquareRoots = require('./findSquareRoots');

// require('./js/squareCircleSystem.js');
// require('./js/triangleSystem.js');
// require('./js/findOrientation.js');
// require('./js/findSquareRoots.js');

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

// var coordinates = medvedkovo;
// var coordinates = los;
var coordinates = mongolia;
// var coordinates = world;

coordinates.forEach(function(ll){
    return ll.reverse();
});

var polygonLL = [];
var linesArr = [];
var lineArr1 = [];
var lineArr2 = [];
var intArr1 = [];
var intArr2 = [];
// test polyline
var testRiver = L.polyline(coordinates, {color: 'blue', weight: 1, smooth: 3});
testRiver.addTo(map);

map.fitBounds(testRiver.getBounds());

var startPoint = testRiver.getLatLngs()[0];

polygonLL.push(
    {id: 0, latLng: startPoint}
)

lineArr1.push(
    {id: 0, latLng: startPoint}
);


var widthRange = {
    startWidth: 0,
    endWidth: 8000
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
            projected: map.options.crs.project(latLngs[i]),
            x: map.options.crs.project(latLngs[i]).x,
            y: map.options.crs.project(latLngs[i]).y,
            milestone: null,
            percent: null,
            _mRadius: null,
            ll1: null,
            ll2: null,
            ll3: null,
            ll4: null
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
        // var circle = L.circle(points[i]._latlng, {radius: points[i]._mRadius, color: 'red'}).bindPopup('id: ' + i).addTo(map);
    }
    return points;
}

// line equation

function findVectors(points) {
    var prev, cur, next,
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
        r = cur._mRadius / Math.cos((Math.PI*cur.lat)/180);

        if (i < points.length - 1) {
            next = points[i+1];
        } else {
            //purpendicular to the last point
            rVector = convertToVector(prev, cur),
            virtualVector = multipleVector(rVector, 2),
            next = findVectorCoords(prev, virtualVector);
        }


        vector1 = convertToVector(cur, prev);
        vector2 = convertToVector(cur, next);
        vector3 = addVectors(vector1, vector2);
        vectorsSumPoint = findVectorCoords(cur, vector3);

        length3 = findVectorLength(cur, vectorsSumPoint);
        length1 = findLength(cur, prev);
        length2 = findLength(cur, next);

        if (length3) {
            // vector1 && vector2 have to be ort-vectors
            ortVector1 = divideVector(vector1, length1);
            ortVector2 = divideVector(vector2, length2);

            // ort-vector3
            ortVector3 = addVectors(ortVector1, ortVector2);

            ortPoint = findVectorCoords(cur, ortVector3);
            ortLength = findVectorLength(cur, ortPoint);

            // ort-angles
            coss = findVectorCos(ortVector3, ortLength);
            bVector1 = findVectorfromOrts(coss, r);
            bVector2 = multipleVector(bVector1, -1)
            bPoint1 = findVectorCoords(cur, bVector1);
            bPoint2 = findVectorCoords(cur, bVector2);

        // handle 180 degrees angle
        } else {
            var x = 100,
                y = - (vector1.x * x) / vector1.y;
            vector2 = {x: x, y: y};
            next = findVectorCoords(cur, vector2);
            length2 = findLength(cur, next);
            bVector1 = multipleVector(vector2, r / length2);

            // ortPoint = findVectorCoords(cur, ortVector3);
            // ortLength = findVectorLength(cur, ortPoint);
            //
            // coss = findVectorCos(ortVector3, ortLength);

            // bVector1 = multipleVector(coss, r);
            bVector2 = multipleVector(bVector1, -1)
            bPoint1 = findVectorCoords(cur, bVector1);
            bPoint2 = findVectorCoords(cur, bVector2);

            // L.circleMarker(L.point(bPoint1.x, bPoint1.y), circlesCentersOptions).addTo(map);
            // L.circleMarker(L.point(bPoint2.x, bPoint2.y), circlesCentersOptions).addTo(map);
        }

        lr = findOrientation(prev, cur, bPoint1);

        if (lr) {
            var temp = {x: bPoint1.x, y: bPoint1.y};
            bPoint1 = bPoint2;
            bPoint2 = temp;
        }

        cur.bisectorPoint = L.point(bPoint1.x, bPoint1.y);
        cur.bisectorPoint2 = L.point(bPoint2.x, bPoint2.y);

        cur.llb = map.options.crs.unproject(cur.bisectorPoint);
        cur.llb2 = map.options.crs.unproject(cur.bisectorPoint2);

        // L.circleMarker(next.llb, circlesCentersOptions).bindPopup('id: ' + i).addTo(map);
        // L.circleMarker(next.llb2, circlesCentersOptions).bindPopup('id: ' + i).addTo(map);

        var markersOptions = {
            weight: 1,
            radius: 3,
            color: 'black',
            fill: true,
            fillColor: 'yellow',
            fillOpacity: 0.8
        };

        L.circleMarker(cur.llb, markersOptions).bindPopup('id: ' + i).addTo(map);
        L.circleMarker(cur.llb2, markersOptions).addTo(map);
        L.polyline([cur.llb, cur.llb2], {color: 'red', weight: 0.8}).addTo(map);

        var segment = {point1: cur.bisectorPoint, point2: cur.bisectorPoint2};
        // debugger;

        if (i === 1) {
            // linesArr.push(segment);
        } else {
            // for (var k = 0; k < linesArr.length; k++) {
                // var intersects = checkIntersection(segment, linesArr[k]);
                // console.log(intersects);
            // }
            // if (intersects) {
            //     linesArr.push(segment);
            // }
        }

        var j = points.length  + points.length - i;
        // if (i % 3 === 0) {
            polygonLL.push(
                {id: i, latLng: cur.llb},
                {id: j, latLng: cur.llb2}
            );
        // }
        lineArr1.push(
            {id: i, latLng: cur.llb}
        );

        lineArr2.push(
            {id: j, latLng: cur.llb2}
        );
        intArr1.push(
            [bPoint1.x, bPoint1.y]
        );

        intArr2.push(
            [bPoint2.x, bPoint2.y]
        );
    }

    return points;
}

var mileStoned = countMileStones(testRiver),
    percentaged = countPercentage(mileStoned),
    interpolated = interpolateRange(percentaged, widthRange),
    circled = drawEndCircles(interpolated),
    vectored = findVectors(circled);

// polygonLL.push(
//     {id: polygonLL.length, latLng: startPoint}
// )

polygonLL.sort(function(a, b){
    return a.id - b.id;
});

var plg = polygonLL.map(function(obj){
    return obj.latLng;
});

var lineTop = lineArr1.map(function(obj){
    return obj.latLng;
});
var lineBottom = lineArr2.map(function(obj){
    return obj.latLng;
});
var interpolated1 = interpolateLineRange(intArr1, 100);
var interpolated2 = interpolateLineRange(intArr2, 100);

var conc1 = concaveman(interpolated1);
var conc2 = concaveman(interpolated2);

var arr1 = conc1.map(function(point){
    return map.options.crs.unproject(L.point(point[0], point[1]));
});

var arr2 = conc2.map(function(point){
    return map.options.crs.unproject(L.point(point[0], point[1]));
});

var line1 = L.polyline(arr1).addTo(map);
// var line2 = L.polyline(arr2).addTo(map);




// simple
// console.log(plg);
// L.polygon(plg, {weight: 1, fillOpacity: 0.5}).addTo(map);

L.polyline(lineTop, {weight: 1, fillOpacity: 0.5}).addTo(map);
L.polyline(lineBottom, {weight: 1, fillOpacity: 0.5}).addTo(map);

// beautyfied
// L.polygon(plg, {color: '#8086fc', weight: 1, fillColor: '#97d2e3', fillOpacity: 1}).addTo(map);
map.setView(L.latLng(49.41376531613956, 101.8469524383545), 11);

// map.setZoom(10);
