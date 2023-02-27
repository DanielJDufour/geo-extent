import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

test("asGeoJSON with in 4326 projection", ({ eq }) => {
  const bbox = [-72, -47, 21, 74];
  const srs = 4326;
  const expected = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-72, 74],
          [-72, -47],
          [21, -47],
          [21, 74],
          [-72, 74]
        ]
      ]
    },
    bbox: [-72, -47, 21, 74]
  };
  eq(new GeoExtent(bbox, { srs: null }).asGeoJSON(), expected);
  eq(new GeoExtent(bbox, { srs: undefined }).asGeoJSON(), expected);
  eq(new GeoExtent(bbox, { srs }).asGeoJSON(), expected);
});

test("asGeoJSON", ({ eq }) => {
  const extent = new GeoExtent([205437, 3268524, 230448, 3280290], { srs: 32615 });
  eq(extent.asGeoJSON(), {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-96.04179138404174, 29.61768905503229],
          [-96.03861274870584, 29.511648519248368],
          [-95.78087194851625, 29.517293624194604],
          [-95.78378185428468, 29.623358437472554],
          [-96.04179138404174, 29.61768905503229]
        ]
      ]
    },
    bbox: [-96.04179138404174, 29.511648519248368, -95.78087194851625, 29.623358437472554]
  });
});

test("creating GeoJSON from extent in different projection", ({ eq }) => {
  const bbox = [-2316545, -1971615, 1015455, 1512385];
  const srs = 6623;
  const extent = new GeoExtent(bbox, { srs });
  const geojson = extent.asGeoJSON({ density: 0 });
  eq(geojson.geometry.coordinates[0].length, 5);
  eq(geojson.bbox, [-104.15783650020958, 22.33428366410961, -51.769705847928805, 56.48158793780131]);

  const denseGeoJSON = extent.asGeoJSON({ density: 10 });
  eq(denseGeoJSON.geometry.coordinates[0].length, 5 + 4 * 10);
  eq(denseGeoJSON.bbox, [-104.15783650020958, 22.33428366410961, -51.769705847928805, 57.52407399197629]);
});

/*
test("creating extent from GeoJSON point", ({ eq }) => {
  // from https://geojson.org/
  const geojson = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [125.6, 10.1]
    },
    "properties": {
      "name": "Dinagat Islands"
    }
  };
  const extent = new GeoExtent(geojson);
  eq(extent, 4326);
  eq(extent.bbox, [125.6, 10.1, 125.6, 10.1]);
})


test("creating extent from GeoJSON with bbox property set", ({ eq }) => {
  
});

*/
