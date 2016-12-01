// points {x1, y1}, {x1, y1} -> vector {x, y}
function convertToVector(point1, point2) {
    var x = point2.x - point1.x,
        y = point2.y - point1.y;

    return {x: x, y: y};
}

// vector {x, y} -> cos(angle)
function findTwoVectorsAngle(vector1, vector2) {
    var x1 = vector1.x,
        y1 = vector1.y,
        x2 = vector2.x,
        y2 = vector2.y,
        cos = (x1 * x2 + y1 * y2) / (Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)));

    return cos;
}

// points {x1, y1}, {x1, y1} -> length (number)
function findLength(point1, point2) {
    var x1 = point1.x,
        y1 = point1.y,
        x2 = point2.x,
        y2 = point2.y;

    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

// points {x1, y1}, {x1, y1} -> length (number)
function findVectorLength(point1, point2) {
    var x1 = point1.x,
        y1 = point1.y,
        x2 = point2.x,
        y2 = point2.y;

    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

// vectors {x1, y1}, {x2, y2} -> vector {x3, y3}
function addVectors(vector1, vector2) {
    return {x: vector1.x + vector2.x, y: vector1.y + vector2.y};
}

// point {x1, y1}, vector {x2, y2} -> point {x3, y3}
function findVectorCoords(point, vector) {
    return {x: point.x + vector.x, y: point.y + vector.y};
}

function findVectorCos(vector, length) {
    var cosA = vector.x / length,
        cosB = vector.y / length;

    return {cosA: cosA, cosB: cosB};
}

function findVectorfromOrts(coss, radius) {
    return {x: radius * coss.cosA, y: radius * coss.cosB};
}

function multipleVector(vector, number) {
    var x = vector.x,
        y = vector.y;

    return {x:  x * number, y: y * number};
}

function divideVector(vector, number) {
    var x = vector.x,
        y = vector.y;

    return {x:  x / number, y: y / number};
}

function findEllipseFocus(point) {
    var lng = point._latlng.lng,
        lat = point._latlng.lat,
        map = point._map,
        crs = map.options.crs;
    if (crs.distance === L.CRS.Earth.distance) {
        var d = Math.PI / 180,
            latR = (point._mRadius / L.CRS.Earth.R) / d,
            top = map.project([lat + latR, lng]),
            bottom = map.project([lat - latR, lng]),
            p = top.add(bottom).divideBy(2),
            lat2 = map.unproject(p).lat,
            lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
                    (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;
        if (isNaN(lngR) || lngR === 0) {
            lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
        }
    point.secondFocus = map.unproject(p);
    }
}

/**
 * point-line orientation calculator
 * @param point1 [Object] line point 1
 * @param point2 [Object] line point 2
 * @param point3 [Object] Side point
 * @return [Boolean] true if right, false if left
 */

function findOrientation(point1, point2, point3) {
    var x1 = point1.x,
        y1 = point1.y,
        x2 = point2.x,
        y2 = point2.y,
        x3 = point3.x,
        y3 = point3.y,
        d;

        d = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);

    if (d > 0) {
        return true;
    } else if (d < 0) {
        return false;
    } else if (d == 0) {
    // TODO: handle 90 degrees angle
    };
}

/**
 * @module linear coeff
 * @param point1
 * @param point2
 * @return Object {a, b, c} linear coefficients
 */

function findLinearCoef(point1, point2) {
    var x1 = point1.x,
        x2 = point2.x,
        y1 = point1.y,
        y2 = point2.y,
        a = y1 - y2,
        b = x2 - x1,
        c = x1 * y2 - x2 * y1;

    return {
        a: a,
        b: b,
        c: c
    };
}

function checkIntersection(line1, line2) {
    var params1 = findLinearCoef(line1.point1, line1.point2),
        params2 = findLinearCoef(line2.point1, line2.point2),
        a1 = params1.a,
        b1 = params1.b,
        c1 = params1.c,
        a2 = params2.a,
        b2 = params2.b,
        c2 = params2.c,
        x1 = line1.point1.x,
        y1 = line1.point1.y,
        x2 = line1.point2.x,
        y2 = line1.point2.y,
        x3 = line2.point1.x,
        y3 = line2.point1.y,
        x4 = line2.point2.x,
        y4 = line2.point2.y,
        x, y;

        x = (b1 * c2 - c1) / (a1 * b2 - a2 * b1);
        y = - ((a2 * x + c2) / b2);

        // console.log(
        //     'x1: ' + x1 + '\n' +
        //     'x: ' + x + '\n' +
        //     'x2: ' + x2
        // );
        // console.log((x >= x1) && (x <= x2));
    // return ((x1 <= x && x2 >= x) || (x2 <= x && x1 >= x)) && ((x3 <= x && x4 >= x) || (x4 <= x && x3 >= x));
    // return ((x >= x1) && (x <= x2) && (y >= y1) && (y <= y2));
}

function linearEg(params, point) {
    return params.a * point.x + params.b * point.y + params.c;
}

/**
 * equation system
 * - line:
 *   a * x + b * y + c = 0;
 * - circle:
 *   Math.pow((x - x2), 2)  + Math.pow((y - y2), 2) = Math.pow(r, 2);
 * @param linearParams
 * @param center circle center point
 * @param radius circle radius
 * @return Object {a, b, c} quadratic equation coefficients
 *
 */

function squareCircleSystem(linearParams, center, radius) {
    var a = linearParams.a,
        b = linearParams.b,
        c = linearParams.c,
        cx = center.x,
        cy = center.y,
        r = radius,
        A, B, C;

    A = Math.pow(a, 2) + Math.pow(b, 2);
    B = -2 * (Math.pow(b, 2) * cx - a * c - a * b * cy);
    C = b * (b * Math.pow(cx, 2) + 2 * cy * c + b * Math.pow(cy, 2) - b * Math.pow(r, 2)) + Math.pow(c, 2);

    return {
        a: A,
        b: B,
        c: C
    };
}

/**
 * square equation calculation
 * @param params Array quadratic params [a, b, c]
 */

function findSquareRoots(params) {
    var a = params.a,
        b = params.b,
        c = params.c,
        d = Math.pow(b, 2) - 4 * a * c,
        x1, x2;
    if (d > 0) {
        x1 = (-b + Math.sqrt(d)) / (2 * a);
        x2 = (-b - Math.sqrt(d)) / (2 * a);
        return [x1, x2];
    } else if (d === 0) {
        x1 = -b / (2 * a);
        return [x1, x1];
    } else {
        return null;
    }
}

function findLineCircleIntersection(point1, point2, circleCenter) {
    var linearParams = findLinearCoef(point1, point2),
        a = linearParams.a,
        b = linearParams.b,
        c = linearParams.c,
        r = circleCenter._mRadius / Math.cos((Math.PI * circleCenter.lat) / 180),
        squareParams = squareCircleSystem(linearParams, circleCenter.projected, r),
        x2 = point2.projected.x,
        y2 = point2.projected.y,
        roots = findSquareRoots(squareParams),
        res1 = {
            x: null,
            y: null
        },
        res2 = {
            x: null,
            y: null
        };

    // edge case, если радиус ничтожно мал, точка равна себе
    if (!roots) {
        res1.x = x2;
        res1.y = y2;
        res2.x = x2;
        res2.y = y2;
    } else {
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
    }

    return [{x: res1.x, y: res1.y}, {x: res2.x, y: res2.y}];
}

function findEndPoints(point, center, radius) {
    var x1 = point.x,
        y1 = point.y,
        x2 = center.x,
        y2 = center.y,
        a = x2 - x1,
        b = y2 - y1,
        squareParams = triangleSystem(point, center, radius),
        roots = findSquareRoots(squareParams),
        res1 = {
            x: null,
            y: null
        },
        res2 = {
            x: null,
            y: null
        };

    // edge cases
    if (!roots) {
        res1.x = x2;
        res1.y = y2;
        res2.x = x2;
        res2.y = y2;
    } else {
        res1.x = roots[0];
        res1.y = (-a * (roots[0] - x1) / b) + y1;
        res2.x = roots[1];
        res2.y = (-a * (roots[1] - x1) / b) + y1;
    }
    return [res1, res2];
}

/**
 * equation system
 * - circle:
 *   Math.pow((x - x2), 2)  + Math.pow((y - y2), 2) = Math.pow(r, 2);
 * @param vertex line vertex point
 * @param center circle center point
 * @param radius circle radius
 * @return Object {a, b, c} quadratic equation coefficients
 *
 */

function triangleSystem(vertex, center, radius) {
    var x1 = vertex.x,
        y1 = vertex.y,
        x2 = center.x,
        y2 = center.y,
        r = radius,
        h = Math.sqrt(Math.pow(r, 2) - Math.pow(r / 2, 2)),

        a = x2 - x1,
        b = y2 - y1,
        mn = Math.pow(a, 2) + Math.pow(b, 2),
        A, B, C;

    A = mn;
    B = -2 * x1 * mn;
    C = (Math.pow(x1, 2) * mn - Math.pow(b, 2) * Math.pow(h, 2));

    return {
        a: A,
        b: B,
        c: C
    };
}
