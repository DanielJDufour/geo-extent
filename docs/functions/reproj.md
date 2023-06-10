# function: reproj
The `reproj` function is arguably the most important function in GeoExtent and is at the heart of many of the functions.
This function essentially calls [reproject-bbox](https://github.com/DanielJDufour/reproject-bbox) on the extent and returns a new GeoExtent.
It's first argument `to` is the new `srs` or what we are reprojecting to.  It can be a number, a string like `EPSG:4326`, [well-known text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_coordinate_reference_systems), or a [proj4js](http://proj4js.org/) string.

## fallback strategy
If direct reprojection fails, reproj will attempt to reproject through an intermediary projection.  It'll attempt
to reproject to 4326 (aka Latitude/Longitude) and then reproject to the desired projection.

## errors
If the reprojection fails even after the fallback is tried, such as the extent is outside the bounds of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system), then this function will throw an error.  For example,
if you try to reproject the north pole to web mercator then you will receive an error because web mercator doesn't not work at that high of a latitude.

## infinity
Some projections are bound to certain regions, so reprojection can sometimes lead to infinity values.  By default,
reproj will throw an error.  However, if you are okay with infinity values, you can pass in an optional parameter
`allow_infinity: true`.

## quiet mode
If you would prefer that reproj return `undefined` instead of throwing an error, you can turn on quiet mode.
```js
const northPole = new GeoExtent([-180, 85, 180, 90], { srs: 4326 });

northPole.reproj(3857);
// throws Error: [geo-extent] failed to reproject -180,85,180,90 from EPSG:4326 to 3857

northPole.reproj(3857, { quiet: true });
// undefined
```

## density
You can control the accuracy of the reprojection by passing in a point density parameter.
Sometimes a bounding box will bend when reprojected and the most extreme points won't necessarily be at the corners.  If you care for speed more than accuracy, you should choose a lower value.
By default, reproj uses a "high" density adding a 100 points to each side before reprojecting.
```js
extent.reproj(4326, {
  // choose between "lowest", "low", "medium", "high", "higher", or "highest"
  density: "high"
});

extent.reproj(4326, {
  // you can also directly specify the number of points to add to each side,
  // which is passed to https://github.com/danieljdufour/bbox-fns#densepolygon
  density: [100, 125]
});
```