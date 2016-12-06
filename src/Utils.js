L.Util.extend(L.Util, {
    /**
    * create vector from two points
    * @param {Object} point1 - vector start point.
    * @param {Object} point2 - vector end point.
    * @return {Object} - vector coordinates
    */
    convertToVector: function(point1, point2) {
        var x = point2.x - point1.x,
        y = point2.y - point1.y;

        return {x: x, y: y};
    },

    /**
    * summarize two vectors
    * @param {Object} vector1
    * @param {Object} vector2
    * @return {Object} - vector coordinates
    */
    addVectors: function(vector1, vector2) {
        return {x: vector1.x + vector2.x, y: vector1.y + vector2.y};
    },

    /**
    * multiple vector by number
    * @param {Object} vector
    * @param {Number} number
    * @return {Object} - vector coordinates
    */
    multipleVector: function(vector, number) {
        var x = vector.x,
        y = vector.y;

        return {x:  x * number, y: y * number};
    },

    /**
    * divide vector by number
    * @param {Object} vector
    * @param {Number} number
    * @return {Object} - vector coordinates
    */
    divideVector: function(vector, number) {
        var x = vector.x,
        y = vector.y;

        return {x:  x / number, y: y / number};
    },

    /**
    * summarize point and vector
    * @param {Object} point
    * @param {Object} vector
    * @return {Object} - point coordinates
    */
    findVectorCoords: function(point, vector) {
        return {x: point.x + vector.x, y: point.y + vector.y};
    },

    /**
    * find cosines of angles between vector and axises
    * @param {Object} vector
    * @param {Number} length - vector length
    * @return {Object} - vector cosines
    */
    findVectorCosines: function(vector, length) {
        var cosA = vector.x / length,
        cosB = vector.y / length;

        return {cosA: cosA, cosB: cosB};
    },

    /**
    * find vector from cosines and length
    * @param {Object} cosines - cosines of angles between vector and axises
    * @param {Number} length - vector length
    * @return {Object} - vector coordinates
    */
    findVectorfromOrts: function(cosines, length) {
        return {x: length * cosines.cosA, y: length * cosines.cosB};
    },

    /**
    * find length between two points
    * @param {Object} point1 - first point.
    * @param {Object} point2 - second point.
    * @return {Number} - length
    */
    findLength: function(point1, point2) {
        var x1 = point1.x,
        y1 = point1.y,
        x2 = point2.x,
        y2 = point2.y;

        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    },

    /**
    * find linear equation params
    * @param {Object} point1 - first point.
    * @param {Object} point2 - second point.
    * @return {Object} - linear params
    */
    findLinearCoef: function(point1, point2) {
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
    },

    /**
    * find orientation of a point (left or right from the line)
    * @param {Object} point1 - first point of the line.
    * @param {Object} point2 - second point of the line.
    * @param {Object} point3 - third point.
    * @return {Boolean} - true, if third point lies right, false if left
    */
    findOrientation: function(point1, point2, point3) {
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
    },

    /**
    * check if two segments intersect
    * @param {Object} segment1 - first segment.
    * @param {Object} segment2 - second segment.
    * @return {Boolean} - true, if two segments intersect and intersection point belongs both segments
    */
    checkIntersection: function(segment1, segment2) {
        var params1 = this.findLinearCoef(segment1.point1, segment1.point2),
        params2 = this.findLinearCoef(segment2.point1, segment2.point2),
        a1 = params1.a,
        b1 = params1.b,
        c1 = params1.c,
        a2 = params2.a,
        b2 = params2.b,
        c2 = params2.c,
        x1 = segment1.point1.x,
        y1 = segment1.point1.y,
        x2 = segment1.point2.x,
        y2 = segment1.point2.y,
        x3 = segment2.point1.x,
        y3 = segment2.point1.y,
        x4 = segment2.point2.x,
        y4 = segment2.point2.y,
        x, y;

        x = (b1 * c2 / b2 - c1) / (a1 - b1 * a2 / b2);
        y = - ((a2 * x + c2) / b2);

        return ((x1 <= x && x2 >= x) || (x2 <= x && x1 >= x)) && ((x3 <= x && x4 >= x) || (x4 <= x && x3 >= x));
    }
});
