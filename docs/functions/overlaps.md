# function: overlaps
You can check if two extents overlap each other by using the overlaps function like `a.overlaps(b)`.  If `a` and `b` don't share the same `srs`, then the function will check overlap in three ways: (1) reprojecting `b` to the `srs` of `a`, (2) reprojecting `a` to the `srs` of `b`, (3) reprojecting both to `EPSG:4326`.  If you pass `{ strict: true } in the options`, it won't try `(2)` and `(3)`.

```js
import { GeoExtent } from 'geo-extent';

const northPole = new GeoExtent([-180, 85, 180, 90]);
const southPole = new GeoExtent([-180, -90, 180, -85]);
northPole.overlaps(southPole);
// false

const northernHemisphere = new GeoExtent([-180, 0, 180, 90]);
const southernHemisphere = new GeoExtent([-180, -90, 180, 0]);
northernHemisphere.overlaps(southernHemisphere);
// true because they technically share the equator

// only see if the tile overlaps the raster in the srs of the raster
// don't reproject the raster to the srs of the tile
raster.overlaps(tile, { strict: true })
```
