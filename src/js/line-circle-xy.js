function findLineCircleIntersection(point1, point2, circleCenter) {
    var linearParams = findLinearCoef(point1.projected, point2.projected),
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

    return [[res1.x, res1.y], [res2.x, res2.y]];

}
