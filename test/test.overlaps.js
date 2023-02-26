import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

test("raster overlaps tile", ({ eq }) => {
  const raster = new GeoExtent([205437, 3268524, 230448, 3280290], { srs: "EPSG:32615" });

  const tile = new GeoExtent({
    _southWest: {
      lat: -85.0511287798066,
      lng: -180
    },
    _northEast: {
      lat: 85.0511287798066,
      lng: 180
    }
  });

  eq(raster.overlaps(tile), true);
  eq(tile.overlaps(raster), true);
});
