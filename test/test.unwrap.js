import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

test("unwrap uneccessary", ({ eq }) => {
  const extent = new GeoExtent([-180, -90, 180, 90], { srs: 4326 });
  const unwrapped = extent.unwrap();
  eq(unwrapped.length, 1);
  eq(unwrapped[0], extent);
});

test("unwrap left overflow", ({ eq }) => {
  const extent = new GeoExtent([-185, -85, 175, 90], { srs: 4326 });
  const unwrapped = extent.unwrap().map(ext => ext.bbox);
  eq(unwrapped, [[-180, -85, 180, 90]]);
});

test("unwrap right overflow", ({ eq }) => {
  const extent = new GeoExtent([175, -85, 185, 90], { srs: 4326 });
  const unwrapped = extent.unwrap().map(ext => ext.bbox);
  eq(unwrapped, [
    [175, -85, 180, 90],
    [-180, -85, -175, 90]
  ]);
});

test("unwrap overflow on both sides", ({ eq }) => {
  const extent = new GeoExtent([-190, -85, 190, 90], { srs: 4326 });
  const unwrapped = extent.unwrap().map(ext => ext.bbox);
  eq(unwrapped.length, 1);
  eq(unwrapped[0], [-180, -85, 180, 90]);
});

test("unwrap example", ({ eq }) => {
  const extent = new GeoExtent([-230, 19, -155, 45], { srs: 4326 });
  const unwrapped = extent.unwrap().map(ext => ext.bbox);
  eq(unwrapped, [
    [130, 19, 180, 45],
    [-180, 19, -155, 45]
  ]);
});

test("unwrap covers globe", ({ eq }) => {
  const extent = new GeoExtent([-185, -45, 175, 45], { srs: 4326 });
  const result = extent.unwrap();
  eq(result.length, 1);
  eq(result[0].bbox, [-180, -45, 180, 45]);
  eq(result[0].srs, "EPSG:4326");
});

test("unwrap covers globe, overflowing right", ({ eq }) => {
  const extent = new GeoExtent([-175, -45, 200, 45], { srs: 4326 });
  const result = extent.unwrap();
  eq(result.length, 1);
  eq(result[0].bbox, [-180, -45, 180, 45]);
  eq(result[0].srs, "EPSG:4326");
});
