# Leaflet.River

A class for drawing lines with different width (like rivers) on a map. Extends Polygon.

Useful when you want to show how rivers 'flow' on the map.

Simple polylines without using L.River | Using L.River
------|------
![simple polylines](https://github.com/ggolikov/Leaflet.River/tree/master/example/images/1.png) |![using L.River](https://github.com/ggolikov/Leaflet.River/tree/master/example/images/2.png)

## [Demo](https://ggolikov.github.io/Leaflet.River/example/)

## API
### Factory
Factory|Description
-------|-----------
L.river(`LatLng[]` _latlngs_, `Path options` _options?_)| Create river polygon from latLngs array.

### Methods
Method|Returns|Description
------|-------|-----------
setStartWidth(`Number`)|`this`|Set start river width (meters)
setEndWidth(`Number`)|`this`|Set end river width (meters)
getStartWidth( )|`Number`|Get start river width (meters)
getEndWidth( )|`Number`|Get end river width (meters)
getLength( )|`Number`|Get length of the river (meters). Useful when there is no length property in initial data.
convertToPolyline(<options> options?)|`Object`|Convert river polygon to initial polyline
