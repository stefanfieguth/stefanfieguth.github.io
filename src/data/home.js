/**
 * home.js
 *
 * Everything shown on the Home page (/), top to bottom. Kept as data
 * (rather than inside the page's JSX) so scripts/prerender.mjs can also
 * write it into the static HTML that search engines and link previews read.
 *
 * HOW TO EDIT
 *   - Change text: edit the strings below. Inside '...' strings, write an
 *     apostrophe as \' (e.g. 'I\'m').
 *   - Add/remove list items (tags, skills, paragraphs, cards): add or delete
 *     entries in the [ ... ] lists; they appear in the order listed.
 *   - Change a photo: save it in public/assets/images/ and use
 *     `${IMG}/<file name>`.
 *
 * SECTIONS AND FIELDS
 *
 * intro — the title block at the top of the page
 *   eyebrow       Small uppercase line above the name.
 *   nameLines     The name, one entry per line.
 *   subtitle      Line under the name.
 *   tags          Pills under the subtitle.
 *   bio           Paragraph under the tags. Also the site's default
 *                 search/link-preview description (see pageMeta.js).
 *   heroImage     Background photo behind the title block.
 *   heroPosition  Optional. Which part of the photo stays in view when it's
 *                 cropped, as CSS object-position: 'center' (default),
 *                 'center 30%', 'top', 'bottom', ...
 *
 * model — the interactive 3D viewer beside the intro
 *   src      STL file to show. Save it in public/assets/models/ and write
 *            '/assets/models/<file>.stl'.
 *   hint     Small label over the viewer.
 *   caption  Line under the viewer.
 *
 * featured — the "Featured Projects" tiles, beside About Me
 *   title / accent  Heading; `accent` is shown in the accent colour.
 *   items     One tile per project, in order (2 per row on desktop). The
 *             whole tile is a link to the project's section on its project
 *             page, which scrolls straight down to it.
 *     id        Unique short name (only used internally).
 *     title     Shown over the photo.
 *     category  Small accent line above the title.
 *     blurb     Tooltip on hover (and search-engine text).
 *     image     Photo for the tile (cropped to 4:3).
 *     alt       Short description of the photo for screen readers.
 *     to        Page and section the tile opens: '/projects/<page>#<id>',
 *               where <id> is the write-up's `id` in src/data/projects/*.js.
 *
 * about — the "About Me" section (left of the featured tiles)
 *   title / accent  Heading; `accent` is shown in the accent colour.
 *   columns         Lists of paragraphs, shown one after another.
 *
 * explore — the "All projects" links under the featured tiles
 *   label   Text before the links.
 *   items   One link per project page: { id, title, to }.
 *
 * experience — the "Experience" cards. Each job in src/data/experience.js
 *   gets a card automatically (name, role · dates, logo); only the heading
 *   is set here.
 *   title / accent  Heading.
 *
 * skills — the "Key Skills" section
 *   title / accent  Heading.
 *   groups          One block per group: `title` is its label, `items`
 *                   are shown as small tags.
 */
import { PLACEHOLDER } from '../utils/mediaTiles.js'

const IMG = '/assets/images'

export const intro = {
  eyebrow: 'Engineering Portfolio',
  nameLines: ['Stefan', 'Fieguth'],
  subtitle: 'Systems Design Engineering · University of Waterloo',
  tags: ['Mechanical Design', '3D Printing', 'PCB & Electrical', 'Woodworking', 'CNC & Machining'],
  bio: 'I\'m a hands-on engineering student who turns ideas into reality, from flame-weeding tractor implements to glowing periodic tables and 500-part scale models. I bridge mechanical design, electronics, and fabrication to build things that work.',
  heroImage: `${IMG}/camp-map-night.jpg`,
  heroPosition: 'center',
}

export const model = {
  src: '/assets/models/model.stl',
  hint: 'Drag to rotate · Scroll to zoom',
  caption: 'Marvel\'s Stormbreaker Axe Head, Modelled as Laser-Cut Bent Sheet-Metal',
}

export const featured = {
  title: 'Featured',
  accent: 'Projects',
  items: [
    {
      id: 'flame-weeder',
      title: 'Flame-Weeding Tractor Implement',
      category: 'Mechanical',
      blurb: 'Werkr Tractors Co-op · 2025',
      image: `${IMG}/flame-weeder-action.jpg`,
      alt: 'Flame weeder in action',
      to: '/projects/mechanical#flame-weeder',
    },
    {
      id: 'periodic-table',
      title: 'Periodic Table of Elements',
      category: '3D Printing',
      blurb: '120 uniquely designed element boxes · Personal Project',
      image: `${IMG}/periodic-table-full.jpg`,
      alt: 'Periodic table wall art',
      to: '/projects/3d-printing#periodic-table',
    },
    {
      id: 'pcb',
      title: 'Electric Tractor Printed Circuit Board',
      category: 'Electrical',
      blurb: 'Werkr Tractors Co-op · 2026',
      image: `${IMG}/pcb-render.jpg`,
      alt: 'Electric tractor PCB',
      to: '/projects/electrical#pcb',
    },
    {
      id: 'helical-flame',
      title: 'Helical Flame Sculpture',
      category: 'Woodworking',
      blurb: 'Personal Project for Waterloo North Mennonite Church',
      image: `${IMG}/helical-flame-night.jpg`,
      alt: 'Helical flame sculpture alight',
      to: '/projects/woodworking#helical-flame',
    },
    {
      id: 'pyrotechnics',
      title: 'Pyrotechnics & Visual Effects',
      category: 'Other',
      blurb: 'Fire and light as a creative medium',
      image: `${IMG}/pyro-green-sword.jpg`,
      alt: 'Green fire sword',
      to: '/projects/other#Pyrotechnics',
    },
    {
      id: 'werkr-tractor',
      title: 'Werkr Tractor',
      category: '3D Printing',
      blurb: 'Werkr Tractor 3D Model',
      // Replace with the real photo, e.g. `${IMG}/werkr-tractor.jpg`.
      image: PLACEHOLDER.photo,
      alt: 'Werkr Tractor',
      to: '/projects/3d-printing#general-projects',
    },
  ],
}

export const about = {
  title: 'About',
  accent: 'Me',
  columns: [
    [
      'I\'m a third-year Systems Design Engineering student at the University of Waterloo, building a foundation in design-for-manufacturing, electronics, and electromechanical problem-solving. This portfolio highlights my experiences across mechanical systems, electronics, and prototyping.',
      'Through three co-op terms at Werkr Tractors, I led the design of a flame-weeding implement, designed my first PCB, rebuilt their website, designed a new implement installing crane, and redesigned the tractor\'s rollbar for flat-pack shipping. At Accelerated Systems Inc., I diagnosed electric motors, designed waterproof motor controllers, and converted golf carts to electric drive.',
      'Summers at Silver Lake Mennonite Camp keep me grounded, counselling kids, fixing buildings, and pursuing projects like a detailed 3D-printed scale model of the entire camp and an automatic campfire starting system.',
    ],
    [
      'My motivation comes from the intersection of functionality and craft. Whether it\'s a PCB that needs to be debuggable, a rollbar that must ship flat, or a periodic table that excites students about chemistry, I always start from real-world constraints and objectives, and work toward elegant solutions.',
      'I speak English and German fluently, with working proficiency in French. In my free time, I enjoy 3D printing, Ultimate Frisbee, Soccer, and Pyrotechnics.',
    ],
  ],
}

export const explore = {
  label: 'All projects',
  items: [
    { id: 'mechanical',  title: 'Mechanical',  to: '/projects/mechanical' },
    { id: '3d-printing', title: '3D Printing', to: '/projects/3d-printing' },
    { id: 'electrical',  title: 'Electrical',  to: '/projects/electrical' },
    { id: 'woodworking', title: 'Woodworking', to: '/projects/woodworking' },
    { id: 'other',       title: 'Other',       to: '/projects/other' },
  ],
}

export const experience = {
  title: 'Experience',
  accent: '',
}

export const skills = {
  title: 'Key',
  accent: 'Skills',
  groups: [
    { title: 'Mechanical',     items: ['MIG & TIG Welding', 'CNC Milling & Turning', 'Manual Machining', 'Laser Cutting', 'Sheet Metal Design'] },
    { title: 'CAD & Analysis', items: ['Onshape', 'SolidWorks', 'FEA', 'Design for Manufacturing', 'Blender'] },
    { title: 'Electrical',     items: ['PCB Design (EDA)', 'Circuit Design', 'Arduino', 'Wiring Harnesses', 'Soldering'] },
    { title: '3D Printing',    items: ['FDM (Bambu Lab X1C)', 'Design for 3D Printing', 'Multi-part Assemblies', 'Scale Modelling'] },
    { title: 'Woodworking',    items: ['Fine Woodworking', 'Wood Turning', 'CNC Routing', 'Epoxy Finishing'] },
    { title: 'Other',          items: ['Website Design', 'Marketing Video & Photo'] },
  ],
}
