# Leaflet.River

A class for drawing lines with different width (like rivers) on a map. Extends Polygon.

Useful when you want to show how rivers 'flow' on the map.

Simple polylines without using Leaflet.River | Using Leaflet.River
------|------
![simple polylines](https://cloud.githubusercontent.com/assets/17549928/20976102/8390b408-bcb2-11e6-8dd2-7354f4aa86cf.png) |![using Leaflet.River](https://cloud.githubusercontent.com/assets/17549928/20976101/838f5680-bcb2-11e6-8d49-3da1a3ecd25f.png)

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
