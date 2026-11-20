/**
 * woodworking.js
 *
 * Everything shown on the Woodworking page (/projects/woodworking), top to bottom. The same
 * data also feeds the static HTML that search engines read
 * (scripts/prerender.mjs) and the page's tab title (pageMeta.js).
 *
 * HOW TO EDIT
 *   - Change text: edit the strings below. Inside '...' strings, write an
 *     apostrophe as \' (e.g. 'tractor\'s').
 *   - Add a project: copy a whole write-up (from `{ id:` to its closing
 *     `},`), paste it where it should appear, give it a new unique `id`,
 *     and edit it. Projects appear top to bottom in the order listed.
 *   - Remove a project: delete its whole entry. Reorder: move entries.
 *   - Change a photo: save it in public/assets/images/ and use
 *     `${IMG}/<file name>`.
 *
 * header — the title block at the top of the page
 *   eyebrow       Small uppercase line above the title.
 *   title         First part of the page title (white). May be ''.
 *   accent        Last part of the title, shown in the accent colour.
 *   intro         Paragraph under the title. Also used as the page's
 *                 search/link-preview description (see pageMeta.js).
 *   heroImage     Background photo behind the title block.
 *   heroPosition  Optional. Which part of the photo stays in view when it's
 *                 cropped, as CSS object-position: 'center' (default),
 *                 'center 30%' (a bit above centre), 'top', 'bottom', ...
 *   nonExtendedPercentage  Fraction (0–1) of the photo's width, from the right,
 *                          that is the original photo. Use it when the photo has
 *                          been extended on the left so the text has room: that
 *                          strip gets dimmed and blurred and crops off first on
 *                          narrow screens. 1 = not extended.
 *   textShadow          true = soft dark halo around the title text.
 *   darkenedBehindText  true = soft dark patch behind the title text.
 *
 * writeups — one section per project, photos left and text right
 *   id           Short unique name (lowercase-with-dashes). The section can
 *                be linked to directly as /projects/woodworking#<id>; changing an id
 *                breaks old links to that section.
 *   title        Project heading.
 *   subtitle     Small line under the title (context · employer · year).
 *   skills       Tags shown as pills under the subtitle.
 *   media        Media boxes, built with tile()/wide():
 *                  tile(row, src, alt, caption)  half-width box; two tiles
 *                                                with the same row sit side by side
 *                  wide(row, src, alt, caption)  full-width box
 *                Rows count from 0 at the top. `src` can be a photo, an
 *                .mp4 video, an .stl 3D model or an https:// embed (e.g. a
 *                YouTube embed link) — the type is worked out from it.
 *                `alt` describes it for screen readers; `caption` is
 *                shown centred over the bottom of the box. Full details in
 *                src/utils/mediaTiles.js.
 *   description  Body text. Each '\n' starts a new paragraph; a line
 *                starting with '- ' becomes a bullet; **text** is bold.
 *   gridWidth    Optional, 0–1: share of the row the photos take (default 0.55).
 *   pageLink     Optional. The `id` of a report in src/data/detailedReport.js
 *                with much more detail on this project. When set, a "View
 *                Detailed Project Report" button appears at the bottom right
 *                of the write-up box, linking to /reports/<pageLink>.
 *
 * generalProjects — the "General Woodworking Projects" cards at the bottom of the page
 *   id              Anchor for the section (link: <page>#<id>).
 *   title / accent  Section heading; `accent` is shown in the accent colour.
 *   items           One card per entry, in order:
 *     id     Unique short name (only used internally).
 *     title  Card heading.
 *     tags   Pills above the heading.
 *     blurb  Short description under the heading.
 *     image  Media across the top of the card (16:9): a photo, .mp4 video,
 *            .stl 3D model or https:// embed. Photos/videos open full size
 *            on click. Optional `type` overrides the guess from the file.
 *     alt    Short description of the photo for screen readers.
 */
import { tile, wide } from '../../utils/mediaTiles.js'

const IMG = '/assets/images'
const MODELS = '/assets/models'
const VIDEOS = '/assets/videos'

export const header = {
  eyebrow: 'Fine Woodworking · CNC Routing · Wood Turning · Epoxy Finishing',
  title: '',
  accent: 'Woodworking',
  intro: 'Fine woodworking and CNC routing across artistic and functional projects, often combined with 3D printing and electronics for multi-disciplinary builds.',
  heroImage: `${IMG}/helical-flame-night-far.jpg`,
  heroPosition: 'center',
  nonExtendedPercentage: 1,
  textShadow: true,
  darkenedBehindText: true,
}

export const writeups = [
  {
    id: 'helical-flame',
    pageLink: 'helical-flame',
    title: 'Helical Flame Sculpture',
    subtitle: 'A flaming helical candle sculpture, fitting for any gathering · Personal Project for Waterloo North Mennonite Church',
    skills: ['3D CAD', 'Woodworking', 'Joinery', 'Fire'],
    media: [
      tile(0, `${MODELS}/helical-flame.stl`, 'CAD Model', 'CAD Model', { fallback: `${IMG}/helical-flame-cad.jpg` }),
      tile(0, `${IMG}/helical-flame-unlit.jpg`, 'Underside', 'Finished Product'),
      tile(1, `${VIDEOS}/helical-flame.mp4`, 'On Tractor', 'Sculpture Alight', { fallback: `${IMG}/helical-flame-night.jpg`, youtube: '' }),
      tile(1, `${IMG}/helical-flame-night-far.jpg`, 'In Action', 'Nighttime Centrepiece'),
    ],
    description:
      'I was tasked with designing a sculpture that could bring in the essence of fire for a church. The helical structure, combined with 41 individual candles, gave this 3-foot sculpture an eye-catching effect.\n' +
      'Initially, it was lit in the daytime; however, I knew that at nighttime the candles would really shine, and they did not disappoint. 41 candles burning simultaneously give a lot of light, so one could easily use this for nighttime gatherings.\n' +
      'Finally, to really cap off the magnificence of the sculpture, I added a slowly rotating motor below to spin the entire thing. This allowed people to view all sides of it and see the cool illusion of the candles wandering up the helix.',
  },
  {
    id: 'folding-toolkit',
    title: 'Outdoors Folding Toolkit',
    subtitle: 'A woodworking design project to make maintenance jobs easier · Personal Project',
    skills: ['Woodworking', '3D Printing', 'Joinery', 'Finishing'],
    media: [
      tile(0, `${IMG}/box-expanded.jpg`, 'Expanded Box', 'Expanded Toolkit'),
      tile(0, `${IMG}/box-cad.jpg`, 'Box in CAD', 'Toolkit in CAD'),
    ],
    description:
      'This handcrafted wooden toolbox was designed and built to provide a compact, organized solution for everyday maintenance and repair tasks around the house and at camp. The box features a folding layout with two stacked boxes per side, allowing easy access to tools while keeping the overall size compact.\n' +
      'The links for the folding-out boxes were 3D printed to ensure accuracy, which allowed the boxes to fold out evenly. The center compartments were designed to perfectly fit certain tools, ensuring they were snug with minimal chance of falling out.',
  },
]

// Woodworking that was one part of a bigger multi-discipline build. Shown as
// short cards under "Woodworking in Larger Builds"; the full project lives on
// its main page (the "See the Full Project" button) and in its report.
export const largerBuilds = {
  id: 'larger-builds',
  title: 'Woodworking in',
  accent: 'Larger Builds',
  items: [
    {
      id: 'periodic-table-frame',
      pageLink: 'periodic-table',
      projectPage: '/projects/3d-printing#periodic-table',
      projectPageLabel: 'See the Full Project',
      gridWidth: 0.4,
      title: 'Periodic Table Wall Art — Frame',
      subtitle: 'The woodworking behind a 3D printing and electronics build · Personal Project',
      skills: ['Woodworking', 'CNC Routing', 'Joinery', 'Finishing'],
      media: [wide(0, `${IMG}/periodic-cnc.jpg`, 'CNC routed board', 'CNC Routed Board')],
      description:
        'Built the 4-foot frame and backing, with the title lettering and LED holes CNC routed into plywood to line up with each of the 120 3D-printed element boxes.\n' +
        'Careful joinery keeps it flat and square under the weight of all the printed parts.',
    },
    {
      id: 'camp-map-base',
      pageLink: 'camp-map',
      projectPage: '/projects/3d-printing#camp-map',
      projectPageLabel: 'See the Full Project',
      gridWidth: 0.4,
      title: 'Summer Camp Map — Base',
      subtitle: 'The woodworking behind a 500-part 3D-printed scale model · Personal Project for Silver Lake Mennonite Camp',
      skills: ['Woodworking', 'CNC Routing', 'Epoxy Finishing', 'Painting'],
      media: [wide(0, `${IMG}/camp-map-waterfront.jpg`, 'Waterfront epoxy lake', 'Waterfront Epoxy Lake')],
      description:
        'Hand-built the base board and frame, CNC routed the paths with a Scienci LongMill, and filled the cut-out lakes with coloured epoxy.\n' +
        'Sanded, primed and painted the terrain before the printed buildings went on.',
    },
  ],
}

export const generalProjects = {
  id: 'general-projects',
  title: 'General',
  accent: 'Woodworking Projects',
  items: [
    {
      id: 'maintenance-sign',
      title: 'Summer Camp Maintenance Sign',
      tags: ['CNC'],
      blurb: 'A heavily edited version of Silver Lake Mennonite Camp\'s logo for their Maintenance Shed.',
      image: `${IMG}/woodwork-slmc.jpg`,
      alt: 'Summer Camp Maintenance Sign',
    },
    {
      id: 'dining-hall-model',
      title: 'Dining Hall Model',
      tags: ['Handmade'],
      blurb: 'A 3-foot wooden scale model of Silver Lake Mennonite Camp\'s Dining Hall.',
      image: `${IMG}/woodwork-dhall.jpg`,
      alt: 'Dining Hall Model',
    },
    {
      id: 'pen-set',
      title: 'Pen Set',
      tags: ['Manual Lathe'],
      blurb: 'Set of exotic pens for important occasions.',
      image: `${IMG}/pen-set.jpg`,
      alt: 'Pen Set',
    },
  ],
}
