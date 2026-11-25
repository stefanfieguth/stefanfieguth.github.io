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
 *              '/assets/models/foo.glb'   the same viewer, keeping each part's
 *                                         own colours (.gltf works too) — export
 *                                         from CAD as glTF / GLB
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
 *            or a photo to show if an .stl / .mp4 file is missing or fails
 *            to load (for videos it's also the still frame shown before
 *            playback starts), so the box is never empty:
 *              { fallback: '/assets/images/foo.jpg' }
 *            or, for a short .mp4 teaser, the full video on YouTube
 *            (unlisted videos work). The teaser loops in the box with a
 *            "Full video" badge; clicking it plays the YouTube video:
 *              { youtube: 'https://youtu.be/<id>' }   (or just the id)
 *            Options can be combined: { fallback: ..., youtube: ... }
 *
 *            Custom box shape (e.g. for portrait photos or phone videos):
 *              { width: 0.43, height: 0.76 }
 *            Both are fractions of the grid's width (see "Heights" below);
 *            the widths in one row should add up to 1. A box the same shape
 *            as the picture shows all of it; otherwise it's cropped to fit.
 *
 *            3D model options (.glb / .gltf only — see GLTFViewer.jsx):
 *              { config: { ... } }   viewer settings, e.g.
 *                  { initialEuler: [1.57, 0, 0] }  start rotated (radians)
 *                  { zoom: 1.5 }                   start zoomed in
 *                  { colorMode: 'uniform' }        all parts one metallic grey
 *              { annotations: [{ label, headPosition: {x,y,z}, textOffset: {x,y} }] }
 *                                    arrows with labels pinned to the model
 *
 *            Build progression: pass `null` as src and list the steps.
 *            Each step shows its own set of model files; a slider under
 *            the model steps through them (step names show when the box
 *            is wide enough):
 *              tile(0, null, 'Build stages', 'Build Progression', {
 *                steps: [
 *                  { label: 'Frame', models: [`${MODELS}/frame.glb`] },
 *                  { label: 'Panels', models: [`${MODELS}/frame.glb`, `${MODELS}/panels.glb`] },
 *                ],
 *              })
 *            Add `config: { compactText: true }` for dots + the step name
 *            instead of the slider.
 *
 *            Inside view: pass `null` as src and list the models, outside
 *            first. A slider fades each model to its `opacity` in turn,
 *            revealing what's inside:
 *              tile(0, null, 'Internals', 'Inside View', {
 *                models: [
 *                  { path: `${MODELS}/shell.glb`,     label: 'Shell',    opacity: 0.1 },
 *                  { path: `${MODELS}/internals.glb`, label: 'Internals', opacity: 1 },
 *                ],
 *              })
 *
 * Example — one wide video with a photo and a 3D model underneath:
 *   media: [
 *     wide(0, '/assets/videos/demo.mp4',  'Demo',    'Running Demo'),
 *     tile(1, '/assets/images/detail.jpg', 'Detail',  'Close-up'),
 *     tile(1, '/assets/models/part.stl',   'Part',    '3D Model'),
 *   ]
 *
 * Videos go in public/assets/videos/ and 3D models in public/assets/models/.
 * Keep teaser videos short and small (about 10 s, 720p, no audio track,
 * a few MB) so pages load quickly.
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

// Fields shared by tile() and wide(). Progression / inside-view models have
// no single src, so their first model file stands in as the item's src
// (used to tell items apart).
function mediaFields(src, options) {
  const { type, thumb, fallback, youtube, config, annotations, steps, models } = options
  return {
    type: type ?? (steps ? 'gltfProgression' : models ? 'gltfInternal' : undefined),
    src: src ?? steps?.[0]?.models?.[0] ?? models?.[0]?.path,
    thumb, fallback, youtube, config, annotations, steps, models,
  }
}

/** Half-width media box; two consecutive tiles share a row. */
export const tile = (row, src, alt, caption, options = {}) => ({
  ...mediaFields(src, options), alt, caption, row,
  width: options.width ?? 0.5, height: options.height ?? HALF_HEIGHT,
})

/** Full-width media box. */
export const wide = (row, src, alt, caption, options = {}) => ({
  ...mediaFields(src, options), alt, caption, row,
  width: options.width ?? 1, height: options.height ?? WIDE_HEIGHT,
})

/**
 * Temporary placeholder images (public/assets/images/placeholders/). Use
 * them wherever a real photo isn't ready yet; replace each use with the
 * real image path once it is.
 *   PLACEHOLDER.photo  4:3, for tile() and grid thumbnails
 *   PLACEHOLDER.tall   3:4 portrait, for large galleries
 *   PLACEHOLDER.wide   16:9, for wide()
 *   PLACEHOLDER.hero   wide banner, for a page's heroImage
 */
export const PLACEHOLDER = {
  photo: '/assets/images/placeholders/placeholder-4x3.svg',
  tall:  '/assets/images/placeholders/placeholder-3x4.svg',
  wide:  '/assets/images/placeholders/placeholder-16x9.svg',
  hero:  '/assets/images/placeholders/placeholder-hero.svg',
}
