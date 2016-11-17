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

 // module.exports = findOrientation;
