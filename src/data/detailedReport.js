/**
 * detailedReport.js
 *
 * One entry per detailed project report: a full page that goes into much
 * more depth than a project's write-up box. Each report gets its own page
 * at /reports/<id>. Reports aren't in the navbar; they're reached from the
 * "View Detailed Project Report" button on a write-up.
 *
 * ⚠ TEMPORARY CONTENT: the text and images below are placeholders.
 * Replace them with the real report text and photos.
 *
 * HOW TO EDIT
 *   - Edit text: change the strings below. Inside '...' strings, write an
 *     apostrophe as \' (e.g. 'camp\'s').
 *   - Add a report: copy a whole report entry (from `{ id:` to its closing
 *     `},`), give it a new unique `id`, and edit it. It gets a page
 *     automatically.
 *   - Link a write-up to its report: in the write-up (in any data file,
 *     e.g. src/data/projects/printing.js or src/data/experience.js), add
 *       pageLink: '<report id>',
 *     That adds a "View Detailed Project Report" button to the bottom right
 *     of the write-up box. Several write-ups can link to the same report.
 *     The build stops with an error if a pageLink doesn't match any report.
 *   - Remove a report: delete its whole entry, and remove every
 *     `pageLink` that points to it.
 *   - Add photos: save them in public/assets/images/ and replace the
 *     PLACEHOLDER.* values with `${IMG}/<file name>` (see IMG below).
 *
 * REPORT FIELDS
 *   id        Short unique name (lowercase-with-dashes). The page address
 *             becomes /reports/<id>, and write-ups link to it with
 *             `pageLink: '<id>'`. Changing it breaks old links.
 *
 *   header    Title block at the top of the report's page:
 *     eyebrow       Small uppercase line above the title.
 *     title         First part of the page title (white). May be ''.
 *     accent        Last part of the title, shown in the accent colour.
 *     intro         Paragraph under the title. Also used as the page's
 *                   search/link-preview description (see pageMeta.js).
 *     heroImage     Background photo behind the title block.
 *     heroPosition  Optional. Which part of the photo stays in view when
 *                   it's cropped, as CSS object-position: 'center' (default),
 *                   'center 30%' (a bit above centre), 'top', 'bottom', ...
 *
 *   writeups  The report's sections, top to bottom, each shown as a box
 *             with photos on the left and text on the right:
 *     id           Short unique name; the section can be linked to
 *                  directly as /reports/<report id>#<id>.
 *     title        Section heading.
 *     subtitle     Optional small line under the title.
 *     skills       Optional tags shown as pills under the subtitle.
 *     media        Media boxes, built with tile()/wide(). Each can be a
 *                  photo, .mp4 video, .stl 3D model or https:// embed
 *                  (e.g. a YouTube embed link) — see src/utils/mediaTiles.js.
 *                  Use [] for a text-only section.
 *     description  Body text. Each '\n' starts a new paragraph; a line
 *                  starting with '- ' becomes a bullet; **text** is bold.
 *     gridWidth    Optional, 0–1: share of the row the photos take
 *                  (default 0.55).
 *     layout       Optional. 'stacked' puts the media full width above
 *                  the text instead of beside it.
 *
 *   related   Optional. Cards linking to related pages elsewhere on the
 *             site, shown under the sections as "Related Projects":
 *     id     Short unique name (only used internally).
 *     title  Card heading.
 *     blurb  Short line under the heading.
 *     to     Link target: a page path, optionally with #section, e.g.
 *            '/projects/3d-printing#camp-map'.
 */
import { tile, wide, PLACEHOLDER } from '../utils/mediaTiles.js'

// Folder prefix for real photos, e.g. `${IMG}/camp-map-overview.jpg` for the
// file public/assets/images/camp-map-overview.jpg.
const IMG = '/assets/images'

/** Page address of a report, from its id. */
export const reportPath = (id) => `/reports/${id}`

const detailedReport = [
  {
    id: 'camp-map',
    header: {
      eyebrow: 'Detailed Project Report · Personal Project',
      title: 'Summer Camp',
      accent: 'Map',
      intro: 'Placeholder overview of the full Summer Camp Map report. Replace this text in src/data/detailedReport.js.',
      heroImage: `${IMG}/camp-map-overview.jpg`,
    },
    writeups: [
      {
        id: 'camp-map-background',
        title: 'Placeholder: Background & Goals',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph explaining why the project started and what it set out to do. Replace this text in src/data/detailedReport.js.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'camp-map-modelling',
        title: 'Placeholder: CAD Modelling',
        subtitle: 'Placeholder subtitle',
        skills: ['Onshape CAD'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about modelling the buildings to scale.\n' +
          '- Placeholder bullet point\n' +
          '- Another placeholder bullet point\n' +
          'A closing placeholder paragraph.',
      },
      {
        id: 'camp-map-printing',
        title: 'Placeholder: Printing ~500 Parts',
        subtitle: 'Placeholder subtitle',
        skills: ['FDM Printing'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          '**Placeholder lead-in:** placeholder paragraph about print settings, materials and organising the parts.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'camp-map-base-build',
        title: 'Placeholder: Base, CNC & Epoxy',
        subtitle: 'Placeholder subtitle',
        skills: ['CNC Routing', 'Woodworking'],
        media: [
          wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about building the base board, routing the paths and pouring the epoxy lake.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'camp-map-lighting',
        title: 'Placeholder: Lighting & Wiring',
        subtitle: 'Placeholder subtitle',
        skills: ['Soldering'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the LEDs, wiring and campfire lights.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'camp-map-lessons',
        title: 'Placeholder: Lessons Learned',
        media: [],
        description:
          'Placeholder paragraph reflecting on the project.\n' +
          '- Placeholder lesson one\n' +
          '- Placeholder lesson two',
      },
    ],
    related: [
      {
        id: 'camp-map-printing-summary',
        title: 'Summer Camp Map / 3D Scale Model',
        blurb: 'The 3D printing write-up · 3D Printing Projects',
        to: '/projects/3d-printing#camp-map',
      },
      {
        id: 'camp-map-base-summary',
        title: 'Summer Camp Map — Woodworking & CNC Base',
        blurb: 'The base board write-up · Woodworking Projects',
        to: '/projects/woodworking#camp-map-base',
      },
    ],
  },
]

export default detailedReport
