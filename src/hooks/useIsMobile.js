import { useEffect, useState } from 'react'

// The one mobile breakpoint used across the site (matches the max-width
// used in ProjectSection.module.css) — keep any new mobile-only CSS
// media queries in sync with this value.
export const MOBILE_BREAKPOINT = 800

/**
 * useIsMobile
 *
 * Tracks whether the viewport is at or below the site's mobile breakpoint,
 * via matchMedia so it updates live on resize/rotation instead of only at
 * mount. Lets components branch on the same breakpoint CSS already uses
 * (touch gesture wiring, swapping button nav for a hamburger menu, etc.)
 * without duplicating a resize listener per component.
 */
export default function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const query = `(max-width: ${breakpoint}px)`
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    setIsMobile(mql.matches)

    const onChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return isMobile
}
