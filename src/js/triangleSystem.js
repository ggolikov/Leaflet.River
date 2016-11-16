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

        a = x2 - x1 > 0 ? x2 - x1 : x1 - x2,
        b = y2 - y1 > 0 ? y2 - y1 : y1 - y2,
        A, B, C;

    A = 1;
    B = -2 * x1;
    C = (Math.pow(x1, 2) - (Math.pow(r, 2) / (b + Math.pow(a, 2))));

    return {
        a: A,
        b: B,
        c: C
    };
}
