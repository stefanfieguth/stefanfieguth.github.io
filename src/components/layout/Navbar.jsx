import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import useIsMobile from '../../hooks/useIsMobile.js'
import { navMenu, WORDMARK } from '../../data/navLinks.js'
import styles from './Navbar.module.css'

const cx = (...classes) => classes.filter(Boolean).join(' ')
const navLinkClass = (base) => ({ isActive }) => cx(base, isActive && styles.active)

// Below the mobile breakpoint the dropdowns don't fit, so the whole menu
// becomes one flat hamburger list; dropdown links are prefixed with their
// dropdown's label so the list still reads as Experience vs. Projects.
const MOBILE_LINKS = navMenu.flatMap((item) =>
  item.links
    ? item.links.map((link) => ({ ...link, label: `${item.label} - ${link.label}` }))
    : [item]
)

function MenuLink({ item, className }) {
  if (item.href) {
    return (
      <a
        href={item.href}
        className={className}
        {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {item.label}
      </a>
    )
  }
  return (
    <NavLink to={item.to} end={item.to === '/'} className={navLinkClass(className)}>
      {item.label}
    </NavLink>
  )
}

/**
 * Navbar
 *
 * Desktop: the wordmark, then the items of navMenu (src/data/navLinks.js) —
 * plain links, dropdowns (opened by click, highlighted while the current
 * page is inside them) and the Resume button. Mobile: a hamburger menu
 * listing every destination flat.
 */
export default function Navbar() {
  // Label of the open dropdown, 'mobile' for the hamburger, or null.
  const [openMenu, setOpenMenu] = useState(null)
  const navRef = useRef(null)
  const location = useLocation()
  const isMobile = useIsMobile()

  const toggle = (id) => setOpenMenu((prev) => (prev === id ? null : id))

  // Close whenever the route changes or we cross the mobile breakpoint.
  useEffect(() => {
    setOpenMenu(null)
  }, [location.pathname, isMobile])

  // Close on a click outside any dropdown, or on Escape, while open.
  useEffect(() => {
    if (!openMenu) return

    function handlePointerDown(event) {
      const dropdown = event.target.closest?.(`.${styles.dropdown}`)
      if (!dropdown || !navRef.current?.contains(dropdown)) setOpenMenu(null)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpenMenu(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMenu])

  return (
    <header className={styles.header}>
      <nav className={styles.nav} ref={navRef}>
        <NavLink to="/" className={styles.wordmark}>
          {WORDMARK}
        </NavLink>

        {isMobile ? (
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.hamburger}
              aria-haspopup="true"
              aria-expanded={openMenu === 'mobile'}
              aria-label="Open menu"
              onClick={() => toggle('mobile')}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>

            {openMenu === 'mobile' && (
              <ul className={styles.submenu}>
                {MOBILE_LINKS.map((item) => (
                  <li key={item.label}>
                    <MenuLink item={item} className={styles.submenuLink} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <ul className={styles.links}>
            {navMenu.map((item) => {
              if (!item.links) {
                return (
                  <li key={item.label}>
                    <MenuLink
                      item={item}
                      className={cx(styles.link, item.href && styles.resume)}
                    />
                  </li>
                )
              }

              const isOpen = openMenu === item.label
              const isCurrent = location.pathname.startsWith(item.prefix)
              return (
                <li key={item.label} className={styles.dropdown}>
                  <button
                    type="button"
                    className={cx(styles.link, isCurrent && styles.active)}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => toggle(item.label)}
                  >
                    {item.label}
                    <span className={cx(styles.chevron, isOpen && styles.chevronOpen)} aria-hidden="true" />
                  </button>

                  {isOpen && (
                    <ul className={styles.submenu}>
                      {item.links.map((link) => (
                        <li key={link.to}>
                          <MenuLink item={link} className={styles.submenuLink} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </nav>
    </header>
  )
}
