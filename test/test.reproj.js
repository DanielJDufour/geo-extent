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
  eq(
    northPole.reproj(3857, { shrink: true }).bbox,
    [-20037508.342789244, 19971868.880408563, 20037508.342789244, 49411788.9015311]
  );
  eq(
    northPole.reproj(3857, { shrink: true, shrink_density: 100 }).bbox,
    [-20037508.342789244, 19971868.880408563, 20037508.342789244, 49411788.9015311]
  );
  eq(northPole.reproj(3857, { split: false, quiet: true })?.js, undefined);
});

test("reproject extent that crosses 180th meridian", ({ eq }) => {
  // technically this layer is self-overlapping
  const lyr = new GeoExtent([-180.00092731781535, 15.563268747733936, 179.99907268220255, 74.71076874773686], {
    srs: 4326
  });
  const result = lyr.reproj(3857, { debug_level: 0 });
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
  eq(
    extent.reproj(4326, { density: "lowest", split: false }).bbox,
    [-104.15783650020958, 22.33428366410961, -51.769705847928805, 56.48158793780131]
  );
  eq(
    extent.reproj(4326, { density: "low", split: false }).bbox,
    [-104.15783650020958, 22.33428366410961, -51.769705847928805, 57.099578714450445]
  );
  eq(
    extent.reproj(4326, { density: "medium", split: false }).bbox,
    [-104.15783650020958, 22.33428366410961, -51.769705847928805, 57.52407399197629]
  );
  eq(
    extent.reproj(4326, { density: "high", split: false }).bbox,
    [-104.15783650020958, 22.33428366410961, -51.769705847928805, 57.53583071204875]
  );
  eq(
    extent.reproj(4326, { density: "higher", split: false }).bbox,
    [-104.15783650020958, 22.33428366410961, -51.769705847928805, 57.53588499736936]
  );
  eq(
    extent.reproj(4326, { density: "highest", split: false }).bbox,
    [-104.15783650020958, 22.33428366410961, -51.769705847928805, 57.535885041786784]
  );
  eq(
    extent.reproj(4326, { density: "highest", split: true }).bbox,
    [-104.15783650020958, 22.33428366410961, -51.769705847928805, 57.53588504321043]
  );
});

test("reproj to inf", ({ eq }) => {
  const bbox = [-10018754.171394622, -7.081154551613622e-10, 0, 10018754.171394624];
  const srs = "EPSG:3857";

  let msg;
  let result;
  try {
    result = new GeoExtent(bbox, { srs }).reproj(26916, { debug: false, density: 100 });
  } catch (error) {
    msg = error.message;
  }
  eq(
    msg,
    "[geo-extent] failed to reproject -10018754.171394622,-7.081154551613622e-10,0,10018754.171394624 from EPSG:3857 to EPSG:26916"
  );

  eq(new GeoExtent(bbox, { srs }).reproj(26916, { allow_infinity: true }).bbox, [
    166021.4430805326,
    -187729840.1254552,
    Infinity,
    Infinity
  ]);
});

test("south pole", ({ eq }) => {
  const ext = new GeoExtent([-3950000, -3943750, 3950000, 4350000], { srs: "EPSG:3031" });
  eq(
    ext.reproj(4326, { debug_level: 10, density: "highest", split: true }).bbox,
    [-179.9942619157211, -90, 180, -39.36335491661697]
  );
});

test("split", ({ eq }) => {
  const ext = new GeoExtent([-180, -85.0511287798066, 179.99856, 85.0511287798066], { srs: "EPSG:4326" });
  const reprojected = ext.reproj(3857).bbox;
  eq(reprojected, [-20037508.342789244, -20037508.342789255, 20037348.0427225, 20037508.342789244]);
});

test("split again", ({ eq }) => {
  const ext = new GeoExtent([-180, -89.99928, 179.99856, 90], { srs: "EPSG:4326" });
  const reprojected = ext.reproj("EPSG:3857", { debug_level: 0, shrink: true });
  eq(reprojected.bbox, [-20037508.342789244, -76394987.3448674, 20037348.0427225, 30976473.682611432]);
});
