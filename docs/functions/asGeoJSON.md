# Function: asGeoJSON
GeoExtent provides the asGeoJSON function which returns a [GeoJSON](http://geojson.org/) Polygon representation of the extent, which is compatible with many great geospatial libraries like [TurfJS](https://turfjs.org/) and API Services.

```js
import { GeoExtent } from 'geo-extent';

const bbox = [-72, -47, 21, 74 ];
const srs = "EPSG:4326";
const extent = new GeoExtent(bbox, { srs });

extent.asGeoJSON();
{
  type: "Feature",
  bbox: [-72, -47, 21, 74],
  geometry: {
    type: "Polygon",
    coordinates: [
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

## reprojection
If your extent has an [srs](https://en.wikipedia.org/wiki/Spatial_reference_system) defined other than "EPSG:4326", 
asGeoJSON will convert your extent to a polygon and then 
reproject it.

```js
const extent = new GeoExtent([205437, 3268524, 230448, 3280290], { srs: 32615 });

extent.asGeoJSON();
{
  type: "Feature",
  bbox: [-96.04179138404174, 29.511648519248368, -95.78087194851625, 29.623358437472554],
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-96.04179138404174, 29.61768905503229],
        [-96.03861274870584, 29.511648519248368],
        [-95.78087194851625, 29.517293624194604],
        [-95.78378185428468, 29.623358437472554],
        [-96.04179138404174, 29.61768905503229]
      ]
    ]
  }
}
```
