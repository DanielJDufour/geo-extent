import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

test("precision", ({ eq }) => {
  const bbox = ["7698736.8577886725053", "160793.853073251455", "10066450.2459496622445", "1322636.683007621705"];
  const ext = new GeoExtent(bbox);
  eq(ext.width, 2367713.3881609896);
  eq(ext.width_str, "2367713.3881609897392");
  eq(ext.xmin_str, bbox[0]);
  eq(ext.bbox_str, bbox);
  eq(ext.str, bbox.join(","));
});
