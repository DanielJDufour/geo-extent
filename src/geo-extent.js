"use strict";

/****
 * TO DO:
 * add support for GeoJSON and need to check projection of GeoJSON
 */
import add from "preciso/add.js";
import divide from "preciso/divide.js";
import multiply from "preciso/multiply.js";
import subtract from "preciso/subtract.js";

import bboxArray from "bbox-fns/bbox-array.js";
import booleanContains from "bbox-fns/boolean-contains.js";
import booleanIntersects from "bbox-fns/boolean-intersects.js";
import densePolygon from "bbox-fns/dense-polygon.js";
import unwrap from "bbox-fns/unwrap.js";

import getEPSGCode from "get-epsg-code";
import { Envelope } from "geography-markup-language";
import reprojectBoundingBox from "reproject-bbox";
import reprojectGeoJSON from "reproject-geojson";

const avg = (a, b) => divide(add(a.toString(), b.toString()), "2");
const isAry = o => Array.isArray(o);
const isDef = o => o !== undefined && o !== null && o !== "";
const isFunc = o => typeof o === "function";

// identifying GeoJSON currently unused
// shouldn't rely on type being provided
// because sometimes the rest could be valid but no type is provided
// const isFeatureCollection = it => isObj(it) && it.type === "FeatureCollection" && hasKey(it, "features");
// const isFeature = it => isObj(it) && it.type === "Feature" && hasKey(it, "geometry");
// const isGeometryCollection = it => isObj(it) && it.type === "GeometryCollection" && hasKey("geometries");
// const isMultiPolygon = it => isObj(it) && it.type === "MultiPolygon" && hasKey(it, "coordinates");
// const isPolygon = it => isObj(it) && it.type === "Polygon" && hasKey(it, "coordinates");
// const isPoint = it => isObj(it) && it.type === "Point" && hasKey(it, "coordinates");
// const isMultiPoint = it => isObj(it) && isObj.type === "MultiPoint" && hasKey(it, "coordinates");

const isObj = o => typeof o === "object";
const isStr = o => typeof o === "string";
const isNum = o => typeof o === "number";
const isBoxStr = o => isStr(o) && !!o.match(/^[-|+]?[\d\.]+(, ?[-|+]?[\d\.]+){3}$/);
const isLeafletBounds = it =>
  isObj(it) && hasFuncs(it, ["getBottomLeft", "getBottomRight", "getTopLeft", "getTopRight"]);
const isLeafletBoundsJSON = it =>
  isObj(it) &&
  typeof it.min === "object" &&
  typeof it.min.x === "number" &&
  typeof it.min.y === "number" &&
  typeof it.max === "object" &&
  typeof it.max.x === "number" &&
  typeof it.max.y === "number";
const isLeafletLatLngBounds = o => isObj(o) && hasFuncs(o, ["getEast", "getNorth", "getSouth", "getWest"]);
const isLeafletLatLngBoundsJSON = o => isObj(o) && hasKeys(o, ["_southWest", "_northEast"]);
const wkt = bbox => {
  const [xmin, ymin, xmax, ymax] = bbox;
  return `POLYGON((${xmax} ${ymin},${xmax} ${ymax},${xmin} ${ymax},${xmin} ${ymin},${xmax} ${ymin}))`;
};

const hasFunc = (o, f) => isObj(o) && isFunc(o[f]);
const hasObj = (o, k) => isObj(o) && isObj(o[k]);
const hasFuncs = (o, fs) => fs.every(f => hasFunc(o, f));
const hasObjs = (o, ks) => ks.every(k => hasObj(o, k));
const hasKey = (o, k) => isObj(o) && o[k] !== undefined && o[k] !== null;
const hasKeys = (o, ks) => ks.every(k => hasKey(o, k));
const allNums = ary => isAry(ary) && ary.every(isNum);
const allStrs = ary => isAry(ary) && ary.every(isStr);
const getConstructor = o => (typeof obj === "object" && typeof obj.constructor === "function") || undefined;
const normalize = srs => {
  if (!srs) return srs;
  if (srs === 32767 || srs === "EPSG:32767") return null;
  if (isStr(srs) && srs.startsWith("EPSG:")) return srs;
  if (isStr(srs) && srs.match(/^\d+$/)) return "EPSG:" + srs;
  else if (isNum(srs)) return "EPSG:" + srs;
  const code = getEPSGCode(srs);
  if (isNum(code)) return "EPSG:" + code;
  return srs;
};

// currently unused
// const getConstructorName = o =>
//   (typeof obj === "object" &&
//     typeof obj.constructor === "function" &&
//     typeof obj.constructor.name === "string" &&
//     obj.constructor.name) ||
//   undefined;

// const forEachCoord = (data, cb) => {
//   if (data.features) data.features.forEach(forEachCoord);
//   else if (data.geometry) forEachCoord(data.geometry);
//   else if (data.coordinates) forEachCoord(data.coordinates);
//   else if (Array.isArray(data) && Array.isArray(data[0])) data.map(forEachCoord);
//   else if (Array.isArray(data) && (data.length === 2 || data.length === 3) && typeof data[0] === "number") {
//     const [x, y, z] = data;
//     cb({ x, y, z });
//   }
// };

// const getExtentOfGeoJSON = geojson => {
//   let xmin, xmax, ymin, ymax;
//   if (geojson.features) {

//   }
// }

export class GeoExtent {
  constructor(o, { srs } = {}) {
    this.srs = normalize(srs);

    let xmin, xmax, ymin, ymax;
    let xmin_str, xmax_str, ymin_str, ymax_str;
    if (getConstructor(o) === this.constructor) {
      ({ xmin, xmax, ymin, ymax } = o);
      if (isDef(o.srs)) {
        this.srs = normalize(o.srs);
      }
    }

    if (isBoxStr(o)) o = o.split(/, ?/);

    if (isAry(o) && o.length === 4 && allNums(o)) {
      [xmin, ymin, xmax, ymax] = o;
    } else if (isAry(o) && o.length === 4 && allStrs(o)) {
      [xmin_str, ymin_str, xmax_str, ymax_str] = o;
      [xmin, ymin, xmax, ymax] = o.map(str => Number(str));
    } else if (isAry(o) && o.length === 2 && o.every(isAry) && o.every(o => o.length === 2 && allNums(o))) {
      [[ymin, xmin], [ymax, xmax]] = o;
    } else if (isLeafletLatLngBounds(o)) {
      (xmin = o.getWest()), (xmax = o.getEast()), (ymin = o.getSouth()), (ymax = o.getNorth());
      if (!isDef(this.srs)) this.srs = "EPSG:4326";
    } else if (isLeafletBounds(o)) {
      ({ x: xmin, y: ymin } = o.getBottomLeft()), ({ x: xmax, y: ymax } = o.getTopRight());
    } else if (isLeafletLatLngBoundsJSON(o)) {
      ({
        _southWest: { lat: ymin, lng: xmin },
        _northEast: { lat: ymax, lng: xmax }
      } = o);
      if (!isDef(this.srs)) this.srs = "EPSG:4326";
    } else if (isLeafletBoundsJSON(o)) {
      ({
        min: { x: xmin, y: ymin },
        max: { x: xmax, y: ymax }
      } = o);
    } else if (isAry(o) && o.length === 2 && o.every(it => hasKeys(it, ["x", "y"]))) {
      [{ x: xmin, y: ymin }, { x: xmax, y: ymax }] = o;
    } else if (isObj(o) && hasKeys(o, ["x", "y"]) && isNum(o.x) && isNum(o.y)) {
      // receive a point like { x: 147, y: -18 } because isn't a point
      // really just an extent with zero height and width?
      xmin = xmax = o.x;
      ymin = ymax = o.y;
      if (hasKey(o, "spatialReference") && hasKey(o.spatialReference, "wkid")) {
        if (!isDef(this.srs)) this.srs = normalize(o.spatialReference.wkid);
      }
    } else if (isObj(o) && hasKeys(o, ["xmin", "xmax", "ymin", "ymax"])) {
      ({ xmin, xmax, ymin, ymax } = o);
      const keys = ["srs", "crs", "proj", "projection"];

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const v = o[k];
        const normalized = normalize(v);
        if (normalized) {
          this.srs = normalized;
          break;
        }
      }

      if (!this.srs && isDef(o.srs)) {
        this.srs = o.srs;
      }
    } else if (isAry(o) && o.length === 2 && allNums(o)) {
      // assume [ x , y ]
      xmin = xmax = o[0];
      ymin = ymax = o[1];
    } else if (isObj(o) && hasFuncs(o, ["getCoordinates"])) {
      const xy = o.getCoordinates();
      xmin = xmax = xy[0];
      ymin = ymax = xy[1];
    } else if (isObj(o) && hasKey(o, "bbox") && o.bbox.length === 4 && allNums(o)) {
      // like GeoJSON with bbox property set
      // { type: "Feature", "bbox": [-37, 7, 12, 67 ], "geometry": { "type": "Polygon", "coordinates": [...] } }
      [xmin, ymin, xmax, ymax] = o.bbox;
    } else if (hasObj(o, "_bounds") && isLeafletLatLngBounds(o._bounds)) {
      const { _bounds } = o;
      (xmin = _bounds.getWest()), (xmax = _bounds.getEast()), (ymin = _bounds.getSouth()), (ymax = _bounds.getNorth());
      if (!this.srs) this.srs = "EPSG:4326";
    } else if (isObj(o) && isObj(o._bounds) && hasObjs(o._bounds, ["_southWest", "_northEast"])) {
      ({ lat: ymin, lng: xmin } = o._bounds._southWest);
      ({ lat: ymax, lng: xmax } = o._bounds._northEast);
      if (!isDef(this.srs)) this.srs = "EPSG:4326";
    } else if (isStr(o) && o.toLowerCase().includes("envelope")) {
      const envelope = Envelope(o);
      if (envelope.corners) {
        [[xmin, ymin], [xmax, ymax]] = envelope.corners;
      }
      if (envelope.srs) {
        if (envelope.srs.startsWith("urn") && envelope.srs.includes("EPSG:")) {
          // ex: "urn:ogc:def:crs:EPSG:9.0:26986"
          this.srs = "EPSG:" + envelope.srs.split(":").pop();
        } else if (/^EPSG:\d+/.test(envelope.srs)) {
          this.srs = envelope.srs;
        }
      }
    } else {
      throw new Error("[geo-extent] unknown format");
    }

    this.xmin = xmin;
    this.xmin_str = xmin_str || xmin.toString();
    this.ymin = ymin;
    this.ymin_str = ymin_str || ymin.toString();
    this.xmax = xmax;
    this.xmax_str = xmax_str || xmax.toString();
    this.ymax = ymax;
    this.ymax_str = ymax_str || ymax.toString();

    this.width_str = subtract(this.xmax_str, this.xmin_str);
    this.width = Number(this.width_str);

    this.height_str = subtract(this.ymax_str, this.ymin_str);
    this.height = Number(this.height_str);

    // corners
    this.bottomLeft = { x: xmin, y: ymin };
    this.bottomRight = { x: xmax, y: ymin };
    this.topLeft = { x: xmin, y: ymax };
    this.topRight = { x: xmax, y: ymax };

    this.leafletBounds = [
      [this.ymin, this.xmin],
      [this.ymax, this.xmax]
    ];

    this.area_str = multiply(this.width_str, this.height_str);
    this.area = Number(this.area_str);

    this.perimeter_str = add(multiply(this.width_str, "2"), multiply(this.height_str, "2"));
    this.perimeter = Number(this.perimeter_str);

    this.bbox = [xmin, ymin, xmax, ymax];
    this.bbox_str = [this.xmin_str, this.ymin_str, this.xmax_str, this.ymax_str];

    this.center_str = {
      x: avg(xmin_str || xmin, xmax_str || xmax),
      y: avg(ymin_str || ymin, ymax_str || ymax)
    };
    this.center = { x: Number(this.center_str.x), y: Number(this.center_str.y) };

    this.str = this.bbox_str.join(",");

    this.wkt = wkt(this.bbox_str);

    this.ewkt = (this.srs?.startsWith("EPSG:") ? this.srs.replace("EPSG:", "SRID=") + ";" : "") + this.wkt;

    this.js = `new GeoExtent([${this.bbox_str.join(", ")}]${this.srs ? `, { srs: ${JSON.stringify(this.srs)} }` : ""})`;
  }

  _pre(_this, _other) {
    // convert other to an extent instance (if not already)
    _other = new this.constructor(_other);

    if (!isDef(_this.srs) && !isDef(_other.srs)) {
      // assume same/no projection
    } else if (isDef(_this.srs) && !isDef(_other.srs)) {
      // assume other is the same srs as this
      _other = new _this.constructor({ ..._other, srs: _this.srs });
    } else if (!isDef(_this.srs) && isDef(_other.srs)) {
      // assume this' srs is the same as other
      _this = new _this.constructor({ ..._this, srs: _other.srs });
    } else if (isDef(_this.srs) && isDef(_other.srs) && _this.srs !== _other.srs) {
      _other = _other.reproj(_this.srs);
    } else if (isDef(_this.srs) && isDef(_other.srs) && _this.srs === _other.srs) {
      // same projection, so no reprojection necessary
    } else {
      throw "UH OH";
    }
    return [_this, _other];
  }

  clone() {
    return new this.constructor(this);
  }

  _contains(other, { quiet = false } = { quiet: false }) {
    try {
      const [_this, _other] = this._pre(this, other);

      return booleanContains(_this.bbox, _other.bbox);
    } catch (error) {
      if (!quiet) throw error;
    }
  }

  contains(other, { debug_level = 0, quiet = true } = { debug_level: 0, quiet: true }) {
    const result = this._contains(other, { quiet: true });
    if (typeof result === "boolean") return result;

    if (isDef(this.srs) && isDef(other.srs)) {
      try {
        // try reprojecting to projection of second bbox
        const this2 = this.reproj(other.srs);
        const result2 = this2._contains(other, { quiet: true });
        if (typeof result2 === "boolean") return result2;
      } catch (error) {
        if (debug_level >= 1) console.error(error);
      }

      try {
        // previous attempt was inconclusive, so try again by converting everything to 4326
        const this4326 = this.reproj(4326);
        const other4326 = other.reproj(4326);
        const result4326 = this4326._contains(other4326, { quiet: true });
        if (typeof result4326 === "boolean") return result4326;
      } catch (error) {
        if (debug_level >= 1) console.error(error);
      }
    }

    if (!quiet)
      throw new Error(
        `[geo-extent] failed to determine if ${this.bbox} in srs ${this.srs} contains ${other.bbox} in srs ${other.srs}`
      );
  }

  // should return null if no overlap
  crop(other) {
    other = new this.constructor(other);

    // if really no overlap then return null
    if (!this.overlaps(other)) {
      return null;
    }

    // first check if other fully contains this extent
    // in which case, we don't really need to crop
    // and can just return the extent of this
    if (other.contains(this)) return this.clone();

    // check if special case where other crosses 180th meridian
    if (other.srs === "EPSG:4326" && (other.xmin < -180 || other.xmax > 180)) {
      const parts = other.unwrap();

      let cropped = parts.map(it => this.crop(it));

      // filter out any parts that are null (didn't overlap)
      cropped = cropped.filter(Boolean);

      // no overlap
      if (cropped.length === 0) return null;

      let combo = cropped[0];
      for (let i = 1; i < cropped.length; i++) combo = combo.combine(cropped[i]);

      return combo;
    }

    // if both this and other have srs defined reproject
    // otherwise, assume they are the same projection
    let another = isDef(this.srs) && isDef(other.srs) ? other.reproj(this.srs, { quiet: true }) : other.clone();
    if (another) {
      if (!this.overlaps(another)) return null;
      const xmin = Math.max(this.xmin, another.xmin);
      const ymin = Math.max(this.ymin, another.ymin);
      const xmax = Math.min(this.xmax, another.xmax);
      const ymax = Math.min(this.ymax, another.ymax);
      return new this.constructor([xmin, ymin, xmax, ymax], { srs: this.srs });
    }

    // fall back to converting everything to 4326 and cropping there
    const this4326 = isDef(this.srs) ? this.reproj(4326) : this;
    const other4326 = isDef(other.srs) ? other.reproj(4326) : other;
    const [aMinLon, aMinLat, aMaxLon, aMaxLat] = this4326.bbox;
    const [bMinLon, bMinLat, bMaxLon, bMaxLat] = other4326.bbox;

    if (!this4326.overlaps(other4326)) return null;

    const minLon = Math.max(aMinLon, bMinLon);
    const minLat = Math.max(aMinLat, bMinLat);
    const maxLon = Math.min(aMaxLon, bMaxLon);
    const maxLat = Math.min(aMaxLat, bMaxLat);
    return new this.constructor([minLon, minLat, maxLon, maxLat], { srs: 4326 }).reproj(this.srs);
  }

  // add two extents together
  // result is a new extent in the projection of this
  combine(other) {
    if (isDef(this.srs) && isDef(other.srs)) {
      other = other.reproj(this.srs);
    }

    const xmin = Math.min(this.xmin, other.xmin);
    const xmax = Math.max(this.xmax, other.xmax);
    const ymin = Math.min(this.ymin, other.ymin);
    const ymax = Math.max(this.ymax, other.ymax);

    return new this.constructor({ xmin, xmax, ymin, ymax, srs: this.srs });
  }

  equals(other, { digits = 13, strict = true } = { digits: 13, strict: true }) {
    // convert other to GeoExtent if necessary
    other = new this.constructor(other);

    if (isDef(this.srs) && isDef(other.srs)) {
      other = other.reproj(this.srs);
    } else if (strict && isDef(this.srs) !== !isDef(this.srs)) {
      return false;
    }
    const str1 = this.bbox.map(n => n.toFixed(digits)).join(",");
    const str2 = other.bbox.map(n => n.toFixed(digits)).join(",");
    return str1 === str2;
  }

  /*
    shouldn't accept GeoJSON as input because the extent created from a GeoJSON
    might overlap, but the actual polygon wouldn't.
    Or at least make the user have to be explicit about the functionality via
    a flag like overlaps(geojson, { strict: false })
  */
  _overlaps(other, { quiet = false } = { quiet: false }) {
    try {
      const [_this, _other] = this._pre(this, other);

      return booleanIntersects(_this.bbox, _other.bbox);
    } catch (error) {
      if (quiet) return;
      else throw error;
    }
  }

  overlaps(other, { quiet = true, strict = false } = { quiet: true, strict: false }) {
    if (this._overlaps(other, { quiet })) {
      return true;
    }

    if (strict) return false;

    // if already in same projection or none at all,
    // don't bother trying different projections
    if (this.srs === other.srs || (!this.srs && !other.srs)) {
      return false;
    }

    // if not strict, try finding overlap in reverse and 4326
    other = new this.constructor(other);
    if (other._overlaps(this, { quiet: true })) {
      return true;
    }

    // check 4326
    if (this.srs && other.srs) {
      if (this.reproj(4326)._overlaps(other.reproj(4326))) {
        return true;
      }
    }

    return false;
  }

  reproj(
    to,
    {
      allow_infinity = false,
      debug_level = 0,
      density = "high",
      shrink = false,
      shrink_density = 100,
      split = true,
      quiet = false
    } = {
      allow_infinity: false,
      debug_level: 0,
      density: "high",
      shrink: false,
      split: true,
      quiet: false
    }
  ) {
    to = normalize(to); // normalize srs

    // don't need to reproject, so just return a clone
    if (isDef(this.srs) && this.srs === normalize(to)) return this.clone();

    if (!isDef(this.srs)) {
      if (quiet) return;
      throw new Error(`[geo-extent] cannot reproject ${this.bbox} without a projection set`);
    }

    // unwrap, reproject pieces, and combine
    if (this.srs === "EPSG:4326" && (this.xmin < -180 || this.xmax > 180)) {
      try {
        const parts = this.unwrap().map(ext => ext.reproj(to));
        let combo = parts[0];
        for (let i = 1; i < parts.length; i++) combo = combo.combine(parts[i]);
        return combo;
      } catch (error) {
        if (quiet) return;
        throw error;
      }
    }

    if (density === "lowest") density = 0;
    else if (density === "low") density = 1;
    else if (density === "medium") density = 10;
    else if (density === "high") density = 100;
    else if (density === "higher") density = 1000;
    else if (density === "highest") density = 10000;

    let reprojected;
    try {
      const options = {
        bbox: this.bbox,
        density,
        from: this.srs,
        split,
        to
      };
      reprojected = reprojectBoundingBox(options);
    } catch (error) {
      if (debug_level) console.error(error);
    }

    if (reprojected?.every(isFinite)) {
      return new GeoExtent(reprojected, { srs: to });
    }

    // as a fallback, try reprojecting to EPSG:4326 then to the desired srs
    if (to !== 4326) {
      let bbox_4326;
      try {
        bbox_4326 = reprojectBoundingBox({
          bbox: this.bbox,
          density,
          from: this.srs,
          split,
          to: 4326
        });
      } catch (error) {
        if (debug_level) console.error("failed to create intermediary bbox in EPSG:4326");
      }

      if (bbox_4326) {
        try {
          reprojected = reprojectBoundingBox({
            bbox: bbox_4326,
            density,
            from: 4326,
            split,
            to
          });
        } catch (err) {
          if (debug_level) console.error(`failed to reproject from intermediary bbox ${bbox_4326} in 4326 to ${to}`);
        }
      }
    }

    if (reprojected && (allow_infinity || reprojected?.every(isFinite))) {
      return new GeoExtent(reprojected, { srs: to });
    }

    // if really haven't gotten a solution yet,
    // such as when reprojecting globe into Web Mercator
    // reproject with shrinking and highest density
    if (shrink) {
      try {
        if (shrink_density === "lowest") shrink_density = 1;
        else if (shrink_density === "low") shrink_density = 2;
        else if (shrink_density === "medium") shrink_density = 10;
        else if (shrink_density === "high") shrink_density = 100;
        else if (shrink_density === "higher") shrink_density = 1000;
        else if (shrink_density === "highest") shrink_density = 10000;

        reprojected = reprojectBoundingBox({
          bbox: this.bbox,
          density: shrink_density,
          from: this.srs,
          nan_strategy: "skip",
          split: true,
          to
        });
      } catch (err) {
        if (debug_level) console.error(`failed to reproject from bbox ${this.bbox} with shrinking to ${to}`);
      }
    }

    if (reprojected && (allow_infinity || reprojected?.every(isFinite))) {
      return new GeoExtent(reprojected, { srs: to });
    } else if (quiet) {
      return;
    } else {
      throw new Error(`[geo-extent] failed to reproject ${this.bbox} from ${this.srs} to ${to}`);
    }
  }

  unwrap() {
    const { xmin, ymin, xmax, ymax, srs } = this;

    // not in 4326, so just return a clone
    if (srs !== "EPSG:4326") return [this.clone()];

    // extent is within the normal extent of the earth, so return clone
    if (xmin > -180 && xmax < 180) return [this.clone()];

    const bboxes = unwrap(this.bbox, [-180, -90, 180, 90]);

    return bboxes.map(bbox => new this.constructor(bbox, { srs: 4326 }));
  }

  asEsriJSON() {
    return {
      xmin: this.xmin,
      ymin: this.ymin,
      xmax: this.xmax,
      ymax: this.ymax,
      spatialReference: {
        wkid: this.srs
      }
    };
  }

  asGeoJSON({ density = 0 } = { density: 0 }) {
    const will_reproject = ![undefined, null, "EPSG:4326"].includes(this.srs);

    let geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: densePolygon(this.bbox, { density })
      }
    };

    if (will_reproject) {
      geojson = reprojectGeoJSON(geojson, { from: this.srs, to: "EPSG:4326", in_place: true });
    }

    geojson.bbox = bboxArray(geojson.geometry.coordinates[0]);

    return geojson;
  }

  asObj() {
    const res = {};
    for (let k in this) {
      const v = this[k];
      if (!isFunc(v)) {
        res[k] = v;
      }
    }
    return res;
  }
}

if (typeof define === "function" && define.amd)
  define(function () {
    return GeoExtent;
  });
if (typeof self === "object") self.GeoExtent = GeoExtent;
if (typeof window === "object") window.GeoExtent = GeoExtent;
