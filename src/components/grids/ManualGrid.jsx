import useContainerWidth from '../../hooks/useContainerWidth.js'
import useIsMobile from '../../hooks/useIsMobile.js'
import useLightboxSequence from '../../hooks/useLightboxSequence.js'
import useSwipeNav from '../../hooks/useSwipeNav.js'
import GridItem from './GridItem.jsx'
import Overlay from '../viewers/Overlay.jsx'
import { LightboxMedia } from '../viewers/Lightbox.jsx'
import mediaType, { isInteractive } from '../../utils/mediaType.js'
import styles from './ManualGrid.module.css'

// ─── Layout helpers ─────────────────────────────────────────────────────────
//
// Groups are built from the flat `items` array in two passes. A row-spanning
// item can appear anywhere among the rows it ties together (rule 3) — before
// some of their items, after others — so a single linear scan can't group
// correctly on its own: if two plain, differently-numbered rows' items
// happen to sit next to each other *before* the spanner that ties them
// together is reached, a one-pass scan would already have split them into
// separate groups with no way to undo that once the spanner shows up.
//
// Instead: first union every row number a spanning item's `rows` ties
// together into the same set (a row number on its own just represents
// itself). Then walk the items again and merge consecutive items whenever
// they resolve to the same set — structurally identical to the original
// single-pass groupby, just keyed by that resolved set instead of the raw
// `row` number. Without any spanning items, every row resolves to itself,
// so this reproduces today's behavior exactly.
function find(parent, r) {
  if (!parent.has(r)) parent.set(r, r)
  let root = r
  while (parent.get(root) !== root) root = parent.get(root)
  let cur = r
  while (parent.get(cur) !== root) {
    const next = parent.get(cur)
    parent.set(cur, root)
    cur = next
  }
  return root
}

function buildGroups(items) {
  const parent = new Map()
  for (const item of items) {
    if (Array.isArray(item.rows)) {
      if (import.meta.env.DEV) {
        const isConsecutive = item.rows.every((r, i) => i === 0 || r === item.rows[i - 1] + 1)
        if (!isConsecutive) {
          console.warn(`ManualGrid: item.rows must be consecutive row numbers, got [${item.rows}].`)
        }
      }
      for (let i = 1; i < item.rows.length; i++) {
        const ra = find(parent, item.rows[0])
        const rb = find(parent, item.rows[i])
        if (ra !== rb) parent.set(ra, rb)
      }
    } else {
      find(parent, item.row)
    }
  }

  const rootOf = (item) => find(parent, Array.isArray(item.rows) ? item.rows[0] : item.row)

  const groups = []
  let current = null
  for (const item of items) {
    const root = rootOf(item)
    if (current && current.root === root) {
      current.items.push(item)
    } else {
      if (current) groups.push(current)
      current = { root, items: [item] }
    }
  }
  if (current) groups.push(current)

  return groups.map(({ items: groupItems }) => {
    const rowSet = new Set()
    groupItems.forEach(item => {
      if (Array.isArray(item.rows)) item.rows.forEach(r => rowSet.add(r))
      else rowSet.add(item.row)
    })
    return { rowSet, items: groupItems }
  })
}

// Explicit pixel layout for a row-spanning group — the thing plain flexbox
// rows can't express, since the spanning item's left edge must line up
// across every row it spans (rule 4), each row's own before/after items
// have to size independently around that shared offset (rules 4/5), and
// the spanning item's own height is independent of the rows it spans
// (rule 2). Returns { height, boxes } where boxes is a flat list of
// { item, x, y, width, height } — one per item in the group, including the
// spanning item itself — all positioned relative to the group's own
// top-left corner.
function layoutRowGroup(group, containerWidth, gap) {
  const rowsSorted = [...group.rowSet].sort((a, b) => a - b)
  const spanners = group.items.filter(i => Array.isArray(i.rows))
  const spanner = spanners[0]

  if (import.meta.env.DEV && spanners.length > 1) {
    console.warn('ManualGrid: multiple row-spanning items in one row-group are not supported; only the first is treated as spanning.')
  }

  const spannerIdx = group.items.indexOf(spanner)
  const beforeItems = group.items.slice(0, spannerIdx)
  const afterItems  = group.items.slice(spannerIdx + 1)
  // Any *other* would-be spanner (see warning above) falls back to acting
  // like a plain item of its first declared row.
  const rowOf = (item) => item.row ?? Math.min(...item.rows)

  // Each spanned row is sized like a plain flex row whose items are its own
  // before/after items *plus* the spanner — so the row's gap budget counts
  // the gap(s) beside the spanner too, and widths that add up to 1 land
  // exactly on containerWidth (matching full-width rows above/below).
  const availableByRow = new Map()
  for (const r of rowsSorted) {
    const count = group.items.filter(i => i !== spanner && rowOf(i) === r).length + 1
    availableByRow.set(r, Math.max(0, containerWidth - gap * (count - 1)))
  }

  // Before-spanner items: fractions of their own row's available width.
  const beforeByRow = new Map()
  for (const r of rowsSorted) {
    const rowItems = beforeItems.filter(i => rowOf(i) === r)
    const widths = rowItems.map(i => i.width * availableByRow.get(r))
    const offset = rowItems.length ? widths.reduce((a, b) => a + b, 0) + gap * (rowItems.length - 1) : 0
    beforeByRow.set(r, { items: rowItems, widths, offset })
  }

  // The spanning item's left edge is the max natural offset across every
  // spanned row, plus one gap — rows with less "before" content just get a
  // bigger trailing gap in front of the spanner (their items keep their own
  // normal spacing from each other). Its width is a fraction of the tightest
  // spanned row's available width, so it never overflows any of them.
  const maxOffset = Math.max(0, ...[...beforeByRow.values()].map(v => v.offset))
  const spannerLeft = maxOffset > 0 ? maxOffset + gap : 0
  const spannerWidth = spanner.width * Math.min(...availableByRow.values())
  const spannerRight = spannerLeft + spannerWidth

  // After-spanner items are sized exactly like before-spanner items —
  // fractions of the whole grid (less their row's gaps), not of whatever
  // space happens to be left after the spanner. So if the spanner is 0.4
  // wide, an after-item meant to fill the rest of that row is given
  // width: 0.6, not width: 1.0 — same whole-grid fraction convention as
  // every other item in the grid. They're positioned starting right after
  // the spanner (spannerRight + gap).
  const afterByRow = new Map()
  for (const r of rowsSorted) {
    const rowItems = afterItems.filter(i => rowOf(i) === r)
    const widths = rowItems.map(i => i.width * availableByRow.get(r))
    afterByRow.set(r, { items: rowItems, widths })
  }

  // Vertical stacking of the spanned rows themselves — each row's height is
  // the tallest of its own before/after items (own item.height fraction,
  // never gap-shrunk, matching how height already works everywhere else in
  // this grid), top-aligned exactly like today's flex rows.
  const topByRow = new Map()
  const heightByRow = new Map()
  let cursorTop = 0
  rowsSorted.forEach((r, i) => {
    if (i > 0) cursorTop += heightByRow.get(rowsSorted[i - 1]) + gap
    topByRow.set(r, cursorTop)
    const rowItems = [...beforeByRow.get(r).items, ...afterByRow.get(r).items]
    const h = rowItems.length ? Math.max(...rowItems.map(it => it.height * containerWidth)) : 0
    heightByRow.set(r, h)
  })

  const lastRow = rowsSorted[rowsSorted.length - 1]
  const subRowsHeight = topByRow.get(lastRow) + heightByRow.get(lastRow)
  // Add back the gaps between the rows it spans, so a spanner of height 0.6
  // lines up exactly with two stacked rows of height 0.3.
  const spannerHeight = spanner.height * containerWidth + gap * (rowsSorted.length - 1)
  // The spanning item may be taller than the rows it spans (rule 2) — the
  // group still has to grow to fit it so it doesn't overlap whatever
  // follows, even though the sub-rows themselves aren't reconciled to match.
  const groupHeight = Math.max(subRowsHeight, spannerHeight)

  const boxes = []
  rowsSorted.forEach(r => {
    const top = topByRow.get(r)

    let x = 0
    beforeByRow.get(r).items.forEach((item, i) => {
      const width = beforeByRow.get(r).widths[i]
      boxes.push({ item, x, y: top, width, height: item.height * containerWidth })
      x += width + gap
    })

    let ax = spannerRight + (afterByRow.get(r).items.length ? gap : 0)
    afterByRow.get(r).items.forEach((item, i) => {
      const width = afterByRow.get(r).widths[i]
      boxes.push({ item, x: ax, y: top, width, height: item.height * containerWidth })
      ax += width + gap
    })
  })
  boxes.push({ item: spanner, x: spannerLeft, y: 0, width: spannerWidth, height: spannerHeight })

  return { height: groupHeight, boxes }
}

// Free-placement layout — every item declares its own x/y/width/height box,
// with no rows involved at all. All four are fractions of one unit
// U = containerWidth + gap, and each box is then shrunk by one gap on its
// right/bottom. That's what makes the spacing fall out for free: boxes that
// touch in fraction space (x 0 + width 0.4 → next x 0.4) land exactly `gap`
// px apart, outer edges sit flush with the container (x 0, width 1 spans
// exactly 0…containerWidth), and a height-0.7 box beside two stacked
// height-0.35 boxes lines up with them with no gap bookkeeping in the data.
// Returns the same { height, boxes } shape as layoutRowGroup.
function layoutFree(items, containerWidth, gap) {
  const unit = containerWidth + gap
  let bottom = 0

  const boxes = items.map(item => {
    if (import.meta.env.DEV && (item.x == null || item.y == null)) {
      console.warn('ManualGrid: in free-placement mode every item needs both x and y; missing values default to 0.', item)
    }
    const x = item.x ?? 0
    const y = item.y ?? 0
    bottom = Math.max(bottom, y + item.height)
    return {
      item,
      x: x * unit,
      y: y * unit,
      width:  Math.max(1, item.width  * unit - gap),
      height: Math.max(1, item.height * unit - gap),
    }
  })

  return { height: Math.max(0, bottom * unit - gap), boxes }
}

/**
 * ManualGrid
 *
 * A hand-placed grid: every item declares its own `row`, `width`, and
 * `height` in its data file (see src/data/projects/*.js and
 * src/utils/mediaTiles.js) rather than having a layout algorithm infer
 * them. Consecutive items sharing the same `row` value are placed
 * left-to-right in that row; a new `row` value starts a new row below.
 *
 * An item can instead declare `rows: [r1, r2, ...]` (an array of consecutive
 * row numbers) to visually span and sit beside all of those rows — its own
 * `height` still governs its size (not derived from the spanned rows, though
 * the gaps between them are added on, so 0.6 matches two 0.3 rows), it
 * can appear anywhere among the spanned rows' items, and its left edge
 * lines up with whichever spanned row has the most content before it (see
 * layoutRowGroup above for the exact math). Rows with no spanning item are
 * unaffected and still use plain flexbox.
 *
 * Free placement: if any item declares `x`, the whole grid switches to
 * free-placement mode instead — every item gives `x`, `y`, `width`, `height`
 * (no `row`/`rows`) and is positioned exactly there (see layoutFree above).
 *
 * `width`/`height` are fractions of this grid's own measured width (e.g.
 * 0.5 = half the grid's width) — both axes share that one unit, so a
 * photo can be made any shape and will be cropped (object-fit: cover) to
 * fit it if that shape doesn't match its native aspect ratio.
 *
 * Clicking any item opens one shared lightbox; Left/Right arrow keys (or a
 * swipe on mobile) step to the previous/next item in the grid.
 *
 * Props:
 *   items  { type, row, width, height, ...itemFields }[]
 *   gap    number  — px gap between items, both axes (default 16)
 */
export default function ManualGrid({ items = [], gap = 16 }) {
  const [containerRef, containerWidth] = useContainerWidth()
  const lightbox = useLightboxSequence(items)
  const isMobile = useIsMobile()

  const isFree = items.some(i => i.x != null)
  const groups = isFree ? [] : buildGroups(items)
  const openItem = lightbox.openItem

  const swipeHandlers = useSwipeNav({
    // Swiping an STL model rotates it and swiping an embed scrolls it, so
    // only photos/videos swipe-navigate (the arrow buttons work for all).
    enabled: isMobile && items.length > 1 && !(openItem && isInteractive(mediaType(openItem.src, openItem.type))),
    onSwipeLeft: lightbox.next,
    onSwipeRight: lightbox.prev,
  })

  // Free-placement and row-spanning layouts both come back as a list of
  // absolutely positioned boxes inside a relatively positioned wrapper.
  const renderBoxes = ({ height, boxes }, className, key) => (
    <div key={key} className={className} style={{ height }}>
      {boxes.map(({ item, x, y, width, height: boxHeight }, ii) => (
        <GridItem
          key={ii}
          item={item}
          style={{ position: 'absolute', left: x, top: y, width, height: boxHeight }}
          onOpen={lightbox.open}
        />
      ))}
    </div>
  )

  return (
    <div ref={containerRef} className={styles.grid} style={{ gap: `${gap}px` }}>
      {containerWidth > 0 && isFree && renderBoxes(layoutFree(items, containerWidth, gap), styles.canvas)}

      {containerWidth > 0 && groups.map((group, gi) => {
        if (group.rowSet.size > 1) {
          return renderBoxes(layoutRowGroup(group, containerWidth, gap), styles.rowGroup, gi)
        }

        // Plain row. Flexbox `gap` adds space *between* items on top of
        // their own widths, so scale widths against what's left after the
        // row's internal gaps — items + gaps then add up to exactly
        // containerWidth instead of overflowing it.
        const rowGapTotal = gap * Math.max(0, group.items.length - 1)
        const availableWidth = Math.max(0, containerWidth - rowGapTotal)

        return (
          <div key={gi} className={styles.row} style={{ gap: `${gap}px` }}>
            {group.items.map((item, ii) => {
              const width  = item.width  * availableWidth
              const height = item.height * containerWidth
              return (
                <GridItem
                  key={ii}
                  item={item}
                  style={{ width, height, flex: `0 0 ${width}px` }}
                  onOpen={lightbox.open}
                />
              )
            })}
          </div>
        )
      })}

      {openItem && (
        <Overlay
          onClose={lightbox.close}
          onPrev={lightbox.prev}
          onNext={lightbox.next}
          swipeHandlers={swipeHandlers}
        >
          <LightboxMedia
            key={openItem.src}
            src={openItem.src}
            alt={openItem.alt}
            type={openItem.type}
            fallback={openItem.fallback}
            youtube={openItem.youtube}
          />
        </Overlay>
      )}
    </div>
  )
}
