var line = L.polyline([[55, 37], [57, 38]]).addTo(map);

var river = L.river([[55, 37], [57, 38]], {
    points: setPoints(testRiver)
}).addTo(map);

console.log(river);
