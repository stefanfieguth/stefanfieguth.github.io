/**
 * prerender.mjs
 *
 * Runs after `vite build`. Writes one static HTML file per route into
 * dist/ (e.g. dist/projects/mechanical.html, which GitHub Pages serves at
 * /projects/mechanical), each with its own <title>, description and link preview
 * tags, plus a plain-HTML copy of the page's text inside #root.
 *
 * That copy is what search engines and link scrapers (which don't run
 * JavaScript) read. For everyone else, index.html hides it and React
 * replaces it on load. The text comes from the same src/data modules the
 * React pages render, so the two never drift apart.
 *
 * Also writes dist/404.html as a plain app shell, so any other path still
 * boots the app (which then shows the NotFound page).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href)

const { pages, notFoundMeta, SITE_URL, SITE_NAME, OG_IMAGE } = await load('src/data/pageMeta.js')
const { navMenu } = await load('src/data/navLinks.js')
const { default: contactLinks, contactHeading } = await load('src/data/contactLinks.js')
const { default: experience } = await load('src/data/experience.js')
const { default: detailedReport, reportPath } = await load('src/data/detailedReport.js')
const home = await load('src/data/home.js')
const mechanical = await load('src/data/projects/mechanical.js')
const printing = await load('src/data/projects/printing.js')
const electrical = await load('src/data/projects/electrical.js')
const woodworking = await load('src/data/projects/woodworking.js')
const other = await load('src/data/projects/other.js')

// ─── HTML helpers ───────────────────────────────────────────────────────────

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Same **bold** convention ProjectSection renders.
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

// Same paragraph / "- " bullet-list convention ProjectSection renders.
function description(text = '') {
  const out = []
  let list = null
  for (const line of text.split('\n').map((l) => l.trim()).filter(Boolean)) {
    if (line.startsWith('- ')) {
      list ??= []
      list.push(`<li>${inline(line.slice(2))}</li>`)
      continue
    }
    if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null }
    out.push(`<p>${inline(line)}</p>`)
  }
  if (list) out.push(`<ul>${list.join('')}</ul>`)
  return out.join('\n')
}

const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`
const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
const heading = (level, { title, accent }) =>
  `<h${level}>${esc([title, accent].filter(Boolean).join(' '))}</h${level}>`

// Dropdowns become nested lists; plain links and the Resume file link
// become ordinary links.
const nav = `<nav>${list(navMenu.map((item) => item.links
  ? `${esc(item.label)}${list(item.links.map((l) => link(l.to, l.label)))}`
  : link(item.to ?? item.href, item.label)))}</nav>`

const contact = `<footer><h2>${esc(contactHeading)}</h2>${list(contactLinks.map((c) =>
  c.href ? link(c.href, c.label) : esc(c.label)))}</footer>`

const projectSection = (p) => [
  `<section id="${esc(p.id)}"><h2>${esc(p.title)}</h2>`,
  p.subtitle ? `<p>${esc(p.subtitle)}</p>` : '',
  p.skills?.length ? `<p>${esc(p.skills.join(' · '))}</p>` : '',
  p.media?.length ? list(p.media.map((m) => esc(m.caption ?? m.alt))) : '',
  description(p.description),
  p.pageLink ? `<p>${link(reportPath(p.pageLink), 'View Detailed Project Report')}</p>` : '',
  '</section>',
].join('\n')

// Every write-up's pageLink must name a report in detailedReport.js.
const reportIds = new Set(detailedReport.map((r) => r.id))
const allWriteups = [
  ...experience.flatMap((job) => job.writeups),
  ...experience.flatMap((job) => job.related ?? []),
  ...detailedReport.flatMap((r) => r.related ?? []),
  ...detailedReport.flatMap((r) => r.writeups),
  ...[mechanical, printing, electrical, woodworking, other].flatMap((m) => m.writeups),
]
for (const w of allWriteups) {
  if (w.pageLink && !reportIds.has(w.pageLink)) {
    throw new Error(`prerender: write-up "${w.id}" has pageLink "${w.pageLink}", but no report with that id exists in src/data/detailedReport.js`)
  }
}

const relatedSection = (related) => related?.length
  ? `<section id="related-projects"><h2>Related Projects</h2>${list(related.map((r) => `${link(r.to, r.title)}: ${esc(r.blurb)}`))}</section>`
  : ''

const pageHeader = (h) => [
  `<p>${esc(h.eyebrow)}</p>`,
  heading(1, h),
  `<p>${esc(h.intro)}</p>`,
].join('\n')

const cardSection = (s) => [
  `<section id="${esc(s.id)}">${heading(2, s)}`,
  ...s.items.map((c) => `<h3>${esc(c.title)}</h3><p>${esc(c.blurb)}</p>`),
  '</section>',
].join('\n')

const gallerySection = (g) => [
  `<section id="${esc(g.id)}">${heading(2, g)}`,
  list(g.items.map((i) => esc(i.caption))),
  '</section>',
].join('\n')

const skillSection = (s) => [
  `<section${s.id ? ` id="${esc(s.id)}"` : ''}>${heading(2, s)}`,
  ...s.groups.map((g) => `<h3>${esc(g.title)}</h3>${list(g.items.map(esc))}`),
  '</section>',
].join('\n')

// ─── Page bodies ────────────────────────────────────────────────────────────

const bodies = {
  '/': [
    `<p>${esc(home.intro.eyebrow)}</p>`,
    `<h1>${esc(SITE_NAME)}</h1>`,
    `<p>${esc(home.intro.subtitle)}</p>`,
    `<p>${esc(home.intro.tags.join(' · '))}</p>`,
    `<p>${esc(home.intro.bio)}</p>`,
    `<p>${esc(home.model.caption)}</p>`,
    `<section>${heading(2, home.about)}`,
    ...home.about.columns.flat().map((p) => `<p>${esc(p)}</p>`),
    '</section>',
    `<section>${heading(2, home.featured)}`,
    list(home.featured.items.map((i) => `${link(i.to, i.title)}: ${esc([i.category, i.blurb].filter(Boolean).join(' · '))}`)),
    `<p>${esc(home.explore.label)}: ${home.explore.items.map((i) => link(i.to, i.title)).join(' · ')}</p>`,
    '</section>',
    `<section>${heading(2, home.experience)}`,
    list(experience.map((job) => `${link(`/experience/${job.id}`, [job.header.title, job.header.accent].filter(Boolean).join(' '))}: ${esc(job.header.eyebrow)}`)),
    '</section>',
    skillSection(home.skills),
  ].join('\n'),

  ...Object.fromEntries(experience.map((job) => [`/experience/${job.id}`, [
    pageHeader(job.header),
    ...job.writeups.map(projectSection),
    relatedSection(job.related),
  ].join('\n')])),

  ...Object.fromEntries(detailedReport.map((report) => [reportPath(report.id), [
    pageHeader(report.header),
    ...report.writeups.map(projectSection),
    relatedSection(report.related),
  ].join('\n')])),

  '/projects/mechanical': [
    pageHeader(mechanical.header),
    ...mechanical.writeups.map(projectSection),
    cardSection(mechanical.machinedParts),
  ].join('\n'),

  '/projects/3d-printing': [
    pageHeader(printing.header),
    ...printing.writeups.map(projectSection),
    gallerySection(printing.gallery),
  ].join('\n'),

  '/projects/electrical': [
    pageHeader(electrical.header),
    ...electrical.writeups.map(projectSection),
  ].join('\n'),

  '/projects/woodworking': [
    pageHeader(woodworking.header),
    ...woodworking.writeups.map(projectSection),
    cardSection(woodworking.generalProjects),
  ].join('\n'),

  '/projects/other': [
    pageHeader(other.header),
    ...other.writeups.map(projectSection),
    gallerySection(other.gallery),
  ].join('\n'),
}

// ─── Write files ────────────────────────────────────────────────────────────

const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

function render({ title, description: desc, url, body }) {
  const setMeta = (html, attr, key, value) => html.replace(
    new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`),
    `$1${esc(value)}$2`,
  )
  let html = shell.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = setMeta(html, 'name', 'description', desc)
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:description', desc)
  html = setMeta(html, 'property', 'og:image', SITE_URL + OG_IMAGE)
  if (url) {
    html = setMeta(html, 'property', 'og:url', url)
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  } else {
    html = html.replace(/\s*<link rel="canonical"[^>]*>/, '')
  }
  const content = body ? `<div class="prerender">\n${nav}\n<main>\n${body}\n</main>\n${contact}\n</div>` : ''
  return html.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
}

for (const page of pages) {
  const body = bodies[page.path]
  if (!body) throw new Error(`prerender: no body for ${page.path}`)
  const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`
  const out = path.join(dist, file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, render({ ...page, url: SITE_URL + (page.path === '/' ? '/' : page.path), body }))
  console.log(`prerendered ${page.path} -> dist/${file}`)
}

fs.writeFileSync(path.join(dist, '404.html'), render({ ...notFoundMeta }))
console.log('wrote dist/404.html (app shell)')
