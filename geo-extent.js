/****
 * TO DO:
 * add support for GeoJSON and need to check projection of GeoJSON
 */
import getEPSGCode from "get-epsg-code";
import reprojectBoundingBox from "reproject-bbox";

const avg = (a, b) => (a + b) / 2;
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
const isLeafletLatLngBounds = o => isObj(o) && hasFuncs(o, ["getEast", "getNorth", "getSouth", "getWest"]);
const hasFunc = (o, f) => isObj(o) && isFunc(o[f]);
const hasObj = (o, k) => isObj(o) && isObj(o[k]);
const hasFuncs = (o, fs) => fs.every(f => hasFunc(o, f));
const hasObjs = (o, ks) => ks.every(k => hasObj(o, k));
const hasKey = (o, k) => isObj(o) && o[k] !== undefined && o[k] !== null;
const hasKeys = (o, ks) => ks.every(k => hasKey(o, k));
const allNums = ary => isAry(ary) && ary.every(isNum);
const getConstructor = o => (typeof obj === "object" && typeof obj.constructor === "function") || undefined;

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
    if (isNum(srs)) {
      this.srs = "EPSG:" + srs;
    } else if (isStr(srs) && srs.startsWith("EPSG:")) {
      this.srs = srs;
    } else if (isDef(srs)) {
      this.srs = srs;
    }

    let xmin, xmax, ymin, ymax;
    if (getConstructor(o) === this.constructor) {
      ({ xmin, xmax, ymin, ymax } = o);
      if (isDef(o.srs)) {
        this.srs = o.srs;
      }
    }
    if (isAry(o) && o.length === 4 && allNums(o)) {
      [xmin, ymin, xmax, ymax] = o;
    } else if (isAry(o) && o.length === 2 && o.every(isAry) && o.every(o => o.length === 2 && allNums(o))) {
      [[ymin, xmin], [ymax, xmax]] = o;
    } else if (isLeafletLatLngBounds(o)) {
      (xmin = o.getWest()), (xmax = o.getEast()), (ymin = o.getSouth()), (ymax = o.getNorth());
      if (!this.srs) this.srs = "EPSG:4326";
    } else if (isAry(o) && o.length === 2 && o.every(it => hasKeys(it, ["x", "y"]))) {
      [{ x: xmin, y: ymin }, { x: xmax, y: ymax }] = o;
    } else if (isObj(o) && hasKeys(o, ["x", "y"]) && isNum(o.x) && isNum(o.y)) {
      // receive a point like { x: 147, y: -18 } because isn't a point
      // really just an extent with zero height and width?
      xmin = xmax = o.x;
      ymin = ymax = o.y;
      if (hasKey(o, "spatialReference") && hasKey(o.spatialReference, "wkid")) {
        if (!this.srs) this.srs = o.spatialReference.wkid;
      }
    } else if (isObj(o) && hasKeys(o, ["xmin", "xmax", "ymin", "ymax"])) {
      ({ xmin, xmax, ymin, ymax } = o);
      const keys = ["srs", "crs", "proj", "projection"];

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const v = o[k];
        if (isNum(v)) {
          this.srs = "EPSG:" + v;
          break;
        } else if (isStr(v)) {
          const code = getEPSGCode(v);
          if (isNum(code)) this.srs = "EPSG:" + code;
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
    } else {
      throw new Error("[geo-extent] unknown format");
    }

    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
    this.width = xmax - xmin;
    this.height = ymax - ymin;

    // corners
    this.bottomLeft = { x: xmin, y: ymin };
    this.bottomRight = { x: xmax, y: ymin };
    this.topLeft = { x: xmin, y: ymax };
    this.topRight = { x: xmax, y: ymax };

    this.leafletBounds = [
      [this.ymin, this.xmin],
      [this.ymax, this.xmax]
    ];

    this.area = this.width * this.height;
    this.perimeter = 2 * this.width + 2 * this.height;
    this.bbox = [xmin, ymin, xmax, ymax];
    this.center = { x: avg(xmin, xmax), y: avg(ymin, ymax) };
    this.str = this.bbox.join(",");
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

  contains(other) {
    const [_this, _other] = this._pre(this, other);

    const xContains = _other.xmin >= _this.xmin && _other.xmax <= _this.xmax;
    const yContains = _other.ymin >= _this.ymin && _other.ymax <= _this.ymax;

    return xContains && yContains;
  }

  crop(other) {
    other = new this.constructor(other);

    // first check if other fully contains this extent
    // in which case, we don't really need to crop
    // and can just return the extent of this
    if (other.contains(this)) return this.clone();

    // if both this and other have srs defined reproject
    // otherwise, assume they are the same projection
    let another = isDef(this.srs) && isDef(other.srs) ? other.reproj(this.srs, { quiet: true }) : other.clone();
    if (another) {
      const xmin = Math.max(this.xmin, another.xmin);
      const ymin = Math.max(this.ymin, another.ymin);
      const xmax = Math.min(this.xmax, another.xmax);
      const ymax = Math.min(this.ymax, another.ymax);
      return new this.constructor([xmin, ymin, xmax, ymax], { srs: this.srs });
    }

    // fall back to converting everything to 4326 and cropping there
    const [aMinLon, aMinLat, aMaxLon, aMaxLat] = isDef(this.srs) ? this.reproj(4326).bbox : this.bbox;
    const [bMinLon, bMinLat, bMaxLon, bMaxLat] = isDef(other.srs) ? other.reproj(4326).bbox : other.bbox;

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
  overlaps(other) {
    const [_this, _other] = this._pre(this, other);

    const yOverlaps = _other.ymin <= _this.ymax && _other.ymax >= _this.ymin;
    const xOverlaps = _other.xmin <= _this.xmax && _other.xmax >= _this.xmin;

    return xOverlaps && yOverlaps;
  }

  reproj(to, { quiet = false } = { quiet: false }) {
    // don't need to reproject, so just return a clone
    if (isDef(this.srs) && this.srs === to) this.clone();

    if (!isDef(this.srs)) {
      if (quiet) return;
      throw new Error(`[geo-extent] cannot reproject ${this.bbox} without a projection set`);
    }
    const reprojected = reprojectBoundingBox({
      bbox: this.bbox,
      from: this.srs,
      to
    });

    if (reprojected.some(isNaN)) {
      if (quiet) return;
      throw new Error(`[geo-extent] failed to reproject ${this.bbox} from ${this.srs} to ${to}`);
    }
    return new GeoExtent(reprojected, { srs: to });
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

  asGeoJSON() {
    const { xmin, ymin, xmax, ymax } = this.srs === "EPSG:4326" ? this : this.reproj(4326);
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [xmin, ymax],
            [xmax, ymax],
            [xmax, ymin],
            [xmin, ymin],
            [xmin, ymax]
          ]
        ]
      }
    };
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

if (typeof window === "object") window.GeoExtent = GeoExtent;
