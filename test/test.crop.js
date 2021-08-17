import test from "flug";
import { GeoExtent } from "../geo-extent.js";

test("crop kenya by NE tile", ({ eq }) => {
  const kenya = new GeoExtent([34.4282, -4.2367, 41.3861, 4.4296], { srs: 4326 });
  const tile = new GeoExtent([0, 0, 180, 90], { srs: 4326 });
  const result = kenya.crop(tile);
  eq(result.bbox, [34.4282, 0, 41.3861, 4.4296]);
});
