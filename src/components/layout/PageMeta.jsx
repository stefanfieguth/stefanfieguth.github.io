import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageMeta } from '../../data/pageMeta.js'

/**
 * PageMeta
 *
 * Keeps the browser-tab title and meta description in sync with the
 * current route as the visitor navigates client-side. (The static HTML
 * written by scripts/prerender.mjs already has the right values for
 * whichever page was loaded first.) Renders nothing.
 */
export default function PageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description } = getPageMeta(pathname)
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [pathname])

  return null
}
