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
    // console.log(r, radius, center.offset);
    A = Math.pow(a, 2) + Math.pow(b, 2);
    B = -2 * (Math.pow(b, 2) * cx - a * c - a * b * cy);
    C = b * (b * Math.pow(cx, 2) + 2 * cy * c + b * Math.pow(cy, 2) - b * Math.pow(r, 2)) + Math.pow(c, 2);

    return {
        a: A,
        b: B,
        c: C
    };
}
