import test from "flug";
import { GeoExtent } from "../geo-extent.js";

const XMIN = -72;
const XMAX = 21;
const YMIN = -47;
const YMAX = 74;
const BBOX = [XMIN, YMIN, XMAX, YMAX];
const CENTER = { x: (XMIN + XMAX) / 2, y: (YMIN + YMAX) / 2 };
const WIDTH = XMAX - XMIN;
const HEIGHT = YMAX - YMIN;
const AREA = WIDTH * HEIGHT;
const TWO_CORNER_BOUNDS = [ [YMIN, XMIN], [YMAX, XMAX] ];
const NORTHERN_HEMISPHERE = [-180, 0, 180, 90];
const SOUTHERN_HEMISPHERE = [-180, -90, 180, 0];
const WESTERN_HEMISPHERE = [-180, -90, 0, 90];
const EASTERN_HEMISPHERE = [0, -90, 180, 90];
const NORTH_WEST_QUARTER_SPHERE = [-180, 0, 0, 90];

const AS_OBJ_RESULT = {
  srs: 'EPSG:4326',
  area: AREA,
  bbox: BBOX,
  center: CENTER,
  xmin: XMIN,
  ymin: YMIN,
  xmax: XMAX,
  ymax: YMAX,
  width: WIDTH,
  height: HEIGHT,
  bottomLeft: { x: XMIN, y: YMIN },
  bottomRight: { x: XMAX, y: YMIN },
  topLeft: { x: XMIN, y: YMAX },
  topRight: { x : XMAX, y: YMAX },
  str: BBOX.join(","),
  leafletBounds: [
    [YMIN, XMIN],
    [YMAX, XMAX]
  ]
};
// console.log(AS_OBJ_RESULT);


test("create from bbox in 4326", ({ eq }) => {
  const bbox = new GeoExtent(BBOX, { srs: 4326 });
  eq(bbox.xmin, XMIN);
  eq(bbox.xmax, XMAX);
  eq(bbox.ymin, YMIN);
  eq(bbox.ymax, YMAX);
  eq(bbox.width, WIDTH);
  eq(bbox.height, HEIGHT);
});

test("create from points", ({ eq }) => {
  const EXPECTED_EXTENT_FOR_PT = {
    srs: 'EPSG:4326',
    xmin: 147,
    ymin: -18,
    xmax: 147,
    ymax: -18,
    width: 0,
    height: 0,
    bottomLeft: { x: 147, y: -18 },
    bottomRight: { x: 147, y: -18 },
    topLeft: { x: 147, y: -18 },
    topRight: { x: 147, y: -18 },
    area: 0,
    bbox: [ 147, -18, 147, -18 ],
    center: { x: 147, y: -18 },
    str: '147,-18,147,-18',
    leafletBounds: [
      [ -18, 147 ],
      [ -18, 147 ]
    ]
  };
  eq(new GeoExtent({ x: 147, y: -18 }, { srs: 4326 }).asObj(), EXPECTED_EXTENT_FOR_PT);
  eq(new GeoExtent([ 147, -18 ], { srs: 4326 }).asObj(), EXPECTED_EXTENT_FOR_PT);
});

test("reproject from 4326 to 3857", ({ eq }) => {
  const bbox = new GeoExtent(BBOX, { srs: 4326 });
  const extentIn3857 = bbox.reproj(3857);
  eq(extentIn3857.srs, 'EPSG:3857');
  eq(extentIn3857.bbox, [
    -8015003.337115697,
    -5942074.072431109,
    2337709.3066587453,
    12515545.2124676
  ]);
});

test("intake Bounds Array", ({ eq }) => {
  const bbox = new GeoExtent(TWO_CORNER_BOUNDS, { srs: 4326 });
  eq(bbox.asObj(), AS_OBJ_RESULT);
});

test("intake two xy points", ({ eq }) => {
  const bbox = new GeoExtent([{ x: XMIN, y: YMIN }, { x: XMAX, y: YMAX }], { srs: 4326 });
  eq(bbox.asObj(), AS_OBJ_RESULT);
})

test("overlaps", ({ eq }) => {
  const northernHemisphere = new GeoExtent(NORTHERN_HEMISPHERE);
  const southernHemisphere = new GeoExtent(SOUTHERN_HEMISPHERE);
  eq(northernHemisphere.overlaps(southernHemisphere), true);

  const northPole = new GeoExtent([-180, 85, 180, 90]);
  const southPole = new GeoExtent([-180, -90, 180, -85]);
  eq(northPole.overlaps(southPole), false);
});


test("crop", ({ eq }) => {
  const northernHemisphere = new GeoExtent(NORTHERN_HEMISPHERE, { srs: 4326 });
  const northWestQuarterSphere = new GeoExtent(NORTH_WEST_QUARTER_SPHERE, { srs: 4326 });
  eq(northernHemisphere.crop(WESTERN_HEMISPHERE).bbox, NORTH_WEST_QUARTER_SPHERE);

  // northern part
  const result = new GeoExtent([-180, -85, 180, 85], { srs: 4326 }).reproj(3857).crop(northWestQuarterSphere).reproj(4326);
  eq(result.bbox[0] - -180 < 0.000001, true);
  eq(result.bbox[1] - 0 < 0.000001, true);
  eq(result.bbox[2] - 0 < 0.000001, true);
  eq(result.bbox[3] - 85 < 0.000001, true);
});

test("cropping area in web mercator by globe", ({ eq }) => {
  const area = new GeoExtent([-1252344.2714243277, -7.081154551613622e-10, 0, 1252344.2714243277], { srs: 3857 });
  const cut = new GeoExtent([-180, -89.99928, 179.99856, 90], { srs: 4326 });
  const cropped = area.crop(cut);
  eq(area.asObj(), cropped.asObj());
});

test("cropping global by web mercator globe", ({ eq }) => {
  const a = new GeoExtent([-20037508.342789244, -20037508.342789255, 20037508.342789244, 20037508.342789244], { srs: 3857 });
  const b = new GeoExtent([-180, -89.99928, 179.99856, 90], { srs: 4326 });
  const res = a.crop(b);
  eq(res.bbox, [-20037508.342789244, -20037508.342789255, 20037348.0427225, 20037508.342789244]);
});

test("cropping web mercator tile", ({ eq }) => {
  // web mercator tile x: 964, y: 1704, z: 12
  const tile = new GeoExtent([-10605790.548624776, 3355891.2898323783, -10596006.609004272, 3365675.2294528796], { srs: 3857 });

  // convert web mercator tile to Latitude/Longitude
  eq(tile.reproj(4326).bbox, [-95.27343750000001, 28.84467368077178, -95.185546875, 28.921631282421277]);

  // extent of Cloud-Optimized GeoTIFF in UTM Projection 32615
  const cog = new GeoExtent([259537.6, 3195976.8000000003, 281663.2, 3217617.6], { srs: 32615 });

  const partial = tile.crop(cog);
  // partial is GeoExtent([-10605790.548624776, 3358990.12945602, -10601914.152717294, 3365675.2294528796], 3857);

  eq(partial.bbox, [-10605790.548624776, 3358990.12945602, -10601914.152717294, 3365675.2294528796]);
});



