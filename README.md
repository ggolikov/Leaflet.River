# Leaflet.River

A class for drawing lines of different width (like rivers) on a map.

Useful when you want to show how rivers 'flow' on the map.

Simple polylines without using Leaflet.River | Using Leaflet.River
------|------
![simple polylines](https://cloud.githubusercontent.com/assets/17549928/20976102/8390b408-bcb2-11e6-8dd2-7354f4aa86cf.png) |![using Leaflet.River](https://cloud.githubusercontent.com/assets/17549928/20976101/838f5680-bcb2-11e6-8d49-3da1a3ecd25f.png)

## [Demo](https://ggolikov.github.io/Leaflet.River)
## Installation
requires leaflet@1.0.2


```
npm install leaflet-river
```
```javascript
require('leaflet');
require('leaflet-river');
```
or

```html
<script src="path/to/leaflet@1.0.2/dist/leaflet.js"></script>
<script src="path/to/Leaflet.river.js"></script>
```

## Usage
To create a L.River, pass an array of latlngs to the factory function as the first argument. The second optional argument is options object.
```javascript
var latLngs = [[48.491, 99.613], [48.492, 99.601], [48.496, 99.599]];

var river = L.river(latLngs, {
    minWidth: 1,  // px
    maxWidth: 10  // px
}).addTo(map);
```
Attention:
- L.River doesn't support multipolylines.
- first point of an array has to be the source of the river.

You can specify parameters `minWidth` and `maxWidth` later using `setMinWidth` and `setMaxWidth` setters.

For better perfomance you can specify river width depending on its length, for example, when you create L.river objects from GeoJSON polylines.
In this case, use `useLength` method, the single parameter is ratio, which is equal to (river length (px) / max width (px)).

```javascript
var rivers = L.geoJson(geoJsonData, {
    onEachFeature: function(feature, layer) {
        var latLngs = L.GeoJSON.coordsToLatLngs(feature.geometry.coordinates),
            river = L.river(latLngs, {
                /**
                * ratio
                * for example, the longest river's length is 1000 px;
                * max width of the longest river has to be 10px;
                * ratio = 1000 / 10;
                * if ratio is specified,
                * all rivers will be drawn proportionally
                */
                ratio: 100
            }).addTo(map);
    }
});
```

## API reference
### Factory
Factory|Description
-------|-----------
L.river(`LatLng[]` _latlngs_, `options` _options?_)| Create river polygon from latLngs array.

### Options
Option|Type|Default|Description
----|----|----|----
minWidth|`Number`|1|Min width of the river (px)
maxWidth|`Number`|10|Max width of the river (px)
ratio|`Number`|null|Ratio between river length and max width. Used to draw river depending on its length
Options, inherited from `Path` options| | |Styling options

### Methods
Method|Returns|Description
------|-------|-----------
setMinWidth(`Number`)|`this`|Set min river width (px).
setMaxWidth(`Number`)|`this`|Set max river width (px).
getMinWidth()|`Number`|Get min river width (px).
getMaxWidth()|`Number`|Get max river width (px).
useLength(`Number`)|`this`|Draw river depending on its length
convertToPolyline(`options` _options?_)|`Object`|Convert river polygon to initial polyline.

## [License](https://opensource.org/licenses/MIT)
