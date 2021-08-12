import getEPSGCode from "get-epsg-code";
import reprojectBoundingBox from "reproject-bbox";

const avg = (a, b) => (a + b) / 2;
const isAry = o => Array.isArray(o);
const isDef = o => o !== undefined && o !== null && o !== "";
const isFunc = o => typeof o === "function";
const isObj = o => typeof o === "object";
const isStr = o => typeof o === "string";
const isNum = o => typeof o === "number";
const hasFunc = (o, f) => isObj(o) && isFunc(o[f]);
const hasFuncs = (o, fs) => fs.every(f => hasFunc(o, f));
const hasKey = (o, k) => isObj(o) && o[k] !== undefined && o[k] !== null;
const hasKeys = (o, ks) => ks.every(k => hasKey(o, k));
const getConstructor = o => (typeof obj === "object" && typeof obj.constructor === "function") || undefined;
const getConstructorName = o =>
  (typeof obj === "object" &&
    typeof obj.constructor === "function" &&
    typeof obj.constructor.name === "string" &&
    obj.constructor.name) ||
  undefined;

export class GeoExtent {
  constructor(o, srs) {
    if (isNum(srs)) {
      this.srs = "EPSG:" + srs;
    } else if (isStr(srs) && srs.startsWith("EPSG:")) {
      this.srs = srs;
    } else {
      this.srs = srs;
    }

    let xmin, xmax, ymin, ymax;
    if (getConstructor(o) === this.constructor) {
      ({ xmin, xmax, ymin, ymax } = o);
      this.srs = o.srs;
    }
    if (isAry(o) && o.length === 4 && o.every(isNum)) {
      [xmin, ymin, xmax, ymax] = o;
    } else if (isAry(o) && o.length === 2 && o.every(isAry) && o.every(o => o.length === 2 && o.every(isNum))) {
      [[ymin, xmin], [ymax, xmax]] = o;
    } else if (isObj(o) && hasFuncs(o, ["getEast", "getNorth", "getSouth", "getWest"])) {
      xmin = o.getWest();
      xmax = o.getEast();
      ymin = o.getSouth();
      ymax = o.getNorth();
      if (!this.srs) this.srs = "EPSG:4326";
    } else if (isAry(o) && o.length === 2 && o.every(it => hasKeys(it, ["x", "y"]))) {
      [{ x: xmin, y: ymin }, { x: xmax, y: ymax }] = o;
    } else if (isObj(o) && hasKeys(o, ["xmin", "xmax", "ymin", "ymax"])) {
      ({ xmin, xmax, ymin, ymax } = o);
      const keys = ["crs", "srs", "proj", "projection"];

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

      if (!this.srs) {
        this.srs = o.srs;
      }
    }
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
    this.width = xmax - xmin;
    this.height = ymax - ymin;
    this.area = this.width * this.height;
    this.bbox = [xmin, ymin, xmax, ymax];
    this.center = [avg(xmin, xmax), avg(ymin, ymax)];
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
      console.log("uhoh", [_this, _other]);
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
      return new this.constructor([xmin, ymin, xmax, ymax], this.srs);
    }

    // fall back to converting everything to 4326 and cropping there
    const [aMinLon, aMinLat, aMaxLon, aMaxLat] = isDef(this.srs) ? this.reproj(4326).bbox : this.bbox;
    const [bMinLon, bMinLat, bMaxLon, bMaxLat] = isDef(other.srs) ? other.reproj(4326).bbox : other.bbox;

    const minLon = Math.max(aMinLon, bMinLon);
    const minLat = Math.max(aMinLat, bMinLat);
    const maxLon = Math.min(aMaxLon, bMaxLon);
    const maxLat = Math.min(aMaxLat, bMaxLat);
    return new this.constructor([minLon, minLat, maxLon, maxLat], 4326).reproj(this.srs);
  }

  overlaps(other) {
    const [_this, _other] = this._pre(this, other);

    const yOverlaps = _other.ymin <= _this.ymax && _other.ymax >= _this.ymin;
    const xOverlaps = _other.xmin <= _this.xmax && _other.xmax >= _this.xmin;

    return xOverlaps && yOverlaps;
  }

  reproj(to, { quiet = false } = { quiet: false }) {
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
    return new GeoExtent(reprojected, to);
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
