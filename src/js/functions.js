// points {x1, y1}, {x1, y1} -> vector {x, y}
function convertToVector(point1, point2) {
    var x = point2.x - point1.x,
        y = point2.y - point1.y;

    return [x, y];
}

// vector {x, y} -> cos(angle)
function findTwoVectorsAngle(vector1, vector2) {
    var x1 = vector1[0],
        y1 = vector1[1],
        x2 = vector2[0],
        y2 = vector2[1],
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
        x2 = point2[0],
        y2 = point2[1];

    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

// vectors {x1, y1}, {x2, y2} -> vector {x3, y3}
function addVectors(vector1, vector2) {
    return [vector1[0] + vector2[0], vector1[1] + vector2[1]];
}

// point {x1, y1}, vector {x2, y2} -> point {x3, y3}
function findVectorCoords(point, vector) {
    return [point.x + vector[0], point.y + vector[1]];
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

/**
 * equation system
 * - circle:
 *   Math.pow((x - x2), 2)  + Math.pow((y - y2), 2) = Math.pow(r, 2);
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
