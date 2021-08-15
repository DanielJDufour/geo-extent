# GeoExtent Properties
Once you've created a GeoExtent, you will have access to the following properties.

| name | example | description |
| ---- | ----------- | ------- |
| srs | "EPSG:4326" | The spatial reference system used by the GeoExtent.  [EPSG Codes](https://en.wikipedia.org/wiki/EPSG_Geodetic_Parameter_Dataset) will be represented as the string "EPSG:" plus the numerical code. |
| xmin | -72 | The left (west) edge of the extent in the x-direction (e.g. longitude) |
| xmax | 21 | The right (east) edge of the extent in the x-direction (e.g. longitude) |
| ymin | -47 | The bottom (south) edge of the extent in the y-direction (e.g. latitude) |
| ymax | 74 | The top (north) edge of the extent in the y-direction (e.g. latitude) |
| bbox | [-72, -47, 21, 74 ] | A bounding box array representation of [xmin, ymin, xmax, ymax] |
| height | 121 | The height of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system).  This is often either degrees latitude or meters. |
| width | 93 | The width of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system).  This is often either degrees longitude or meters. |
| area | 11253 | The area of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system). This is often in degrees or meters squared. Because this uses the units of the srs, this is just an approximation and can't be relied upon as the "true" area. |
| center | { x: -25.5, y: 13.5 } | The center of the extent or half-way point along the x and y directions. |
| bottomLeft | { x: -72, y: -47 } | The bottom-left corner of the extent |
| bottomRight | { x: 21, y: -47 } | The bottom-right corner of the extent |
| topLeft | { x: -72, y: 74 } | The top-left corner of the extent |
| topRight | { x: 21, y: 74 } | The top-right corner of the extent |
| str | '-72,-47,21,74' | A string representation of the GeoExtent's bbox. Helpful for passing as a parameter to API Services. |
