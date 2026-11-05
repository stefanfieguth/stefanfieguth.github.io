import { useRef, useCallback } from 'react'

// Minimum horizontal travel to count as a swipe rather than a tap.
const SWIPE_MIN_DISTANCE = 50
// Vertical drift allowed before a horizontal drag is treated as a vertical
// scroll instead — prevents an intentional up/down swipe (or a diagonal
// mis-swipe) from also triggering navigation.
const SWIPE_MAX_OFF_AXIS = 60

/**
 * useSwipeNav
 *
 * Single-touch swipe-left/swipe-right detection. Returns a pair of touch
 * handlers to spread onto whichever element should act as the
 * swipe-detection region — callers control the region simply by choosing
 * which element they attach the handlers to (e.g. the caption area below
 * a 3D viewer's canvas, rather than the canvas itself, so a rotate-drag
 * isn't mistaken for a page-swipe).
 *
 * Props:
 *   onSwipeLeft   () => void   // called on a leftward swipe (→ "next")
 *   onSwipeRight  () => void   // called on a rightward swipe (→ "prev")
 *   enabled       boolean      // when false, handlers are no-ops (default true)
 */
export default function useSwipeNav({ onSwipeLeft, onSwipeRight, enabled = true } = {}) {
  const startRef = useRef(null)

  const onTouchStart = useCallback((e) => {
    if (!enabled || e.touches.length !== 1) return
    const touch = e.touches[0]
    startRef.current = { x: touch.clientX, y: touch.clientY }
  }, [enabled])

  const onTouchEnd = useCallback((e) => {
    const start = startRef.current
    startRef.current = null
    if (!enabled || !start) return

    const touch = e.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dy) > SWIPE_MAX_OFF_AXIS) return

    if (dx <= -SWIPE_MIN_DISTANCE) onSwipeLeft?.()
    else if (dx >= SWIPE_MIN_DISTANCE) onSwipeRight?.()
  }, [enabled, onSwipeLeft, onSwipeRight])

  return { onTouchStart, onTouchEnd }
}
