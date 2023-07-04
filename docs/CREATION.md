# Creating a GeoExtent
You can create a GeoExtent from many different types of objects including Bounding Box Arrays, Leaflet Bounds, ESRI Extents, and more!
You simply call `new GeoExtent(data)`.  If your data doesn't have projection information, 
you can set [the spatial reference system](https://en.wikipedia.org/wiki/Spatial_reference_system) by passing in an additional options object 
with the srs property set like `new GeoExtent(data, { srs: 4326 })`.  Please see more examples below

## Creating from a Bounding Box Array
Many libraries and formats define a bounding box (bbox) as an array of 4 numbers representing [xmin, ymin, xmax, ymax].
In the case of the 4326 projection that uses Latitude/Longitude, xmin is the western most edge of the bbox,
xmax is the easternmost edge of the bbox, ymin is the southern most edge of the bbox, and ymax is the northern most edge of the bbox.
For example, a bbox that covers the northern hemisphere would be `[-180, 0, 180, 90]`.  In order to create a GeoExtent from this data,
see the example below:
```js
# creating a GeoExtent from a bbox array
import { GeoExtent } from 'geo-extent';

const bbox = [-180, 0, 180, 90];
const extent = new GeoExtent(bbox, { srs: 4326 });
```
You can also create an extent from a bounding box array of strings.  (Sometimes you want to store numbers as strings for increased precision not susceptible to floating-point arithmetic issues).
```js
new GeoExtent(['7698736.8577886725053', '160793.853073251455', '10066450.2459496622445', '1322636.683007621705']);
```
You can also create an extent from a singular stringified array.
```js
new GeoExtent('7698736.8577886725053,160793.853073251455,10066450.2459496622445,1322636.683007621705');
```

## Creating from LeafletJS Bounds Array
[LeafletJS](https://leafletjs.com/) will sometimes represent bounds as an array of two corner points, the southest and northeast.
You can create extent from these points as the following shows:
```js

const minLongitude = -36.227;
const minLatitude = -20.712;
const southWest = [minLatitude, minLongitude];

const maxLongitude = 74.125;
const maxLatitude = 40.774;
const northEast = [maxLatitude, maxLongitude];

const bounds = [southWest, northEast];

// fits the LeafletJS map to the bounds
map.fitBounds(bounds);

// create a GeoExtent from the bounds
// srs: 4326 indicates the 4326 projection that uses Latitude/Longitude
const extent = new GeoExtent(bounds, { srs: 4326 });
```

## Creating from LeafletJS LatLngBounds Object
[LeafletJS](https://leafletjs.com/) also allows you to create a [LatLngBounds](https://leafletjs.com/reference-1.7.1.html#latlngbounds) object which provides additional functionality like padding the bounds.  You can also create a GeoExtent from this object as well.
```js
// bounds as a LatLngBounds object
const latLngBounds = new L.LatLngBounds(southWest, northEast);

// assumes EPSG:4326
const extent = new GeoExtent(latLngBounds);

// if for some reason, you want to hack/override the default srs "EPSG:4326" for LatLngBounds objects
const extent = new GeoExtent(latLngBounds, { srs: "urn:ogc:def:crs:EPSG::4326" });
```

## Creating from a GeoJSON BBox
The [GeoJSON] spec allows you to specify a bounding box for your feature.  When this property is available, you may create a GeoExtent from this GeoJSON.
```js
const geojson = {
    bbox: [-180, -90, 180, 90] // global bbox
    properties: { ... }
    geometry: {
        type: "Polygon",
        coordinates: [ ... ]
    }
};

const extent = new GeoExtent(geojson, { srs: 4326 });
```

## Creating from a Point
Philosophically speaking, points are really just extents with zero width and height, so you can create an extent from a point if you wish.
GeoExtent works with points from [LeaflefJS](https://leafletjs.com/reference-1.7.1.html#point) and [OpenLayers](https://openlayers.org/en/latest/apidoc/module-ol_geom_Point-Point.html).  You can also pass in a point in the forms `[x, y]`, `[longitude, latitude]`, and `{ x, y }`;
```js
// decimal degrees for Washington, D.C.
const longitude = -77.0147;
const latitude = 38.9101;

// points as [x, y] or [longitude, latitude] array
new GeoExtent([longitude, latitude], { srs: 4326 });

// point as { x, y } object
new GeoExtent({ x: longitude, y: latitude }, { srs: 4326 });

// LeafletJS Point
import * as L from 'leaflet';
const pointFromLeaflet = L.point(longitude, latitude);
new GeoExtent(pointFromLeaflet, { srs: 4326 });

// OpenLayers Point
import Point from 'ol/geom/Point';
const pointFromOpenLayers = new Point([longitude, latitude);
new GeoExtent(pointFromOpenLayers, { srs: 4326 } )
```

## Creating from Geography Markup Language Envelope
This uses [geography-markup-language](https://github.com/DanielJDufour/geography-markup-language).
```js
new GeoExtent(`
  <gml:Envelope srsDimension="2" srsName="urn:ogc:def:crs:EPSG:9.0:4326">
    <gml:lowerCorner>42.943 -71.032</gml:lowerCorner>
     <gml:upperCorner>43.039 -69.856</gml:upperCorner>
  </gml:Envelope>
`);
```
