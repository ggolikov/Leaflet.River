L.MyMarker = L.Marker.extend({
    initialize: function (LatLng, options) {
        L.Marker.prototype.initialize.apply(this, arguments);
        console.log('My marker is created');
        console.log('My marker aaa');
    },
    options: {
        draggable: true
    }
});

// document.body.style.backgroundColor === 'green';
// setInterval(function(){
//     var color = document.body.style.backgroundColor;
//     if (color === 'white') {
//         color === 'green'
//     } else {
//         color === 'white'
//     }
// }, 1000);
L.myMarker = function (latLng, options) {
    return new L.MyMarker(latLng, options);
};
