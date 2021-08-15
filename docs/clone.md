# Function: clone
You can call the clone function to get back an exact replica of the GeoExtent.  This is helpful if you want to use a modified version of the extent
without changing the original object.

In the example below, we clone the extent and then add a custom function to it that logs the time it takes to convert an extent to a GeoJSON.
```js
import { GeoExtent } from 'geo-extent';

const extent = new GeoExtent([-180, -90, 180, 90], { srs: 4326 });

const clonedExtent = extent.clone();

clonedExtent.toGeoJSONTimed = () => {
    console.time("toGeoJSON");
    const result = clonedExtent.toGeoJSON();
    console.time("toGeoJSON");
    return result;
});
```
