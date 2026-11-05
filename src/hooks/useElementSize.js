import { useEffect, useRef, useState } from 'react'

/**
 * useElementSize
 *
 * Tracks the rendered content-box width AND height of an element via
 * ResizeObserver — useContainerWidth's two-axis sibling, for callers whose
 * math depends on the box's shape rather than just its width (e.g.
 * MediaFrame's crop, which depends on the box's aspect ratio).
 *
 * Returns [ref, { width, height }] — attach ref to the element to measure.
 * Both are 0 until the first observation fires (post-mount), and stay 0
 * while `enabled` is false, so callers that only sometimes need the size
 * don't pay for an observer (and a re-render on every resize) otherwise.
 */
export default function useElementSize(enabled = true) {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height }))
      }
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [enabled])

  return [ref, size]
}
