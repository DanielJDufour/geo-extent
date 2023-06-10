import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

test("contains", ({ eq }) => {
  const area = new GeoExtent([-1252344.2714243277, -7.081154551613622e-10, 0, 1252344.2714243277], { srs: 3857 });
  const globe = new GeoExtent([-180, -89.99928, 179.99856, 90], { srs: 4326 });
  const result = globe.contains(area);
  eq(result, true);
});

test("DC in Continental USA", ({ eq }) => {
  const usa = new GeoExtent([-125.248182, 25.241145, -65.308966, 49.092881], { srs: 4326 });
  const northernHemisphere = new GeoExtent([-180, 0, 180, 90], { srs: 4326 });
  eq(northernHemisphere.contains(usa), true);
  eq(usa.contains(northernHemisphere), false);
});

test("check if UTM contains Web Mercator tile", ({ eq }) => {
  // [geo-extent] failed to reproject -20037508.342789244,-7.081154551613622e-10,0,20037508.342789244 from EPSG:3857 to EPSG:32615
  // equivalent to [-96.0417..., 29.5116..., -95.7808..., 29.6233...] in 4326
  const utm = new GeoExtent([205437, 3268524, 230448, 3280290], { srs: "EPSG:32615" });

  // top left quarter of the world
  const tile = new GeoExtent([-20037508.342789244, -7.081154551613622e-10, 0, 20037508.342789244], {
    srs: "EPSG:3857"
  });

  // aoi completely falls within tile
  eq(utm.contains(tile), false);

  eq(tile.contains(utm), true);
});
