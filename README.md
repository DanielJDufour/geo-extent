# geo-extent
> Simple, Modern Geospatial Bounding Boxes

# features
- immutable: all functions return a new GeoExtent
- chainable: ex: `extent.reproj(3857).crop(other).toGeoJSON()`
- universal input: works with bbox arrays, xy corner points, and Leaflet bounds
- interoperability: integrates well with Leaflet, OpenLayers, and ESRI
- precise: avoids common floating-point arithmetic issues by using [big.js](https://www.npmjs.com/package/big.js)
- typescript: includes type definitions

# install
```bash
npm install geo-extent
```

# basic usage
```js
import { GeoExtent } from 'geo-extent';

// extent of web mercator tile for x=964, y=1704, and z=12
const tile = new GeoExtent([-10605790.548624776, 3355891.2898323783, -10596006.609004272, 3365675.2294528796], { srs: 3857 });

// convert tile extent to Latitude/Longitude
const latLngBBox = tile.reproj(4326).bbox;
// latLngBBox is [-95.27343750000001, 28.84467368077178, -95.185546875, 28.921631282421277]

// extent of a Cloud-Optimized GeoTIFF (COG) in UTM Projection 32615
const cog = new GeoExtent([259537.6, 3195976.8000000003, 281663.2, 3217617.6], { srs: 32615 });

// partial is the part of the tile that overlaps the extent of the COG
const partial = tile.crop(cog);
// partial is equivalent to GeoExtent([-10605790.548624776, 3358990.12945602, -10601914.152717294, 3365675.2294528796], 3857);
```

# documentation
For more functions and examples, please consult the documentation at https://github.com/DanielJDufour/geo-extent/tree/main/docs

# used by 
- [GeoRasterLayer for Leaflet](https://github.com/GeoTIFF/georaster-layer-for-leaflet)
 
