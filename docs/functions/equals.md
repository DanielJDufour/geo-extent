# Function: equals
You can test if two extents are equivalent using the equals function.  If the extents use different [spatial reference systems](https://en.wikipedia.org/wiki/Spatial_reference_system), the
equals will reproject the second extent internally before making the comparison.
If other is not an instance of GeoExtent, it will try to convert it to a GeoExtent before making the comparison.

# basic usage
```js
// extent defined using Latitude/Longitude
const a = new GeoExtent([0, 0, 90, 45], { srs: 4326 });

// extent defined using WebMercator projection
const b = new GeoExtent([ 0, -7.081154551613622e-10, 10018754.171394622, 5621521.486192066 ], { srs: 3857 });

a.equals(b);
// true

b.equals(a);
// true
```

# strict
By default, equals will return false if one extent is srs-aware and the other is srs-unaware.  You can relax this requirement by setting strict=false;
```js
// srs-aware extent created using Latitude/Longitude
const a = new GeoExtent([0, 0, 90, 45], { srs: 4326 });

// srs-unaware extent created without a spatial reference system (srs)
const b = new GeoExtent([0, 0, 90, 45], { srs: null });

a.equals(b);
// false

a.equals(b, { strict: false });
// true
```

# precision
Because reprojection can lead to slight differences, you can specify the number of decimal digits to look at.
```js
// only check the first 4 decimal digits for equality
a.equals(b, { digits: 4 });
```
