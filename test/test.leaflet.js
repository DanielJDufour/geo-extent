import test from "flug";
import "global-jsdom/register";
import Leaflet from "leaflet";
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
  const rect = Leaflet.rectangle(bounds);
  const extent = new GeoExtent(rect);

  // false because bounds is not srs-aware
  eq(extent.equals(bounds), false);

  eq(extent.equals(bounds, { strict: false }), true);
});
