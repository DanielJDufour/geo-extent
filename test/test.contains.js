import test from "flug";
import { GeoExtent } from "../geo-extent.js";

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
