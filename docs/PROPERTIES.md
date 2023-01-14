# GeoExtent Properties
Once you've created a GeoExtent, you will have access to the following properties.

| name | example | description |
| ---- | ----------------------------- | ------- |
| bbox | [-72, -47, 21, 74 ] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| A bounding box array representation of [xmin, ymin, xmax, ymax] |
| bbox_str | ["-72", "-47", "21", "74" ] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Array of high-precision strings |
| srs | "EPSG:4326" | The spatial reference system used by the GeoExtent.  [EPSG Codes](https://en.wikipedia.org/wiki/EPSG_Geodetic_Parameter_Dataset) will be represented as the string "EPSG:" plus the numerical code. |
| xmin | -72 | The left (west) edge of the extent in the x-direction (e.g. longitude) |
| xmin_str | "-72" | Higher precision string version of xmin |
| xmax | 21 | The right (east) edge of the extent in the x-direction (e.g. longitude) |
| xmax_str | "21" | Higher precision string version of xmax |
| ymin | -47 | The bottom (south) edge of the extent in the y-direction (e.g. latitude) |
| ymin_str | "-47" | Higher precision string version of ymin |
| ymax | 74 | The top (north) edge of the extent in the y-direction (e.g. latitude) |
| ymax_str | "74" | Higher precision string version of ymax |
| height | 121 | The height of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system).  This is often either degrees latitude or meters. |
| height_str | "121" | Higher precision string version of height |
| width | 93 | The width of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system).  This is often either degrees longitude or meters. |
| width_str | "93" | Higher precision string version of width |
| area | 11253 | The area of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system). This is often in degrees or meters squared. Because this uses the units of the srs, this is just an approximation and can't be relied upon as the "true" area. |
| area_str | "11253" | Higher precision string version of area |
| perimeter | 428 | The perimeter of the extent in units of the [srs](https://en.wikipedia.org/wiki/Spatial_reference_system). This is often in degrees or meters. Because this uses the units of the srs, this is just an approximation and can't be relied upon as the "true" perimeter.
| perimeter_str | "428" | Higher precision string version of perimeter |
| center | { x: -25.5, y: 13.5 } | The center of the extent or half-way point along the x and y directions. |
| center_str | { x: "-25.5", y: "13.5" } | Higher precision string version of center |
| bottomLeft | { x: -72, y: -47 } | The bottom-left corner of the extent |
| bottomRight | { x: 21, y: -47 } | The bottom-right corner of the extent |
| topLeft | { x: -72, y: 74 } | The top-left corner of the extent |
| topRight | { x: 21, y: 74 } | The top-right corner of the extent |
| str | '-72,-47,21,74' | A high-precision string representation of the GeoExtent's bbox. Helpful for passing as a parameter to API Services. |
| leafletBounds | [<br/>&nbsp;&nbsp;[-47, -72],<br/>&nbsp;&nbsp;[74, 21]<br/>] | An array of two corners in form accepted by LeafletJS, which is [ [ymin, xmin], [ymax, xmax] ] |
| wkt | "POLYGON((21 -47,21 74,-72 74,-72 -47,21 -47))" | [OGC Well-Known Text Polygon](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) |
| ewkt | "SRID=4326;POLYGON((21 -47,21 74,-72 74,-72 -47,21 -47))" | [Extended WKT Polygon](https://postgis.net/docs/ST_AsEWKT.html) used by PostGIS (includes SRID) |