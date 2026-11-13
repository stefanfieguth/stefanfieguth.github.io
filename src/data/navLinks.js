/**
 * navLinks.js
 *
 * The navbar at the top of every page: the wordmark on the left, then
 * "Home", the "Experience" and "Projects" dropdowns, and "Resume".
 *
 * HOW TO EDIT
 *   - Experience dropdown: built automatically from src/data/experience.js
 *     (one link per job, using each job's `navLabel`). Edit jobs there.
 *   - Projects dropdown: edit `projectLinks` below. To add a project page
 *     you also need a page component and a route — see src/App.jsx.
 *   - Resume: replace the file public/assets/resume.pdf with the real
 *     resume (same file name), or point `resumeLink.href` at another file.
 *   - Wordmark: change WORDMARK (text) or LOGO (icon to its left; uses
 *     the favicon, so replacing favicon.png updates both).
 *
 * FIELDS
 *   WORDMARK    Text on the left of the navbar; links to the home page.
 *   LOGO        Icon shown to the left of WORDMARK.
 *
 *   Link entries (projectLinks, and each job's link):
 *     to      Page address, e.g. '/projects/mechanical'.
 *     label   Text shown in the dropdown.
 *
 *   resumeLink:
 *     label   Text of the navbar button.
 *     href    File it opens (in a new tab). Files in public/ are written
 *             without the 'public' part: public/assets/resume.pdf →
 *             '/assets/resume.pdf'.
 *
 *   navMenu   The top-level menu, in display order. Each item is one of:
 *     { label, to }                      a plain link
 *     { label, prefix, links }           a dropdown; it's highlighted
 *                                        whenever the current page address
 *                                        starts with `prefix`
 *     { label, href, external: true }    a file/external link (Resume)
 *     On phones the whole menu collapses into one hamburger list, where
 *     dropdown links are shown as "<dropdown label> - <link label>".
 */
import experience from './experience.js'

export const WORDMARK = 'Stefan Fieguth'
export const LOGO = '/assets/images/logo/favicon.png'

export const experienceLinks = experience.map((job) => ({
  to: `/experience/${job.id}`,
  label: job.navLabel,
}))

export const projectLinks = [
  { to: '/projects/mechanical',  label: 'Mechanical' },
  { to: '/projects/3d-printing', label: '3D Printing' },
  { to: '/projects/electrical',  label: 'Electrical' },
  { to: '/projects/woodworking', label: 'Woodworking' },
  { to: '/projects/other',       label: 'Other' },
]

export const resumeLink = { label: 'Resume', href: '/assets/resume.pdf', external: true }

export const navMenu = [
  { label: 'Home', to: '/' },
  { label: 'Experience', prefix: '/experience', links: experienceLinks },
  { label: 'Projects', prefix: '/projects', links: projectLinks },
  resumeLink,
]
