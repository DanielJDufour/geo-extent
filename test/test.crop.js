import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

test("crop kenya by NE tile", ({ eq }) => {
  const kenya = new GeoExtent([34.4282, -4.2367, 41.3861, 4.4296], { srs: 4326 });
  const tile = new GeoExtent([0, 0, 180, 90], { srs: 4326 });
  const result = kenya.crop(tile);
  eq(result.bbox, [34.4282, 0, 41.3861, 4.4296]);
});

test("crop by self-overlapping extent", ({ eq }) => {
  // technically, this lyr extent is self-overlapping
  const lyr = new GeoExtent([-180.00092731781535, 15.563268747733936, 179.99907268220255, 74.71076874773686], {
    srs: 4326
  });

  const tile = new GeoExtent([-20037508.342789244, -20037508.342789255, 20037508.342789244, 20037508.342789244], {
    srs: 3857
  });

  const result = tile.crop(lyr, { debug: true });
  eq(result.srs, tile.srs);
  eq(result.bbox, [-20037508.342789244, 1754201.542789432, 20037508.342789244, 12808999.953599941]);
  eq(result.width, 40075016.68557849);
});

test("crop by left-overflow extent", ({ eq }) => {
  const tile = new GeoExtent([-20037508.342789244, -20037508.342789255, 20037508.342789244, 20037508.342789244], {
    srs: 3857
  });

  // technically, this lyr extent is self-overlapping
  const lyr = new GeoExtent([-180.00092731781535, 15.563268747733936, 0, 74.71076874773686], {
    srs: 4326
  });

  const result = tile.crop(lyr, { debug: true });
  eq(result.srs, tile.srs);
  eq(result.bbox, [-20037508.342789244, 1754201.542789432, 20037508.342789244, 12808999.953599941]);
  eq(result.width, 40075016.68557849);
});

test("crop with no overlap", ({ eq }) => {
  const kenya = new GeoExtent([34.4282, -4.2367, 41.3861, 4.4296], { srs: 4326 });
  const nw = new GeoExtent([-180, 0, 0, 90], { srs: 4326 });
  const result = nw.crop(kenya);
  eq(result, null);
});

test("crop world tile", ({ eq }) => {
  const extentOfTileInMapCRS = new GeoExtent([-20037508.342789244, -7.081154551613622e-10, 0, 20037508.342789244], {
    srs: "EPSG:3857"
  });

  const cutline = new GeoExtent([205437, 3268524, 230448, 3280290], { srs: "EPSG:32615" });

  const cropped = extentOfTileInMapCRS.crop(cutline);
  console.log({ cropped });
});
