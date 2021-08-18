# function: overlaps
You can check if two extents overlap each other by using the overlaps function like `a.overlaps(b)`.  If `b` uses a different `srs` than `a`, the function
will internally clone and reproject `b` to the `srs` of `a` before checking overlap.

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
```
