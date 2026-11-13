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
// Folder prefix for 3D models (public/assets/models/).
const MODELS = '/assets/models'

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
  {
    id: 'flame-weeder',
    header: {
      eyebrow: 'Detailed Project Report · Werkr Tractors Co-op · 2025',
      title: 'Flame-Weeding',
      accent: 'Implement',
      intro: 'Placeholder overview of the full Flame-Weeding Tractor Implement report. Replace this text in src/data/detailedReport.js.',
      heroImage: `${IMG}/flame-weeder-action.jpg`,
    },
    writeups: [
      {
        id: 'flame-weeder-background',
        title: 'Placeholder: Background & Goals',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, `${IMG}/flame-weeder-action.jpg`, 'Flame weeder in action', 'In Action'),
        ],
        description:
          'Placeholder paragraph on the weed-control problem on small-scale farms and what the implement needed to achieve.\n' +
          '- Placeholder requirement\n' +
          '- Placeholder requirement\n' +
          'A closing placeholder paragraph.',
      },
      {
        id: 'flame-weeder-cad',
        title: 'Placeholder: CAD & Design for Manufacturing',
        subtitle: 'Placeholder subtitle',
        skills: ['3D CAD', 'Design for Manufacturing'],
        media: [
          tile(0, `${MODELS}/flame-weeder.stl`, 'Flame weeder 3D model', 'CAD Model', { fallback: `${IMG}/flame-weeder-cad.jpg` }),
          tile(0, `${IMG}/flame-weeder-underside.jpg`, 'Underside', 'Underside View'),
        ],
        description:
          'Placeholder paragraph about minimizing welding and maximizing bent sheet metal.\n' +
          'A second placeholder paragraph about the standardized heat shield geometry.',
      },
      {
        id: 'flame-weeder-propane',
        title: 'Placeholder: Propane System & Burners',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the forklift propane tank, plumbing and the six burners.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'flame-weeder-ignition',
        title: 'Placeholder: Arduino Ignition Control',
        subtitle: 'Placeholder subtitle',
        skills: ['Arduino'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the spark plugs, coils and the Arduino controlling continuous ignition.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'flame-weeder-fabrication',
        title: 'Placeholder: Fabrication & Assembly',
        subtitle: 'Placeholder subtitle',
        skills: ['Laser Cutting', 'Machining'],
        media: [
          tile(0, `${IMG}/flame-weeder-tractor.jpg`, 'On tractor', 'Attached to Tractor'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about laser cutting, bending, machining and mounting to the tractor.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'flame-weeder-testing',
        title: 'Placeholder: Field Testing & Results',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the first field run, travel speeds and how well it killed weeds.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'flame-weeder-lessons',
        title: 'Placeholder: Lessons Learned & Next Revision',
        media: [],
        description:
          'Placeholder paragraph reflecting on the project.\n' +
          '- Placeholder lesson one\n' +
          '- Placeholder lesson two',
      },
    ],
    related: [
      {
        id: 'flame-weeder-summary',
        title: 'Flame-Weeding Tractor Implement',
        blurb: 'The project write-up · Mechanical Projects',
        to: '/projects/mechanical#flame-weeder',
      },
      {
        id: 'flame-weeder-werkr',
        title: 'Werkr Tractors',
        blurb: 'Engineering Co-op · Experience',
        to: '/experience/werkr',
      },
    ],
  },
  {
    id: 'crane',
    header: {
      eyebrow: 'Detailed Project Report · Werkr Tractors Co-op · 2026',
      title: 'Implement',
      accent: 'Crane',
      intro: 'Placeholder overview of the full Electric Tractor Implement Crane report. Replace this text in src/data/detailedReport.js.',
      heroImage: `${IMG}/crane-installed.jpg`,
    },
    writeups: [
      {
        id: 'crane-background',
        title: 'Placeholder: Background & Goals',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, `${IMG}/crane-installed.jpg`, 'Installed crane', 'Zinc-Plated & Installed'),
        ],
        description:
          'Placeholder paragraph on why implement swaps were difficult and what a single-operator crane needed to do.\n' +
          '- Placeholder requirement (e.g. load rating)\n' +
          '- Placeholder requirement\n' +
          'A closing placeholder paragraph.',
      },
      {
        id: 'crane-concept',
        title: 'Placeholder: Concept & Inspiration',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about early concepts and the Tilmor-inspired design.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'crane-cad',
        title: 'Placeholder: CAD & Sheet Metal Design',
        subtitle: 'Placeholder subtitle',
        skills: ['3D CAD', 'Laser Cutting'],
        media: [
          tile(0, `${MODELS}/crane.stl`, 'Crane 3D model', 'CAD Design', { fallback: `${IMG}/crane-cad.jpg` }),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the bent laser-cut sheet metal design, the weight-saving cutout and the rope-and-crank system.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'crane-fea',
        title: 'Placeholder: FEA Validation',
        subtitle: 'Placeholder subtitle',
        skills: ['FEA'],
        media: [
          wide(0, `${IMG}/crane-fea.jpg`, 'FEA results', 'FEA Stress Analysis'),
        ],
        description:
          'Placeholder paragraph about the SolidWorks FEA setup, loads and results.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'crane-fabrication',
        title: 'Placeholder: Fabrication, Welding & Zinc Plating',
        subtitle: 'Placeholder subtitle',
        skills: ['MIG Welding'],
        media: [
          tile(0, `${IMG}/crane-finished.jpg`, 'Finished crane', 'Finished Product'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about welding, finishing and zinc plating.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'crane-testing',
        title: 'Placeholder: Testing & Results',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about load testing and how much faster implement swaps became.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'crane-lessons',
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
        id: 'crane-summary',
        title: 'Electric Tractor Implement Crane',
        blurb: 'The project write-up · Mechanical Projects',
        to: '/projects/mechanical#crane',
      },
      {
        id: 'crane-werkr',
        title: 'Werkr Tractors',
        blurb: 'Engineering Co-op · Experience',
        to: '/experience/werkr',
      },
    ],
  },
  {
    id: 'rollbar',
    header: {
      eyebrow: 'Detailed Project Report · Werkr Tractors Co-op · 2026',
      title: 'Electric Tractor',
      accent: 'Rollbar',
      intro: 'Placeholder overview of the full Electric Tractor Rollbar report. Replace this text in src/data/detailedReport.js.',
      heroImage: `${IMG}/rollbar-context.jpg`,
    },
    writeups: [
      {
        id: 'rollbar-background',
        title: 'Placeholder: Background & Requirements',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, `${IMG}/rollbar-context.jpg`, 'Rollbar on tractor', 'In Context on Tractor'),
        ],
        description:
          'Placeholder paragraph on what the rollbar must do: protect the driver, support the roof and mount antennas.\n' +
          '- Placeholder requirement\n' +
          '- Placeholder requirement',
      },
      {
        id: 'rollbar-redesign',
        title: 'Placeholder: Redesign for Flat-Pack Shipping',
        subtitle: 'Placeholder subtitle',
        skills: ['3D CAD', 'Laser Cutting'],
        media: [
          tile(0, `${MODELS}/rollbar.stl`, 'Rollbar 3D model', 'Rollbar CAD', { fallback: `${IMG}/rollbar-cad.jpg` }),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph comparing the original welded tube design with the laser-cut bent sheet metal redesign.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'rollbar-assembly',
        title: 'Placeholder: Bolted Assembly',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about keeping the three main tubes and nut-and-bolt assembly of the rest.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'rollbar-antenna',
        title: 'Placeholder: Rotating Antenna & Router Housing',
        subtitle: 'Placeholder subtitle',
        skills: ['3D Printing'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the 3D-printed housing and the ball-and-spring mechanism that lets it rotate clear of low overhangs.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'rollbar-results',
        title: 'Placeholder: Shipping, Installation & Results',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about packing, shipping and installing the rollbar.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'rollbar-lessons',
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
        id: 'rollbar-summary',
        title: 'Electric Tractor Rollbar',
        blurb: 'The project write-up · Mechanical Projects',
        to: '/projects/mechanical#rollbar',
      },
      {
        id: 'rollbar-werkr',
        title: 'Werkr Tractors',
        blurb: 'Engineering Co-op · Experience',
        to: '/experience/werkr',
      },
    ],
  },
  {
    id: 'periodic-table',
    header: {
      eyebrow: 'Detailed Project Report · Personal Project',
      title: 'Periodic Table of',
      accent: 'Elements',
      intro: 'Placeholder overview of the full Periodic Table of Elements report. Replace this text in src/data/detailedReport.js.',
      heroImage: `${IMG}/periodic-table-full.jpg`,
    },
    writeups: [
      {
        id: 'periodic-table-background',
        title: 'Placeholder: Background & Goals',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, `${IMG}/periodic-table-full.jpg`, 'Full periodic table', 'Full Periodic Table'),
        ],
        description:
          'Placeholder paragraph on why the table was built: an art piece and a learning tool for high school classes.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'periodic-table-boxes',
        title: 'Placeholder: Designing 120 Element Boxes',
        subtitle: 'Placeholder subtitle',
        skills: ['Onshape CAD', 'Blender'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about modelling each box and designing every element symbol from scratch.\n' +
          '- Placeholder bullet point\n' +
          '- Another placeholder bullet point',
      },
      {
        id: 'periodic-table-printing',
        title: 'Placeholder: Printing & Light Diffusion',
        subtitle: 'Placeholder subtitle',
        skills: ['FDM Printing'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about print settings and the diffusing layer halfway through each box.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'periodic-table-frame',
        title: 'Placeholder: Wooden Frame & CNC Backing',
        subtitle: 'Placeholder subtitle',
        skills: ['Woodworking', 'CNC Routing'],
        media: [
          tile(0, `${IMG}/periodic-cnc.jpg`, 'CNC routed board', 'CNC Routed Board'),
          tile(0, `${IMG}/periodic-table-small.jpg`, 'Finished wall art', 'Finished Wall Art'),
        ],
        description:
          'Placeholder paragraph about the 4-foot frame, joinery and routing the title and LED holes.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'periodic-table-electronics',
        title: 'Placeholder: LEDs & Arduino Control',
        subtitle: 'Placeholder subtitle',
        skills: ['Arduino', 'Wiring', 'Soldering'],
        media: [
          tile(0, `${IMG}/periodic-groups.jpg`, 'Elements by group', 'Elements by Groups'),
          tile(0, `${IMG}/periodic-density.jpg`, 'Elements by density', 'Elements by Density'),
        ],
        description:
          'Placeholder paragraph about the 120 addressable LEDs, wiring and the 3D-printed controller box.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'periodic-table-modes',
        title: 'Placeholder: Display Modes & Animations',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          tile(0, `${IMG}/periodic-animation.jpg`, 'Scrolling animation', '"Boil" Scrolling Animation'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the colour-coded property modes and scrolling text animations.\n' +
          '- Placeholder mode\n' +
          '- Placeholder mode',
      },
      {
        id: 'periodic-table-classrooms',
        title: 'Placeholder: In the Classroom',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about showing the table at schools and how students responded.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'periodic-table-lessons',
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
        id: 'periodic-table-printing-summary',
        title: 'Periodic Table of Elements',
        blurb: 'The 3D printing write-up · 3D Printing Projects',
        to: '/projects/3d-printing#periodic-table',
      },
      {
        id: 'periodic-table-leds-summary',
        title: 'Periodic Table, Arduino LED Control System',
        blurb: 'The electronics write-up · Electrical Projects',
        to: '/projects/electrical#periodic-table-leds',
      },
      {
        id: 'periodic-table-frame-summary',
        title: 'Periodic Table Wall Art — Woodworking',
        blurb: 'The frame write-up · Woodworking Projects',
        to: '/projects/woodworking#periodic-table-frame',
      },
    ],
  },
  {
    id: 'beam-competition',
    header: {
      eyebrow: 'Detailed Project Report · University Class Competition',
      title: 'Winning Beam',
      accent: 'Design Competition',
      intro: 'Placeholder overview of the full Beam Optimization Design Competition report. Replace this text in src/data/detailedReport.js.',
      heroImage: `${IMG}/beam-failures.jpg`,
    },
    writeups: [
      {
        id: 'beam-brief',
        title: 'Placeholder: Competition Brief & Constraints',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph on the MODs class competition, scoring and size constraints.\n' +
          '- Placeholder constraint\n' +
          '- Placeholder constraint',
      },
      {
        id: 'beam-iterations',
        title: 'Placeholder: Design Iterations',
        subtitle: 'Placeholder subtitle',
        skills: ['SolidWorks CAD'],
        media: [
          wide(0, `${IMG}/beam-failures.jpg`, 'Beam designs and failures', 'Beam Designs & Failure Modes'),
        ],
        description:
          'Placeholder paragraph walking through the 9 overarching designs and how each one failed.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'beam-fea',
        title: 'Placeholder: FEA',
        subtitle: 'Placeholder subtitle',
        skills: ['FEA'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the FEA setup and what it predicted.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'beam-rig',
        title: 'Placeholder: Building Our Own Test Rig',
        subtitle: 'Placeholder subtitle',
        skills: ['Welding'],
        media: [
          tile(0, `${IMG}/beam-test-rig.jpg`, 'Test rig', 'Self-Made Testing Rig'),
          tile(0, `${IMG}/beam-test-action.jpg`, 'Rig calibration', 'Beam Testing Calibration'),
        ],
        description:
          'Placeholder paragraph about designing and welding the rig and estimating loads with force meters on wrenches.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'beam-material',
        title: 'Placeholder: Material Selection & Printing',
        subtitle: 'Placeholder subtitle',
        skills: ['FDM Printing', 'Engineering Filaments'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about choosing PPA-CF and the print settings used.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'beam-final',
        title: 'Placeholder: Final Design & Official Test',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          tile(0, `${IMG}/beam-final.jpg`, 'Final beam', 'Final Beam Design'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the final geometry, matching the angled supports, and the winning 71,000x result.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'beam-lessons',
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
        id: 'beam-mechanical-summary',
        title: 'Winning Beam Optimization Design Competition',
        blurb: 'The project write-up · Mechanical Projects',
        to: '/projects/mechanical#beam-competition',
      },
      {
        id: 'beam-printing-summary',
        title: 'Winning Beam Optimization Design Competition',
        blurb: 'The project write-up · 3D Printing Projects',
        to: '/projects/3d-printing#beam-competition',
      },
    ],
  },
  {
    id: 'helical-flame',
    header: {
      eyebrow: 'Detailed Project Report · Personal Project for Waterloo North Mennonite Church',
      title: 'Helical Flame',
      accent: 'Sculpture',
      intro: 'Placeholder overview of the full Helical Flame Sculpture report. Replace this text in src/data/detailedReport.js.',
      heroImage: `${IMG}/helical-flame-night-far.jpg`,
    },
    writeups: [
      {
        id: 'helical-flame-brief',
        title: 'Placeholder: The Brief',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          wide(0, `${IMG}/helical-flame-night-far.jpg`, 'Sculpture at night', 'Nighttime Centrepiece'),
        ],
        description:
          'Placeholder paragraph on the request to bring the essence of fire into the church.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'helical-flame-cad',
        title: 'Placeholder: Designing the Helix',
        subtitle: 'Placeholder subtitle',
        skills: ['3D CAD'],
        media: [
          tile(0, `${MODELS}/helical-flame.stl`, 'Helical flame 3D model', 'CAD Model', { fallback: `${IMG}/helical-flame-cad.jpg` }),
          tile(0, `${IMG}/helical-flame-unlit.jpg`, 'Finished sculpture', 'Finished Product'),
        ],
        description:
          'Placeholder paragraph about the helix geometry and placing the 41 candles.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'helical-flame-build',
        title: 'Placeholder: Woodworking & Joinery',
        subtitle: 'Placeholder subtitle',
        skills: ['Woodworking', 'Joinery'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about cutting, joining and finishing the wooden structure.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'helical-flame-motor',
        title: 'Placeholder: Rotating Base',
        subtitle: 'Placeholder subtitle',
        skills: [],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the slowly rotating motor and the illusion of candles wandering up the helix.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'helical-flame-lit',
        title: 'Placeholder: Lighting It Up',
        subtitle: 'Placeholder subtitle',
        skills: ['Fire'],
        media: [
          tile(0, `${IMG}/helical-flame-night.jpg`, 'Sculpture alight', 'Sculpture Alight'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph about the first daytime and nighttime lightings and fire safety.\n' +
          'A second placeholder paragraph.',
      },
      {
        id: 'helical-flame-lessons',
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
        id: 'helical-flame-summary',
        title: 'Helical Flame Sculpture',
        blurb: 'The project write-up · Woodworking Projects',
        to: '/projects/woodworking#helical-flame',
      },
    ],
  },
]

export default detailedReport
