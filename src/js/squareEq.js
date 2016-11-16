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
        // console.log(a, b, c);
        // console.log(d > 0);
    if (d > 0) {
        x1 = (-b + Math.sqrt(d)) / (2 * a);
        x2 = (-b - Math.sqrt(d)) / (2 * a);
        return [x1, x2];
    } else if (d === 0) {
        x1 = -b / (2 * a);
        return [x1, x1];
    }
}
