import { useState } from 'react'
import useElementSize from '../../hooks/useElementSize.js'
import styles from './MediaFrame.module.css'

/**
 * MediaFrame
 *
 * One photo or video filling its parent's box — the shared "media in a
 * box" piece behind MediaBox (write-up tiles, project cards, galleries).
 * It only handles fitting the media: borders, rounding, click handling,
 * captions, etc. stay with whichever component wraps it.
 * The parent must give it a definite size (MediaFrame is 100% × 100%).
 *
 * By default the media simply fills the box via object-fit: cover. Two
 * optional adjustments need the media's natural ratio and the box's own
 * ratio, so they only kick in once the media has loaded and the box has
 * been measured (and are re-applied whenever the box resizes):
 *
 *   maximumCutoffRatio  — when a plain cover crop would cut off more than
 *                         this fraction of the constrained dimension, the
 *                         media is scaled down to cut off exactly that much
 *                         and letterboxed/pillarboxed (black background)
 *                         for the remainder.
 *   xMove / yMove       — shift the media off-center, zooming in first if
 *                         the shift would otherwise pull an edge of the
 *                         media into a side of the box it fills.
 *
 * Both are applied via inline percentage size/position so they work the
 * same for <img> and <video> (poster frame and active playback alike).
 *
 * Props:
 *   type                'photo' | 'video'  (default 'photo')
 *   src                 string
 *   alt                 string?  — ignored for video
 *   maximumCutoffRatio  number?  — 0-1, default 1 (always crop to fill)
 *   xMove               number?  — default 0. Shifts the media right
 *                                  (negative = left) by this fraction of the
 *                                  box's width, e.g. 0.1 = 10%
 *   yMove               number?  — default 0. Same, down (negative = up),
 *                                  as a fraction of the box's height
 *   zoomOnHover         boolean? — scale the media up slightly while the
 *                                  frame is hovered, to signal it's clickable
 *   loading             'lazy' | 'eager'  (default 'lazy') — photo only;
 *                                  'eager' for above-the-fold media (Hero)
 *   onLoad              ((e) => void)?  — forwarded load/loadedmetadata event
 */
export default function MediaFrame({
  type = 'photo',
  src,
  alt = '',
  maximumCutoffRatio = 1,
  xMove = 0,
  yMove = 0,
  zoomOnHover = false,
  loading = 'lazy',
  onLoad,
}) {
  const needsLayout = maximumCutoffRatio < 1 || xMove !== 0 || yMove !== 0
  const [frameRef, frameSize] = useElementSize(needsLayout)
  // Tagged with the src it was measured from, so a stale ratio is never
  // applied to a different image while the new one is still loading.
  const [natural, setNatural] = useState(null)   // { src, ratio } | null
  const naturalRatio = natural?.src === src ? natural.ratio : null

  const handleLoad = (e) => {
    const mediaEl = e.target
    const ratio = type === 'video'
      ? mediaEl.videoWidth / mediaEl.videoHeight
      : mediaEl.naturalWidth / mediaEl.naturalHeight
    setNatural({ src, ratio })
    onLoad?.(e)
  }

  const layout = needsLayout && naturalRatio && frameSize.width && frameSize.height
    ? computeLayout(frameSize.width / frameSize.height, naturalRatio, maximumCutoffRatio, xMove, yMove)
    : null

  const className = [
    styles.frame,
    zoomOnHover && styles.zoomOnHover,
    layout?.letterboxed && styles.letterboxed,
  ].filter(Boolean).join(' ')

  return (
    <div ref={frameRef} className={className}>
      {type === 'video' ? (
        <video
          className={styles.media}
          style={layout?.style}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={handleLoad}
        />
      ) : (
        <img
          className={styles.media}
          style={layout?.style}
          src={src}
          alt={alt}
          draggable={false}
          loading={loading}
          onLoad={handleLoad}
        />
      )}
    </div>
  )
}

// Inline style placing the media inside a box of ratio `boxRatio`, plus
// whether any of the box is left uncovered (needs the black backdrop).
function computeLayout(boxRatio, naturalRatio, maximumCutoffRatio, xMove, yMove) {
  if (!naturalRatio) return null

  // Media size as a fraction of the box's width/height under a plain
  // cover crop — one side exactly 1, the other overflowing past it.
  const coverWidth = boxRatio > naturalRatio ? 1 : naturalRatio / boxRatio
  const coverHeight = boxRatio > naturalRatio ? boxRatio / naturalRatio : 1

  // Fraction of the constrained dimension a plain cover-crop would cut off.
  const fraction = 1 - Math.min(boxRatio, naturalRatio) / Math.max(boxRatio, naturalRatio)
  // Scale down from "cover" toward "contain" until exactly
  // maximumCutoffRatio of the constrained dimension is cut off.
  let scale = fraction > maximumCutoffRatio
    ? (1 - fraction) / (1 - maximumCutoffRatio)
    : 1

  // Shifting by `move` leaves a gap on one side unless the media
  // overhangs the box by at least `move` on both sides, i.e. its size is
  // >= 1 + 2|move|. Only sides the media already fills need guarding — a
  // letterboxed side has a gap by design, and just slides within it.
  const zoomToCover = (size, move) => (size >= 1 ? (1 + 2 * Math.abs(move)) / size : 1)
  scale *= Math.max(
    1,
    zoomToCover(coverWidth * scale, xMove),
    zoomToCover(coverHeight * scale, yMove),
  )

  const width = coverWidth * scale
  const height = coverHeight * scale
  return {
    style: {
      position: 'absolute',
      left: `${((1 - width) / 2 + xMove) * 100}%`,
      top: `${((1 - height) / 2 + yMove) * 100}%`,
      width: `${width * 100}%`,
      height: `${height * 100}%`,
      maxWidth: 'none',
    },
    letterboxed: width < 1 || height < 1,
  }
}
