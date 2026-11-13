/**
 * mediaType.js
 *
 * Works out what kind of media a `src` is, so the data files can just give
 * a path and every image box (write-ups, project cards, galleries) shows
 * the right thing:
 *
 *   'photo'   .jpg / .png / .webp / .svg / ... (anything not listed below)
 *   'video'   .mp4 / .webm / .mov / .m4v — plays muted on a loop
 *   'stl'     .stl — interactive, auto-rotating 3D viewer
 *   'iframe'  an https:// web address that isn't an image or video file,
 *             e.g. a YouTube embed link (https://www.youtube.com/embed/<id>)
 *             or an Onshape / Sketchfab embed — shown as an embedded page
 *
 * An explicit `type` always wins over the guess (e.g. for an embed URL that
 * happens to end in .png).
 */
const VIDEO = /\.(mp4|webm|mov|m4v)$/
const IMAGE = /\.(jpe?g|png|gif|webp|avif|svg|bmp)$/

export default function mediaType(src = '', explicitType) {
  if (explicitType) return explicitType
  const path = src.split(/[?#]/)[0].toLowerCase()
  if (VIDEO.test(path)) return 'video'
  if (path.endsWith('.stl')) return 'stl'
  if (/^https?:\/\//i.test(src) && !IMAGE.test(path)) return 'iframe'
  return 'photo'
}

/** Types that are interactive in place (dragged / clicked inside the box). */
export const isInteractive = (type) => type === 'stl' || type === 'iframe'
