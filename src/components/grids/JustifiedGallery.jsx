import { useEffect, useState } from 'react'
import Lightbox from '../viewers/Lightbox.jsx'
import useContainerWidth from '../../hooks/useContainerWidth.js'
import useLightboxSequence from '../../hooks/useLightboxSequence.js'
import styles from './JustifiedGallery.module.css'

// Target photo height per row; the real height of each row lands near this
// so that the row exactly fills the width. ~340px fits 3 portraits or 2
// landscapes in a desktop row.
const TARGET_HEIGHT = 340
const TARGET_HEIGHT_MOBILE = 200
const MOBILE_WIDTH = 600
const GAP = 12
// Used until a photo has loaded and its real shape is known.
const DEFAULT_RATIO = 4 / 3

// The last row may be left short of the full width rather than blown up
// past this multiple of the target height.
const LAST_ROW_MAX = 1.3

// Splits items (in order) into rows so that every row's height, once scaled
// to fill the width, is as close as possible to the target. Tries every
// possible set of row breaks (fine for gallery-sized lists) instead of
// filling greedily, so there's no oversized or nearly-empty row at the end.
function layoutRows(ratios, width, target) {
  const n = ratios.length
  const rowHeight = (i, j) => {
    let sum = 0
    for (let k = i; k < j; k++) sum += ratios[k]
    return (width - GAP * (j - i - 1)) / sum
  }
  const shown = (i, j) => (j === n ? Math.min(rowHeight(i, j), target * LAST_ROW_MAX) : rowHeight(i, j))

  // best[i] = lowest total cost of laying out items i..n-1
  const best = new Array(n + 1).fill(Infinity)
  const next = new Array(n + 1)
  best[n] = 0
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i + 1; j <= n; j++) {
      const cost = (shown(i, j) - target) ** 2 + best[j]
      if (cost < best[i]) {
        best[i] = cost
        next[i] = j
      }
    }
  }

  const rows = []
  for (let i = 0; i < n; i = next[i]) {
    const items = []
    for (let k = i; k < next[i]; k++) items.push({ index: k, ratio: ratios[k] })
    rows.push({ items, height: shown(i, next[i]) })
  }
  return rows
}

/**
 * JustifiedGallery
 *
 * Large photo gallery in "justified rows" (like Google Photos): every photo
 * at its real shape with no cropping, each row scaled so it exactly fills
 * the width, captions underneath. Works with any mix of portrait and
 * landscape photos in any order; the shapes are read as the photos load.
 * Click a photo to enlarge it (arrow keys / swipe step through).
 *
 * Props:
 *   items  { src, caption?, alt?, ratio? }[]
 *          ratio (width / height) is optional; it's measured automatically.
 */
export default function JustifiedGallery({ items = [] }) {
  const [ref, width] = useContainerWidth()
  const [ratios, setRatios] = useState({})   // src -> width / height
  const lightbox = useLightboxSequence(items)
  const openItem = lightbox.openItem

  // Measure every photo's shape (the browser caches it for the <img> below).
  useEffect(() => {
    let cancelled = false
    items.forEach(({ src, ratio }) => {
      if (ratio) return
      const img = new Image()
      img.onload = () => {
        if (cancelled || !img.naturalWidth || !img.naturalHeight) return
        setRatios((prev) => ({ ...prev, [src]: img.naturalWidth / img.naturalHeight }))
      }
      img.src = src
    })
    return () => { cancelled = true }
  }, [items])

  if (items.length === 0) return null

  const target = width && width < MOBILE_WIDTH ? TARGET_HEIGHT_MOBILE : TARGET_HEIGHT
  const rows = width
    ? layoutRows(items.map((it) => it.ratio ?? ratios[it.src] ?? DEFAULT_RATIO), width, target)
    : []

  return (
    <div ref={ref} className={styles.gallery}>
      {rows.map((row, r) => (
        <div key={r} className={styles.row} style={{ gap: GAP }}>
          {row.items.map(({ index, ratio }) => {
            const item = items[index]
            return (
              <figure key={index} className={styles.item} style={{ width: ratio * row.height - 0.01 }}>
                <button
                  type="button"
                  className={styles.photo}
                  style={{ height: row.height }}
                  onClick={() => lightbox.open(item)}
                  aria-label={`Enlarge: ${item.alt ?? item.caption ?? 'photo'}`}
                >
                  <img src={item.src} alt={item.alt ?? item.caption ?? ''} loading="lazy" decoding="async" />
                </button>
                {item.caption && <figcaption className={styles.caption}>{item.caption}</figcaption>}
              </figure>
            )
          })}
        </div>
      ))}

      {openItem && (
        <Lightbox
          src={openItem.src}
          alt={openItem.alt ?? openItem.caption}
          onClose={lightbox.close}
          onPrev={lightbox.prev}
          onNext={lightbox.next}
        />
      )}
    </div>
  )
}
