import test from "flug";
import { GeoExtent } from "../geo-extent.js";

test("reproj error", ({ eq }) => {
  let msg;
  try {
    new GeoExtent([-180, -85, 180, 85]).reproj(3857);
  } catch (error) {
    msg = error.message;
  }
  eq(msg.includes("cannot reproject"), true);
});

test("north pole", ({ eq }) => {
  const northPole = new GeoExtent([-180, 85, 180, 90], { srs: 4326 });
  let msg;
  try {
    northPole.reproj(3857);
  } catch (error) {
    msg = error.message;
  }
  eq(msg.includes("failed to reproject"), true);

  eq(northPole.reproj(3857, { quiet: true }), undefined);
});
