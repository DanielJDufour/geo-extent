# function: unwrap
When you have an extent the crosses over [the 180th meridian](https://en.wikipedia.org/wiki/180th_meridian), you can "unwrap" or split it into separate extents that fall within the standard longitude confines from -180 to 180.

```js
// extent roughly covering the pacific ocean between Japan and Hawaii
const extent = new GeoExtent([-230, 19, -155, 45], { srs: 4326 })
const unwrapped = extent.unwrap()
```
unwrapped is an array equivalent to the following
```js
[
  new GeoExtent([ 130, 19, 180, 45 ], { srs: 4326 }),
  new GeoExtent([ -180, 19, -155, 45 ], { srs: 4326 })
]
```