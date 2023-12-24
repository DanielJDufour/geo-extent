import test from "flug";
import "global-jsdom/register";
import "./fix-leaflet.js";
import L from "leaflet";
import { GeoExtent } from "../src/geo-extent.js";

test("Leaflet's bounds", ({ eq }) => {
  const xmin = -48;
  const ymin = 28;
  const xmax = 57;
  const ymax = 30;
  const bounds = [
    [ymin, xmin],
    [ymax, xmax]
  ];
  const rect = L.rectangle(bounds);
  const extent = new GeoExtent(rect);

  // false because bounds is not srs-aware
  eq(extent.equals(bounds), false);

  eq(extent.equals(bounds, { strict: false }), true);
});

test("L.bounds", ({ eq }) => {
  const bounds = L.bounds([
    [2409321.727264079, -965489.1535151823],
    [2577147.829325225, -835571.8532756742]
  ]);
  const extent = new GeoExtent(bounds);
  eq(extent.equals(bounds), false);
  eq(extent.equals(bounds, { strict: false }), true);
});
