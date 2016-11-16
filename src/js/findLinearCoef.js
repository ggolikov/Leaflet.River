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
