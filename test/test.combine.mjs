import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

test("combine southern and northern hemisphers", ({ eq }) => {
  const ne = new GeoExtent({ xmin: 0, ymin: 0, xmax: 180, ymax: 90, srs: 4326 });
  const sw = new GeoExtent({ xmin: -180, ymin: -90, xmax: 0, ymax: 0, srs: 4326 });
  const combined = new GeoExtent({ xmin: -180, ymin: -90, xmax: 180, ymax: 90, srs: 4326 });
  eq(ne.combine(sw), combined);
  eq(sw.combine(ne), combined);
});
