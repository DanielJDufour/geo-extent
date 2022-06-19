export class GeoExtent {
  constructor(o: any, data?: { srs?: string | number });

  // properties
  bbox: [number, number, number, number];
  bbox_str: [string, string, string, string];
  srs: string;
  xmin: number;
  xmin_str: string;
  xmax: number;
  xmax_str: string;
  ymin: number;
  ymin_str: string;
  ymax: number;
  ymax_str: string;
  height: number;
  height_str: string;
  width: number;
  width_str: string;
  area: number;
  area_str: string;
  perimeter: number;
  perimeter_str: string;
  center: { x: number, y: number };
  center_str: { x: string, y: string };
  bottomLeft: { x: number, y: number };
  bottomRight: { x: number, y: number };
  topLeft: { x: number, y: number };
  topRight: { x: number, y: number };
  str: string;
  leafletBounds: [[number, number], [number, number]];

  // functions
  asEsriJSON(): { xmin: number, ymin: number, xmax: number, ymax: number, spatialReference: { wkid: string }};
  asGeoJSON(): { type: "Feature", geometry: { type: "Polygon", coordinates: [number[]]}};
  clone(): GeoExtent;
  combine(other: GeoExtent): GeoExtent;
  contains(other: GeoExtent): GeoExtent;
  crop(other: GeoExtent): GeoExtent;
  equals: (other: GeoExtent, options?: { digits?: number }) => boolean;
  overlaps(other: GeoExtent): boolean;
  reproj: ((srs: number, options?: { quiet: false }) => GeoExtent) | ((srs: number, options: { quiet: true }) => (GeoExtent | undefined));
  unwrap(): GeoExtent[];
}
