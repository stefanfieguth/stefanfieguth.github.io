/**
 * contactLinks.js
 *
 * Contact details shown in the footer at the bottom of every page (and in
 * the static HTML that search engines read, see scripts/prerender.mjs).
 *
 * HOW TO EDIT
 *   - Change a phone number, email, etc.: edit its `label` (the text shown)
 *     AND its `href` (where clicking it goes).
 *   - Add a contact item: copy one entry and edit it. Items appear in the
 *     order listed here.
 *   - Remove one: delete its whole { ... } entry.
 *
 * FIELDS
 *   contactHeading  Heading shown on the left of the footer.
 *
 *   label     Text shown in the footer.
 *   href      Optional. Where clicking goes:
 *               'tel:5195551234'           opens the phone dialer (digits only)
 *               'mailto:name@example.com'  opens an email
 *               'https://...'              a web page
 *             Leave it out for plain, unclickable text (like the location).
 *   external  Optional. true opens the link in a new browser tab.
 *   icon      Small icon shown before the label. Icons live in
 *             public/assets/images/icons/ and are written
 *             '/assets/images/icons/<file>'. White SVG icons fit the dark theme.
 */
export const contactHeading = 'Contact'

const contactLinks = [
  {
    label: '(519) 574-8960',
    href: 'tel:5195748960',
    icon: '/assets/images/icons/icon-phone.svg',
  },
  {
    label: 'stefan.fieguth@gmail.com',
    href: 'mailto:stefan.fieguth@gmail.com',
    icon: '/assets/images/icons/icon-gmail.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/stefan-fieguth-38504b290/',
    external: true,
    icon: '/assets/images/icons/icon-linkedin.svg',
  },
  {
    label: 'Waterloo, Ontario, Canada',
    icon: '/assets/images/icons/icon-location.svg',
  },
]

export default contactLinks
