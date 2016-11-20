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
