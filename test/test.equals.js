import test from "flug";
import { GeoExtent } from "../geo-extent.js";

test("equals", ({ eq }) => {
  const bbox = [-10605790.548624776, 3355891.2898323783, -10596006.609004272, 3365675.2294528796];
  const original = new GeoExtent(bbox, { srs: 3857 });
  const via4326 = original.reproj(4326).reproj(3857);
  eq(original.equals(via4326), true);

  // reprojection shift
  const via32615 = original.reproj(32615).reproj(3857);
  eq(original.equals(via32615), false);

  const similar = new GeoExtent([-10605790.5486247, 3355891.289832378, -10596006.60900427, 3365675.229452879], {
    srs: 3857
  });
  eq(original.equals(similar, { digits: 4 }), true);
  eq(original.equals(similar, { digits: 20 }), false);
});

test("NorthEast tile", ({ eq }) => {
  const a = new GeoExtent([0, 0, 90, 45], { srs: 4326 });
  const b = new GeoExtent([0, -7.081154551613622e-10, 10018754.171394622, 5621521.486192066], { srs: 3857 });

  eq(a.equals(b), true);
  eq(b.equals(a), true);
});

test("strict", ({ eq }) => {
  const a = new GeoExtent([0, 0, 90, 45], { srs: 4326 });
  const b = new GeoExtent([0, 0, 90, 45], { srs: null });

  eq(a.equals(b), false);
  eq(b.equals(a), false);
  eq(a.equals(b, { strict: false }), true);
  eq(b.equals(a, { strict: false }), true);
});
