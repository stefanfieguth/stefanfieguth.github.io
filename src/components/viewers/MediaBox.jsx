import { Suspense, lazy } from 'react'
import MediaFrame from './MediaFrame.jsx'
import STLViewerFallback from './STLViewerFallback.jsx'
import mediaType from '../../utils/mediaType.js'
import styles from './MediaBox.module.css'

// Code-split: three.js only downloads on pages that actually show a model.
const STLViewer = lazy(() => import('./STLViewer.jsx'))

/**
 * MediaBox
 *
 * Any one media item filling its parent's box (the parent sets the size):
 * the shared "image box" behind the write-up grids (GridItem), project
 * cards (CardGrid) and galleries (CaptionGrid).
 *
 *   photo / video  cropped to fill; clicking opens the full item (onOpen)
 *   stl            live, auto-rotating 3D viewer you can drag in place
 *   iframe         the embedded page, usable in place (e.g. a YouTube player)
 *
 * STL models and embeds stay interactive inside the box, so instead of the
 * whole box being clickable they get a small "open full size" button in
 * the corner. An item with a `thumb` shows that still image instead of the
 * live media, and opens the real thing on click.
 *
 * Props:
 *   item    { src, type?, alt?, thumb?, maximumCutoffRatio?, xMove?, yMove? }
 *           — `type` is guessed from `src` when omitted (see mediaType.js);
 *           the crop fields are passed to MediaFrame
 *   onOpen  (() => void)?  — open this item in the lightbox
 */
export default function MediaBox({ item, onOpen }) {
  const type = mediaType(item.src, item.type)
  const alt = item.alt ?? ''

  if (item.thumb || type === 'photo' || type === 'video') {
    return (
      <button
        type="button"
        className={`${styles.box} ${styles.clickable}`}
        onClick={onOpen}
        aria-label={alt ? `Open ${alt}` : 'Open full size'}
      >
        <MediaFrame
          type={item.thumb ? 'photo' : type}
          src={item.thumb ?? item.src}
          alt={alt}
          maximumCutoffRatio={item.maximumCutoffRatio}
          xMove={item.xMove}
          yMove={item.yMove}
          zoomOnHover
        />
      </button>
    )
  }

  return (
    <div className={styles.box}>
      {type === 'stl' ? (
        <Suspense fallback={<STLViewerFallback fill />}>
          <STLViewer src={item.src} fill tile />
        </Suspense>
      ) : (
        <iframe
          src={item.src}
          title={alt || 'Embedded content'}
          className={styles.iframe}
          loading="lazy"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}

      {onOpen && (
        <button type="button" className={styles.expand} onClick={onOpen} aria-label="Open full size">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M10 2h4v4M6 14H2v-4M14 2 9 7M2 14l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
