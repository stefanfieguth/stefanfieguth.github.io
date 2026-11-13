import { useState } from 'react'

/**
 * useLightboxSequence
 *
 * Open/prev/next state for a fullscreen view that steps through a list of
 * items, wrapping around at either end. Shared by CaptionGrid, CardGrid,
 * and ManualGrid.
 *
 * `snapshot` is optional caller-defined data captured when an item is
 * opened (ManualGrid uses it to seed the fullscreen view at the same
 * step/position the small view was at); it's cleared on prev/next, since
 * it only describes the item that was clicked.
 *
 * Returns:
 *   openItem   the open item, or null when closed
 *   snapshot   whatever was passed to open() for it, or null
 *   open       (item, snapshot?) => void — no-op if item isn't in `items`
 *   close      () => void
 *   prev/next  (() => void) | undefined — undefined when there are fewer
 *              than 2 items, matching Overlay's "no siblings" convention
 */
export default function useLightboxSequence(items) {
  const [state, setState] = useState(null)   // { index, snapshot } | null

  const step = (delta) =>
    setState(s => ({ index: (s.index + delta + items.length) % items.length, snapshot: null }))

  const open = (item, snapshot = null) => {
    const index = items.indexOf(item)
    if (index !== -1) setState({ index, snapshot })
  }

  return {
    openItem: state ? items[state.index] ?? null : null,
    snapshot: state?.snapshot ?? null,
    open,
    close: () => setState(null),
    prev: items.length > 1 ? () => step(-1) : undefined,
    next: items.length > 1 ? () => step(1) : undefined,
  }
}
