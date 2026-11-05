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
 * featured — the "Featured Project" section
 *   heading   Label above the project.
 *   cta       Button under the project text: `label` is its text, `to` is
 *             the page it opens.
 *   project   One write-up, same fields as in src/data/projects/*.js:
 *     id           Unique short name; the section can be linked as /#<id>.
 *     title        Project heading.
 *     subtitle     Small line under the title.
 *     skills       Pills under the subtitle.
 *     media        Media boxes, built with tile()/wide(). Each can be a
 *                  photo, .mp4 video, .stl 3D model or https:// embed —
 *                  see src/utils/mediaTiles.js.
 *     description  Body text. Each '\n' starts a new paragraph.
 *
 * about — the "About Me" section
 *   title / accent  Heading; `accent` is shown in the accent colour.
 *   columns         Two columns, each a list of paragraphs.
 *
 * skills — the "Key Skills" section
 *   title / accent  Heading.
 *   groups          One card per group: `title` is the card heading,
 *                   `items` are its bullet points.
 *
 * explore — the "Explore Projects" section
 *   title / accent  Heading.
 *   items           One card per entry:
 *     id     Unique short name (only used internally).
 *     title  Card heading.
 *     blurb  Line under the heading.
 *     to     Page the card links to, e.g. '/projects/mechanical'.
 */
import { tile } from '../utils/mediaTiles.js'

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
  heading: 'Featured Project',
  cta: { label: 'See all mechanical projects', to: '/projects/mechanical' },
  project: {
    id: 'featured-flame-weeder',
    title: 'Flame-Weeding Tractor Implement',
    subtitle: 'Novel mechanical design for weed control on small-scale farms · Werkr Tractors Co-op · 2025',
    skills: ['3D CAD', 'Laser Cutting', 'Machining', 'Arduino', 'Design for Manufacturing'],
    media: [
      tile(0, `${IMG}/flame-weeder-cad.jpg`, 'CAD Model', 'CAD Model'),
      tile(0, `${IMG}/flame-weeder-underside.jpg`, 'Underside', 'Underside View'),
      tile(1, `${IMG}/flame-weeder-tractor.jpg`, 'On Tractor', 'Attached to Tractor'),
      tile(1, `${IMG}/flame-weeder-action.jpg`, 'In Action', 'In Action'),
    ],
    description:
      'This is a project I designed entirely from scratch during my co-op at Werkr Tractors, a large flame-weeding implement that kills young weeds before planted seeds germinate. It was my most complete end-to-end engineering challenge: CAD design, manufacturing, pipeline engineering, and field testing, all in one.\n' +
      'The central design constraint was minimizing welding while maximizing bent sheet metal, reducing cost and simplifying fabrication. The implement uses a forklift propane tank feeding 6 individual burners, each with a spark plug and coil controlled by an Arduino. Stainless steel heat shields contain the flame, increasing efficiency and allowing faster travel speeds.\n' +
      'As a first prototype, I standardized the heat shield geometry with extra bolt holes, keeping all shields identical and eliminating laser-cutting error. Seeing it run in the field for the first time was highly rewarding.',
  },
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

export const skills = {
  title: 'Key',
  accent: 'Skills',
  groups: [
    { title: 'Mechanical',  items: ['MIG & TIG Welding', 'CNC Milling & Turning', 'Manual Milling & Turning', 'Laser Cutting', 'Sheet Metal Design'] },
    { title: 'CAD',         items: ['Onshape', 'SolidWorks + FEA', 'Blender (Artistic)', 'Design for Mfg.', 'Design for 3D Print'] },
    { title: '3D Printing', items: ['FDM (Bambu Lab X1C)', 'Scale Modelling', 'Functional Parts', 'Artistic Modelling', 'Multi-part Assemblies'] },
    { title: 'Electrical',  items: ['PCB Design (EDA)', 'Circuit Design', 'Arduino (IDE)', 'Wiring Harnesses', 'Soldering'] },
    { title: 'Woodworking', items: ['Fine Woodworking', 'Wood Turning', 'CNC Routing', 'Epoxy Finishing', 'Quick Prototyping'] },
    { title: 'Other',       items: ['Website Design (Wix)', 'Marketing Video/Photo', 'English & German (Fluent)', 'French (Working)', 'Standard First Aid CPR-C'] },
  ],
}

export const explore = {
  title: 'Explore',
  accent: 'Projects',
  items: [
    { id: 'mechanical',  title: 'Mechanical',  blurb: 'Flame weeders, cranes, rollbars, machined parts', to: '/projects/mechanical' },
    { id: '3d-printing', title: '3D Printing', blurb: 'Summer camp maps, scale models, functional prints, artistic prints', to: '/projects/3d-printing' },
    { id: 'electrical',  title: 'Electrical',  blurb: 'PCB design, Arduino LEDs, motor controllers', to: '/projects/electrical' },
    { id: 'woodworking', title: 'Woodworking', blurb: 'CNC routing, lathe turning, fine finishing', to: '/projects/woodworking' },
  ],
}
