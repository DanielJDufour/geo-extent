# Function: asEsriJSON
GeoExtent provides the asEsriJSON function which returns an ESRI JSON representation of the extent, compatiable with ESRI JavaScript and ArcGIS Server APIs.

```js
import { GeoExtent } from 'geo-extent';

const bbox = [-72, -47, 21, 74 ];
const srs = "EPSG:4326";
const extent = new GeoExtent(bbox, { srs });
const result = extent.asEsriJSON();

```
result will be the following object:
```json
{
  "xmin": -72,
  "ymin": -47,
  "xmax": 21,
  "ymax": 74,
  "spatialReference": {
    "wkid": "EPSG:4326"
   }
}
```
