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
// test polyline
var testRiver = L.polyline(coordinates, {color: 'blue', weight: 1, smooth: 3});
testRiver.addTo(map);

map.fitBounds(testRiver.getBounds());

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
        var circle = L.circle(points[i]._latlng, {radius: points[i]._mRadius, color: 'red'}).bindPopup('id: ' + i).addTo(map);
    }
    return points;
}

// line equation

function findVectors(points) {
    var length1, length2, length3,
        ortVector1, ortVector2, ortVector3,
        bVector1, bVector2,
        bPoint1, bPoint2,
        pos, lr,
        coss,
        endPoints,
        r;

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
        // pupendicular for the last point
        if (i === points.length - 3) {
            console.log(i);
            r = points[i+2]._mRadius / Math.cos((Math.PI*points[i+2].lat)/180);
            endPoints = findEndPoints(points[i+1], points[i+2], r);
            bPoint1 = endPoints[0];
            bPoint2 = endPoints[1];
            console.log('sssss');
            console.log(endPoints[0]);
            L.circleMarker(map.options.crs.unproject(L.point(endPoints[0].x, endPoints[0].y)), circlesCentersOptions).bindPopup('id: ' + i).addTo(map);
            L.circleMarker(map.options.crs.unproject(L.point(endPoints[1].x, endPoints[1].y)), circlesCentersOptions).bindPopup('id: ' + i).addTo(map);
        }


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

        // L.circleMarker(points[i+1].llb, circlesCentersOptions).bindPopup('id: ' + i).addTo(map);
        // L.circleMarker(points[i+1].llb2, circlesCentersOptions).bindPopup('id: ' + i).addTo(map);
        var j = points.length  + points.length - i;
        // L.polyline([points[i+1].llb, points[i+1].llb2], {color: 'red', weight: 0.8}).addTo(map);
        polygonLL.push(
            {id: i+1, latLng: points[i+1].llb},
            {id: j, latLng: points[i+1].llb2}
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
// simple
// console.log(plg);
L.polygon(plg, {weight: 1, fillOpacity: 0.5}).addTo(map);
// beautyfied
// L.polygon(plg, {color: '#8086fc', weight: 1, fillColor: '#97d2e3', fillOpacity: 1}).addTo(map);
