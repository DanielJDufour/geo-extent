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

const extent = new GeoExtent([-180, 0, 180, 90], { srs: 4326 });
```
