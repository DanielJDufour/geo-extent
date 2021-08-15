# GeoExtent Properties
Once you've created a GeoExtent, you will have access to the following properties.

| name | description | example |
| ---- | ----------- | ------- |
| srs | The spatial reference system used by the GeoExtent.  [EPSG Codes](https://en.wikipedia.org/wiki/EPSG_Geodetic_Parameter_Dataset) will be represented as the string "EPSG:" plus the numerical code. | "EPSG:4326" |
| xmin | The left (west) edge of the extent in the x-direction (e.g. longitude) | -72 |
| xmax | The right (east) edge of the extent in the x-direction (e.g. longitude) | 21 |
| ymin | The bottom (south) edge of the extent in the y-direction (e.g. latitude) | -47 |
| ymax | The top (north) edge of the extent in the y-direction (e.g. latitude) | 74 |
| bbox | A bounding box array representation of [xmin, ymin, xmax, ymax] | [-72, -47, 21, 74 ] |
| height | The height of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system).  This is often either degrees latitude or meters. | 121 |
| width | The width of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system).  This is often either degrees longitude or meters. | 93 |
| area | The area of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system). This is often in degrees or meters squared. Because this uses the units of the srs, this is just an approximation and can't be relied upon as the "true" area. | 11253 |
| center | The center of the extent or half-way point along the x and y directions. | { x: -25.5, y: 13.5 } |
| bottomLeft | The bottom-left corner of the extent | { x: -72, y: -47 } |
| bottomRight | The bottom-right corner of the extent | { x: 21, y: -47 } |
| topLeft | The top-left corner of the extent | { x: -72, y: 74 } |
| topRight | The top-right corner of the extent | { x: 21, y: 74 } |
| str | A string representation of the GeoExtent's bbox. Helpful for passing as a parameter to API Services. | '-72,-47,21,74' |
