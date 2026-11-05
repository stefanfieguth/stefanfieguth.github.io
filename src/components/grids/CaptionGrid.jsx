import { useEffect } from 'react'
import Lightbox from '../viewers/Lightbox.jsx'
import MediaBox from '../viewers/MediaBox.jsx'
import Placeholder from '../viewers/Placeholder.jsx'
import useLightboxSequence from '../../hooks/useLightboxSequence.js'
import styles from './CaptionGrid.module.css'

/**
 * CaptionGrid
 *
 * A grid of small, same-sized thumbnails that fills left-to-right,
 * top-to-bottom (CSS grid auto-fill), each with a caption underneath —
 * e.g. the General 3D Printing Projects gallery.
 *
 * Props:
 *   items          CaptionGridItem[]
 *   onImageClick   ((src: string) => void)?  — forwarded to the Lightbox's
 *                  `onImageClick` (see Lightbox.jsx); no built-in behavior
 *   onImageChange  ((src: string | null) => void)?  — called whenever the
 *                  src shown in the lightbox changes: on open, on Prev/Next
 *                  navigation to a different item, and on close (with null)
 *
 * CaptionGridItem shape:
 *   {
 *     src: string,          // photo, .mp4 video, .stl model or https:// embed
 *                           // (see MediaBox / mediaType.js)
 *     caption: string,
 *     type?: 'photo' | 'video' | 'stl' | 'iframe' | 'text',
 *                           // guessed from src when omitted; 'text' is a
 *                           // plain captioned card with no media
 *     thumb?: string,       // still image shown in the tile instead of the
 *                           // live media; the real item opens on click
 *     alt?: string,
 *     link?: { label: string, href: string },  // extra link after the caption
 *     placeholder?: boolean,     // true if the source file doesn't exist yet
 *     note?: string,             // shown on placeholder tiles
 *     maximumCutoffRatio?, xMove?, yMove?  // photo crop tweaks (see MediaFrame)
 *   }
 */
export default function CaptionGrid({ items = [], onImageClick, onImageChange }) {
  // Left-to-right, top-to-bottom order — the sequence Left/Right arrow
  // keys step through in the lightbox. Placeholders and text-only items
  // have no real source.
  const viewableItems = items.filter((item) => !item.placeholder && item.type !== 'text')
  const lightbox = useLightboxSequence(viewableItems)
  const openItem = lightbox.openItem
  const currentSrc = openItem?.src ?? null

  useEffect(() => {
    onImageChange?.(currentSrc)
  }, [currentSrc, onImageChange])

  if (items.length === 0) return null

  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <figure key={i} className={styles.item}>
          <div className={styles.media}>
            {item.type === 'text' ? (
              <div className={styles.textTile}>
                <span className={styles.textTileLabel}>{item.caption}</span>
              </div>
            ) : item.placeholder ? (
              <Placeholder label="Media needed" note={item.note} />
            ) : (
              <MediaBox
                item={{ ...item, alt: item.alt ?? item.caption }}
                onOpen={() => lightbox.open(item)}
              />
            )}
          </div>
          {item.type !== 'text' && (
            <figcaption className={styles.caption}>
              {item.caption}
              {item.link && (
                <>
                  {' · '}
                  <a href={item.link.href} target="_blank" rel="noopener noreferrer" className={styles.captionLink}>
                    {item.link.label}
                  </a>
                </>
              )}
            </figcaption>
          )}
        </figure>
      ))}

      {openItem && (
        <Lightbox
          src={openItem.src}
          alt={openItem.alt ?? openItem.caption}
          type={openItem.type}
          onClose={lightbox.close}
          onPrev={lightbox.prev}
          onNext={lightbox.next}
          onImageClick={onImageClick}
        />
      )}
    </div>
  )
}
