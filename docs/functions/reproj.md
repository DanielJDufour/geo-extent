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

# accuracy
You can control the accuracy of the reprojection.  Sometimes a bounding box will bend when reprojected
and the most extreme points won't necessarily be at the corners.
```js
extent.reproj(4326, {
  // choose between "low", "medium", "high", "higher", or "highest"
  accuracy: "highest"
});

extent.reproj(4326, {
  // you can specify the number of points to add to each side,
  // which is passed to https://github.com/danieljdufour/bbox-fns#densepolygon
  accuracy: [100, 125]
});
```