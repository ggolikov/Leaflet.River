# Leaflet.River

A class for drawing lines of different width (like rivers) on a map. Extends Polygon.

Useful when you want to show how rivers 'flow' on the map.

Simple polylines without using Leaflet.River | Using Leaflet.River
------|------
![simple polylines](https://cloud.githubusercontent.com/assets/17549928/20976102/8390b408-bcb2-11e6-8dd2-7354f4aa86cf.png) |![using Leaflet.River](https://cloud.githubusercontent.com/assets/17549928/20976101/838f5680-bcb2-11e6-8d49-3da1a3ecd25f.png)

## [Demo](https://ggolikov.github.io/Leaflet.River/example/)
## Usage
To create a L.River polygon, simply pass an array of geographical points to the factory function as the first argument. The second optional argument is options object.
```javascript
var latLngs = [[48.491, 99.613], [48.492, 99.601], [48.496, 99.599]];

var river = L.river(latLngs, {
    startWidth: 1, // meters
    endWidth: 50   // meters
}).addTo(map);
```
Attention:
- L.River doesn't support multipolylines, so the passing array has to be flat.
- first point of an array has to be the source of the river.

You can specify parameters `startWidth` and `endWidth` later using setters `setStartWidth` and `setEndWidth`.

For better perfomance you can specify `endWidth` parameter depending on river length, for example, when you create L.river objects from GeoJSON polylines:
```javascript
var rivers = L.geoJson(geoJsonData, {
    onEachFeature: function(feature, layer) {
        var river = L.river(feature.geometry.coordinates, {
            startWidth: 1,
            endWidth: feature.properties.length
        }).addTo(map);
    }
});
```
If you don't have `length` property in your data, you can get river's length with `getLength()` method:
```javascript
var rivers = L.geoJson(geoJsonData, {
    onEachFeature: function(feature, layer) {
        var river = L.river(feature.geometry.coordinates, {
              startWidth: 1
            }),
            length = river.getLength();

        river.setEndWidth(length)
             .addTo(map);
    }
});
```
## API
### Factory
Factory|Description
-------|-----------
L.river(`LatLng[]` _latlngs_, `Path options` _options?_)| Create river polygon from latLngs array.

### Methods
Method|Returns|Description
------|-------|-----------
setStartWidth(`Number`)|`this`|Set start river width (meters).
setEndWidth(`Number`)|`this`|Set end river width (meters).
getStartWidth()|`Number`|Get start river width (meters).
getEndWidth()|`Number`|Get end river width (meters).
getLength()|`Number`|Get length of the river. (meters). Useful when there is no length property in initial data.
convertToPolyline(<options> options?)|`Object`|Convert river polygon to initial polyline.
