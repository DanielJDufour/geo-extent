import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

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

test("reproject extent that crosses 180th meridian", ({ eq }) => {
  // technically this layer is self-overlapping
  const lyr = new GeoExtent([-180.00092731781535, 15.563268747733936, 179.99907268220255, 74.71076874773686], {
    srs: 4326
  });
  const result = lyr.reproj(3857);
  eq(result.bbox, [-20037508.342789244, 1754201.542789432, 20037508.342789244, 12808999.953599941]);
});

test("reproject extent that crosses 180th meridian and stops at prime meridian", ({ eq }) => {
  const [XMIN_WEBMERC, YMIN_WEBMERC, XMAX_WEBMERC, YMAX_WEBMERC] = new GeoExtent([-180, -80, 180, 80], {
    srs: 4326
  }).reproj(3857).bbox;
  const lyr = new GeoExtent([-180.00092731781535, 15.563268747733936, 0, 74.71076874773686], {
    srs: 4326
  });
  const result = lyr.reproj(3857);
  eq(result.bbox, [-20037508.342789244, 1754201.542789432, 20037508.342789244, 12808999.953599941]);
  eq(result.xmin, XMIN_WEBMERC);
  eq(result.xmax, XMAX_WEBMERC);
});

test("reproject to wkt", ({ eq }) => {
  const wkt = `PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]`;
  const [XMIN_WEBMERC, YMIN_WEBMERC, XMAX_WEBMERC, YMAX_WEBMERC] = new GeoExtent([-180, -80, 180, 80], {
    srs: 4326
  }).reproj(wkt).bbox;
  const lyr = new GeoExtent([-180.00092731781535, 15.563268747733936, 0, 74.71076874773686], {
    srs: 4326
  });
  const result = lyr.reproj(wkt);
  eq(result.bbox, [-20037508.342789244, 1754201.542789432, 20037508.342789244, 12808999.953599941]);
  eq(result.xmin, XMIN_WEBMERC);
  eq(result.xmax, XMAX_WEBMERC);
  eq(result.srs, "EPSG:3857");
});

test("reproject from code to same wkt", ({ eq }) => {
  const wkt = `PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]`;
  const old_bbox = [-20037508.342789244, 1754201.542789432, 20037508.342789244, 12808999.953599941];
  const new_bbox = new GeoExtent(old_bbox, { srs: wkt }).reproj(3857).bbox;
  eq(old_bbox, new_bbox);
});

test("reproject extent that bends out", ({ eq }) => {
  const bbox = [-2316545, -1971615, 1015455, 1512385];
  const srs = 6623;
  const extent = new GeoExtent(bbox, { srs });
  eq(extent.reproj(4326, { density: "lowest" }).bbox, [
    -104.15783650020958,
    22.33428366410961,
    -51.769705847928805,
    56.48158793780131
  ]);
  eq(extent.reproj(4326, { density: "low" }).bbox, [
    -104.15783650020958,
    22.33428366410961,
    -51.769705847928805,
    57.099578714450445
  ]);
  eq(extent.reproj(4326, { density: "medium" }).bbox, [
    -104.15783650020958,
    22.33428366410961,
    -51.769705847928805,
    57.52407399197629
  ]);
  eq(extent.reproj(4326, { density: "high" }).bbox, [
    -104.15783650020958,
    22.33428366410961,
    -51.769705847928805,
    57.53583071204875
  ]);
  eq(extent.reproj(4326, { density: "higher" }).bbox, [
    -104.15783650020958,
    22.33428366410961,
    -51.769705847928805,
    57.53588499736936
  ]);
  eq(extent.reproj(4326, { density: "highest" }).bbox, [
    -104.15783650020958,
    22.33428366410961,
    -51.769705847928805,
    57.535885041786784
  ]);
});
