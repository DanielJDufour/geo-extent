import test from "flug";
import { GeoExtent } from "../src/geo-extent.js";

const EXPECTED = {
  srs: undefined,
  xmin: 42.943,
  xmin_str: "42.943",
  ymin: -71.032,
  ymin_str: "-71.032",
  xmax: 43.039,
  xmax_str: "43.039",
  ymax: -69.856,
  ymax_str: "-69.856",
  width_str: "0.096",
  width: 0.096,
  height_str: "1.176",
  height: 1.176,
  bottomLeft: { x: 42.943, y: -71.032 },
  bottomRight: { x: 43.039, y: -71.032 },
  topLeft: { x: 42.943, y: -69.856 },
  topRight: { x: 43.039, y: -69.856 },
  leafletBounds: [
    [-71.032, 42.943],
    [-69.856, 43.039]
  ],
  area_str: "0.112896",
  area: 0.112896,
  perimeter_str: "2.544",
  perimeter: 2.544,
  bbox: [42.943, -71.032, 43.039, -69.856],
  bbox_str: ["42.943", "-71.032", "43.039", "-69.856"],
  center_str: { x: "42.991", y: "-70.444" },
  center: { x: 42.991, y: -70.444 },
  str: "42.943,-71.032,43.039,-69.856",
  wkt: "POLYGON((43.039 -71.032,43.039 -69.856,42.943 -69.856,42.943 -71.032,43.039 -71.032))",
  ewkt: "POLYGON((43.039 -71.032,43.039 -69.856,42.943 -69.856,42.943 -71.032,43.039 -71.032))",
  js: "new GeoExtent([42.943, -71.032, 43.039, -69.856])"
};

const EXPECTED_WITH_SRS = {
  ...EXPECTED,
  srs: "EPSG:4326",
  ewkt: "SRID=4326;POLYGON((43.039 -71.032,43.039 -69.856,42.943 -69.856,42.943 -71.032,43.039 -71.032))",
  js: 'new GeoExtent([42.943, -71.032, 43.039, -69.856], { srs: "EPSG:4326" })'
};

test("gml without srs", ({ eq }) => {
  const extent = new GeoExtent(`
  <gml:Envelope>
    <gml:lowerCorner>42.943 -71.032</gml:lowerCorner>
     <gml:upperCorner>43.039 -69.856</gml:upperCorner>
  </gml:Envelope>
  `);
  eq(extent.asObj(), EXPECTED);
});

test("gml with srs", ({ eq }) => {
  const extent = new GeoExtent(`
  <gml:Envelope srsDimension="2" srsName="EPSG:4326">
    <gml:lowerCorner>42.943 -71.032</gml:lowerCorner>
     <gml:upperCorner>43.039 -69.856</gml:upperCorner>
  </gml:Envelope>
  `);
  eq(extent.asObj(), EXPECTED_WITH_SRS);
});

test("gml with srs urn", ({ eq }) => {
  const extent = new GeoExtent(`
  <gml:Envelope srsDimension="2" srsName="urn:ogc:def:crs:EPSG:9.0:4326">
    <gml:lowerCorner>42.943 -71.032</gml:lowerCorner>
     <gml:upperCorner>43.039 -69.856</gml:upperCorner>
  </gml:Envelope>
  `);
  eq(extent.asObj(), EXPECTED_WITH_SRS);
});
