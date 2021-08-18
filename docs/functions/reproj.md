# function: reproj
The `reproj` function is arguably the most important function in GeoExtent and is at the heart of many of the functions.
This function essentially calls [reproject-bbox](https://github.com/DanielJDufour/reproject-bbox) on the extent and returns a new GeoExtent.
It's first argument `to` is the new `srs` or what we are reprojecting to.  It can be a number, a string like `EPSG:4326`, [well-known text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_coordinate_reference_systems), or a [proj4js](http://proj4js.org/) string.

# errors
If the reprojection failed for some reason, such as the extent is outside the bounds of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system), then this function will throw an error.  For example,
if you try to reproject the north pole to web mercator then you will receive an error because web mercator doesn't not work at that high of a latitude.

# quiet mode
If you would prefer that reproj return `undefined` instead of throwing an error, you can turn on quiet mode.
```js
const northPole = new GeoExtent([-180, 85, 180, 90], { srs: 4326 });

northPole.reproj(3857);
// throws Error: [geo-extent] failed to reproject -180,85,180,90 from EPSG:4326 to 3857

northPole.reproj(3857, { quiet: true });
// undefined
```
