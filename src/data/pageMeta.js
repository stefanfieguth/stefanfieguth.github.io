/**
 * pageMeta.js
 *
 * The browser-tab title and the search/link-preview description for every
 * page. Read by PageMeta (which updates the tab title as you navigate) and
 * by scripts/prerender.mjs (which writes them into each page's static HTML
 * for search engines and link previews in LinkedIn, Slack, etc.).
 *
 * HOW TO EDIT
 *   You normally don't need to edit this file: titles and descriptions are
 *   built from each page's own data (the `header` of each project page and
 *   job, and `intro.bio` on the home page). Change those instead.
 *   Edit here to change the title format, the site name, the domain, or
 *   the link-preview image.
 *
 *   When you add a new page, add its path here too (prerender.mjs stops the
 *   build with an error if a page is missing).
 *
 * FIELDS
 *   SITE_URL   The site's address, without a trailing slash.
 *   SITE_NAME  Name used in tab titles ("Mechanical Engineering | <name>").
 *   OG_IMAGE   Image shown in link previews when the site is shared.
 *
 *   pages      One entry per page:
 *     path         The page address, e.g. '/projects/mechanical'.
 *     title        Browser-tab title.
 *     description  One or two sentences for search results / link previews.
 */
import { intro } from './home.js'
import experience from './experience.js'
import { header as mechanical } from './projects/mechanical.js'
import { header as printing } from './projects/printing.js'
import { header as electrical } from './projects/electrical.js'
import { header as woodworking } from './projects/woodworking.js'
import { header as other } from './projects/other.js'

export const SITE_URL = 'https://stefanfieguth.ca'
export const SITE_NAME = 'Stefan Fieguth'
export const OG_IMAGE = '/assets/images/flame-weeder-action.jpg'

const DEFAULT_DESCRIPTION = intro.bio

// "Mechanical Engineering", "Woodworking", ... from a page header.
const headerTitle = ({ title, accent }) => [title, accent].filter(Boolean).join(' ')

const fromHeader = (path, header) => ({
  path,
  title: `${headerTitle(header)} | ${SITE_NAME}`,
  description: header.intro,
})

export const pages = [
  {
    path: '/',
    title: `${SITE_NAME} | Engineering Portfolio`,
    description: DEFAULT_DESCRIPTION,
  },
  ...experience.map((job) => fromHeader(`/experience/${job.id}`, job.header)),
  fromHeader('/projects/mechanical', mechanical),
  fromHeader('/projects/3d-printing', printing),
  fromHeader('/projects/electrical', electrical),
  fromHeader('/projects/woodworking', woodworking),
  fromHeader('/projects/other', other),
]

export const notFoundMeta = {
  title: `Page Not Found | ${SITE_NAME}`,
  description: DEFAULT_DESCRIPTION,
}

// Section index addresses that redirect to their first page (see App.jsx).
export const sectionRedirects = {
  '/experience': `/experience/${experience[0].id}`,
  '/projects': '/projects/mechanical',
}

/** Meta for a pathname (trailing slashes ignored). */
export function getPageMeta(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const target = sectionRedirects[path] ?? path
  return pages.find((page) => page.path === target) ?? notFoundMeta
}
