/**
 * mediaTiles.js
 *
 * Shorthand used by the data files (src/data/**) to describe the media in
 * a project write-up, plus the paths of the temporary placeholder images.
 *
 * Media in a write-up is laid out by ManualGrid in numbered rows (0 is the
 * top row). Two tile shapes cover every write-up:
 *
 *   tile(row, src, alt, caption)  — half-width box (about 4:3). Two tiles
 *                                   with the same row number sit side by side.
 *   wide(row, src, alt, caption)  — full-width box (16:9) on its own row.
 *
 *   row      Row number, counting from 0 at the top.
 *   src      What to show. The kind of media is worked out from it:
 *              '/assets/images/foo.jpg'   photo (also .png, .webp, .svg, ...)
 *              '/assets/videos/foo.mp4'   video, plays muted on a loop (.webm too)
 *              '/assets/models/foo.stl'   interactive 3D model viewer
 *              'https://...'              embedded web page, e.g. a YouTube
 *                                         embed link: https://www.youtube.com/embed/<id>
 *            Files in public/ are written without the 'public' part:
 *            public/assets/images/foo.jpg → '/assets/images/foo.jpg'.
 *   alt      Short description for screen readers (and shown if a photo
 *            fails to load).
 *   caption  Text shown centred over the bottom of the box. Optional —
 *            leave it out (or pass '') for no caption.
 *   options  Optional 5th argument, for the rare case the guess is wrong:
 *              { type: 'photo' | 'video' | 'stl' | 'iframe' }
 *            or to show a still image in the box instead of the live media:
 *              { thumb: '/assets/images/foo-thumb.jpg' }
 *
 * Example — one wide video with a photo and a 3D model underneath:
 *   media: [
 *     wide(0, '/assets/videos/demo.mp4',  'Demo',    'Running Demo'),
 *     tile(1, '/assets/images/detail.jpg', 'Detail',  'Close-up'),
 *     tile(1, '/assets/models/part.stl',   'Part',    '3D Model'),
 *   ]
 *
 * Clicking a photo or video opens it full size. 3D models and embeds can be
 * used right in the box, and have a small button in the corner that opens
 * them full size. Photos and videos of another shape are cropped to fit.
 *
 * Heights are fractions of the grid's width: 0.375 makes a half-width tile
 * about 4:3, and 0.5625 a full-width box exactly 16:9.
 */

const HALF_HEIGHT = 0.375
const WIDE_HEIGHT = 0.5625

/** Half-width media box; two consecutive tiles share a row. */
export const tile = (row, src, alt, caption, options = {}) => ({
  type: options.type, thumb: options.thumb,
  src, alt, caption, row, width: 0.5, height: HALF_HEIGHT,
})

/** Full-width media box. */
export const wide = (row, src, alt, caption, options = {}) => ({
  type: options.type, thumb: options.thumb,
  src, alt, caption, row, width: 1, height: WIDE_HEIGHT,
})

/**
 * Temporary placeholder images (public/assets/images/placeholders/). Use
 * them wherever a real photo isn't ready yet; replace each use with the
 * real image path once it is.
 *   PLACEHOLDER.photo  4:3, for tile() and grid thumbnails
 *   PLACEHOLDER.wide   16:9, for wide()
 *   PLACEHOLDER.hero   wide banner, for a page's heroImage
 */
export const PLACEHOLDER = {
  photo: '/assets/images/placeholders/placeholder-4x3.svg',
  wide:  '/assets/images/placeholders/placeholder-16x9.svg',
  hero:  '/assets/images/placeholders/placeholder-hero.svg',
}
