# Function: asGeoJSON
GeoExtent provides the asGeoJSON function which returns a [GeoJSON](http://geojson.org/) Polygon representation of the extent, which is compatible with many great
geospatial libraries like [TurfJS](https://turfjs.org/) and API Services.

```js
import { GeoExtent } from 'geo-extent';

const bbox = [-72, -47, 21, 74 ];
const srs = "EPSG:4326";
const extent = new GeoExtent(bbox, { srs });
const result = extent.asGeoJSON();

```
result will be the following object:
```js
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [ -72, 74 ], // northwest corner
        [ 21, 74 ], // northeast corner
        [ 21, -47 ], // southeast corner
        [ -72, -47 ], // southwest corner
        [ -72, 74 ] // northeast corner (again), according to GeoJSON spec
      ]
    ]
  }
}
```
