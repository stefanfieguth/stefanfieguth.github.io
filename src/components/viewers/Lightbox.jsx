import { Suspense, lazy } from 'react'
import Overlay from './Overlay.jsx'
import STLViewerFallback from './STLViewerFallback.jsx'
import useIsMobile from '../../hooks/useIsMobile.js'
import useSwipeNav from '../../hooks/useSwipeNav.js'
import mediaType, { isInteractive } from '../../utils/mediaType.js'
import styles from './Lightbox.module.css'

const STLViewer = lazy(() => import('./STLViewer.jsx'))

/**
 * Lightbox
 *
 * One full-size media item (photo, video, STL model or embedded page)
 * inside an Overlay. `onPrev`/`onNext` are optional — pass them when the
 * item belongs to a sequence (a grid) so the Left/Right arrow keys, the
 * mobile arrow buttons, and (for photos/videos) a swipe step through it.
 *
 * Props:
 *   src      string
 *   alt      string?
 *   type     'photo' | 'video' | 'stl' | 'iframe'?  — guessed from src if omitted
 *   onClose  () => void
 *   onPrev   (() => void)?
 *   onNext   (() => void)?
 *   onImageClick  ((src: string) => void)?  — called when the enlarged
 *                 photo itself is clicked (photo type only)
 */
export default function Lightbox({ src, alt = '', type, onClose, onPrev, onNext, onImageClick }) {
  const isMobile = useIsMobile()
  const resolvedType = mediaType(src, type)
  // Swiping an STL model rotates it and swiping an embed scrolls it, so
  // swipe navigation is only for photos and videos (the arrow buttons
  // still work for everything).
  const swipeHandlers = useSwipeNav({
    enabled: isMobile && !isInteractive(resolvedType),
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
  })

  return (
    <Overlay onClose={onClose} onPrev={onPrev} onNext={onNext} swipeHandlers={swipeHandlers}>
      <LightboxMedia src={src} alt={alt} type={resolvedType} onImageClick={onImageClick} />
    </Overlay>
  )
}

/**
 * LightboxMedia
 *
 * Just the enlarged media element itself, sized to fit inside an Overlay —
 * Lightbox's content, exported separately for callers that manage their
 * own Overlay (ManualGrid). Props are the same as Lightbox's.
 */
export function LightboxMedia({ src, alt = '', type, onImageClick }) {
  const resolvedType = mediaType(src, type)

  if (resolvedType === 'video') {
    return (
      <video
        src={src}
        className={styles.lightboxImage}
        controls
        autoPlay
        loop
        muted
        playsInline
      />
    )
  }

  if (resolvedType === 'iframe') {
    return (
      <iframe
        src={src}
        className={styles.lightboxIframe}
        title={alt}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (resolvedType === 'stl') {
    return (
      <div className={styles.lightboxStl}>
        <Suspense fallback={<STLViewerFallback fill />}>
          <STLViewer src={src} hint="Drag to rotate · Scroll to zoom" fill />
        </Suspense>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={styles.lightboxImage}
      draggable={false}
      onClick={onImageClick ? () => onImageClick(src) : undefined}
    />
  )
}
