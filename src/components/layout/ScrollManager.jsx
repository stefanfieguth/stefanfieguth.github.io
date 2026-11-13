import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Pages are lazy-loaded, so on a fresh visit to e.g. /mechanical#crane the
// section isn't in the DOM until that page's chunk has arrived — and once
// it is, the media grids above it still grow from zero height as they
// measure themselves, pushing the target down. So: wait up to
// HASH_FIND_MS for the target to appear, then keep re-pinning to it for
// HASH_SETTLE_MS while the layout settles.
const HASH_FIND_MS = 10000
const HASH_SETTLE_MS = 2000

// Any of these means the visitor has started scrolling themselves; stop
// re-pinning so we never fight them.
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'mousedown']

/**
 * ScrollManager
 *
 * On every client-side navigation: scroll to the element named by the URL
 * hash (each ProjectSection is anchored by its id), or to the top of the
 * page when there is no hash. Renders nothing.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // 'instant' overrides index.css's `scroll-behavior: smooth`, which
    // would otherwise animate every jump.
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    let timer = null
    let found = false

    const stop = () => {
      ro.disconnect()
      clearTimeout(timer)
      USER_SCROLL_EVENTS.forEach((e) => window.removeEventListener(e, stop))
    }

    const pin = () => {
      const target = document.getElementById(id)
      if (!target) return
      target.scrollIntoView({ behavior: 'instant' })
      if (!found) {
        // Target just appeared: from here, only re-pin until layout settles.
        found = true
        clearTimeout(timer)
        timer = setTimeout(stop, HASH_SETTLE_MS)
      }
    }

    // The page arriving and every grid growing all change the body's size,
    // so one observer covers both finding the target and re-pinning to it.
    const ro = new ResizeObserver(pin)
    ro.observe(document.body)
    timer = setTimeout(stop, HASH_FIND_MS)
    USER_SCROLL_EVENTS.forEach((e) => window.addEventListener(e, stop, { passive: true }))
    pin()

    return stop
  }, [pathname, hash])

  return null
}
