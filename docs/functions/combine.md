# Function: combine
You can `combine` two instances of GeoExtent together.  If you run `a.combine(b)`, the result will use the [spatial reference system](https://en.wikipedia.org/wiki/Spatial_reference_system) of extent `a`. 
If `a` and `b` don't share the same srs, `combine` will internally [clone](https://github.com/DanielJDufour/geo-extent/blob/main/docs/functions/clone.md) and reproject `b` before combining using the [reproj](https://github.com/DanielJDufour/geo-extent/blob/main/docs/functions/reproj.md) function.

```js
import { GeoExtent } from 'geo-extent';

const northernHemisphere = new GeoExtent([-180, 0, 180, 90], { srs: 4326 });
const southernHemisphere = new GeoExtent([-180, -90, 180, 0], { srs: 4326 });
const globe = northernHemisphere.combine(southernHemisphere);
```
