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

// module.exports = triangleSystem;
