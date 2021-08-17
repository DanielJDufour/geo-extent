# Function: contains
GeoExtent provides a contains function which checks if an extent completely contains another.  It will normalize the extents, making sure the comparison is done using the same spatial reference system.

```js
import { GeoExtent } from "geo-extent";

// rought extent of the continental United States of America
const usa = new GeoExtent([-125.248182, 25.241145, -65.308966, 49.092881], { srs: 4326 });

const northernHemisphere = new GeoExtent([-180, 0, 180, 90], { srs: 4326 });

northernHemisphere.contains(usa)
// true because the USA is in the northern hemisphere

northernHemisphere.contains(peru)
// false
```
