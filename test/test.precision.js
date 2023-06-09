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

// https://github.com/DanielJDufour/geo-extent/issues/4
test("width calculation", ({ eq }) => {
  const ext = new GeoExtent([0, 10.487811882056695, 0.351562500000006, 10.833305983642477]);
  eq(ext.width.toString() !== "NaN", true);
});

test("precise bbox string", ({ eq }) => {
  const ext = new GeoExtent("0,10.487811882056695,0.351562500000006,10.833305983642477");
  eq(ext.width, 0.351562500000006);
});

// see https://github.com/DanielJDufour/geo-extent/issues/9
test("infinity", ({ eq }) => {
  const ext = new GeoExtent([166021.4430805326, 0, Infinity, Infinity], { srs: "EPSG:26916" });
  eq(ext.area, Infinity);
  eq(ext.width, Infinity);
  eq(ext.center, { x: Infinity, y: Infinity });
});
