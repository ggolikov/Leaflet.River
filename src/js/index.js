var line = L.polyline([[55, 37], [57, 38]],{color: 'red'}).addTo(map);
map.fitBounds(line.getBounds());

console.log(line);

var river = L.river([[55, 37], [57, 38]], {
    startWidth: 0,
    endWidth: 5000
}).addTo(map);

console.log(river);
