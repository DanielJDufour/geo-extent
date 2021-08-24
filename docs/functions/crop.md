# Function: Crop
Each GeoExtent has a crop function which allows you to make sure an extent doesn't exceed the boundaries of another extent.  In other words, if `c` is the extent of a county and `t` is the extent of a mercator tile, then `c.crop(t)` would return the extent of the county that falls within the tile.
If `c` and `t` don't share the same [srs](https://en.wikipedia.org/wiki/Spatial_reference_system), then GeoExtent will automatically and internally [clone](https://github.com/DanielJDufour/geo-extent/blob/main/docs/functions/clone.md) `t` and [reproject](https://github.com/DanielJDufour/geo-extent/blob/main/docs/functions/reproj.md) the clone to the srs of `c` before cropping with it.  If there is no overlap between `c` and `t`, then `c.crop(t)` will return null;

```js
import { GeoExtent } from 'geo-extent';

// very rought extent of the country of Kenya
// which crosses over the equator
const kenya = new GeoExtent([34.4282, -4.2367, 41.3861, 4.4296], { srs: 4326 });

// extent of tile for north-eastern quarter of the globe
const tile = new GeoExtent([0, 0, 180, 90], { srs: 4326 });

const result = kenya.crop(tile);
```
result will be an extent representing the part of Kenya
that falls within the tile (for the north-eastern part of the globe)
```js
GeoExtent {
  srs: 'EPSG:4326',
  xmin: 34.4282,
  ymin: 0, // cropping changed ymin from -4.2367 to 0
  xmax: 41.3861,
  ymax: 4.4296,
  width: 6.957900000000002,
  height: 4.4296,
  bottomLeft: { x: 34.4282, y: 0 },
  bottomRight: { x: 41.3861, y: 0 },
  topLeft: { x: 34.4282, y: 4.4296 },
  topRight: { x: 41.3861, y: 4.4296 },
  area: 30.820713840000007,
  bbox: [ 34.4282, 0, 41.3861, 4.4296 ],
  center: { x: 37.90715, y: 2.2148 },
  str: '34.4282,0,41.3861,4.4296'
}
```
