/**
 * experience.js
 *
 * One entry per job. Each job gets its own page at /experience/<id> and a
 * link in the navbar's "Experience" dropdown (in the order listed here).
 * The first job is also where a bare /experience link lands.
 *
 * ⚠ TEMPORARY CONTENT: the overviews, write-ups and images below are
 * placeholders. Replace them with the real text and photos.
 *
 * HOW TO EDIT
 *   - Edit text: change the strings below.
 *   - Add a job: copy a whole job entry (from `{ id:` to its closing `},`),
 *     give it a new unique `id`, and edit it. It appears in the dropdown
 *     and gets a page automatically.
 *   - Remove a job: delete its whole entry.
 *   - Add photos: save them in public/assets/images/ and replace the
 *     PLACEHOLDER.* values with '/assets/images/<file>' (see IMG below).
 *
 * JOB FIELDS
 *   id        Short unique name (lowercase, no spaces). The page address
 *             becomes /experience/<id>. Changing it breaks old links.
 *   navLabel  Text shown for this job in the navbar's Experience dropdown.
 *   logo      Optional. Company logo for the home page Experience card,
 *             e.g. '/assets/images/logo/werkr.png' (square-ish PNG/SVG,
 *             transparent background). Without it, the card shows initials.
 *
 *   header    Title block at the top of the job's page:
 *     eyebrow       Small uppercase line above the title (role · dates).
 *     title         First part of the page title (white).
 *     accent        Last part of the title, shown in the accent colour.
 *     intro         Paragraph under the title. Also used as the page's
 *                   search/link-preview description (see pageMeta.js).
 *     heroImage     Background photo behind the title block.
 *     heroPosition  Optional. Which part of the photo stays in view when
 *                   it's cropped, as CSS object-position: 'center' (default),
 *                   'center 30%' (a bit above centre), 'top', 'bottom', ...
 *
 *   writeups  Projects done at this job, each shown as a section with
 *             photos on the left and text on the right:
 *     id           Short unique name; the section can be linked to
 *                  directly as /experience/<job id>#<id>.
 *     title        Project heading.
 *     subtitle     Small line under the title (context · year).
 *     skills       Tags shown as pills under the subtitle.
 *     media        Media boxes, built with tile()/wide(). Each can be a
 *                  photo, .mp4 video, .stl 3D model or https:// embed
 *                  (e.g. a YouTube embed link) — see src/utils/mediaTiles.js.
 *     description  Body text. Each '\n' starts a new paragraph; a line
 *                  starting with '- ' becomes a bullet; **text** is bold.
 *     gridWidth    Optional, 0–1: share of the row the photos take
 *                  (default 0.55).
 *     pageLink     Optional. The `id` of a report in src/data/detailedReport.js
 *                  with much more detail on this project. When set, a "View
 *                  Detailed Project Report" button appears at the bottom
 *                  right of the write-up box, linking to /reports/<pageLink>.
 *
 *   related   Optional. Cards linking to related projects elsewhere on
 *             the site, shown under the write-ups as "Related Projects":
 *     id     Short unique name (only used internally).
 *     title  Card heading.
 *     blurb  Short line under the heading.
 *     to     Link target: a page path, optionally with #section, e.g.
 *            '/projects/mechanical#crane'.
 *     pageLink  Optional. The `id` of a report in src/data/detailedReport.js;
 *            adds a "View Detailed Project Report" button to the card.
 *            Leave it out for projects without a report.
 */
import { tile, wide, PLACEHOLDER } from '../utils/mediaTiles.js'

// Folder prefix for real photos, e.g. `${IMG}/werkr-shop.jpg` for the file
// public/assets/images/werkr-shop.jpg. Not used until real photos are added.
const IMG = '/assets/images'

const experience = [
  {
    id: 'electrans',
    navLabel: 'Electrans',
    logo: '',
    header: {
      eyebrow: 'Placeholder Role · Placeholder Dates',
      title: '',
      accent: 'Electrans',
      intro: 'Placeholder overview of the role at Electrans. Replace this text in src/data/experience.js.',
      heroImage: PLACEHOLDER.hero,
    },
    writeups: [
      {
        id: 'electrans-project-1',
        title: 'Placeholder Project One',
        subtitle: 'Placeholder subtitle · Electrans · Year',
        skills: ['Placeholder Skill', 'Placeholder Skill 2'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph describing the project. Replace this text in src/data/experience.js.\n' +
          'A second placeholder paragraph.',
      },
    ],
    related: [],
  },
  {
    id: 'werkr',
    navLabel: 'Werkr Tractors',
    logo: '',
    header: {
      eyebrow: 'Engineering Co-op · Three Terms',
      title: 'Werkr',
      accent: 'Tractors',
      intro: 'Placeholder overview of the co-op terms at Werkr Tractors. Replace this text in src/data/experience.js.',
      heroImage: PLACEHOLDER.hero,
    },
    writeups: [
      {
        id: 'werkr-project-1',
        title: 'Placeholder Project One',
        subtitle: 'Placeholder subtitle · Werkr Tractors · 2025',
        skills: ['Placeholder Skill', 'Placeholder Skill 2'],
        media: [
          wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph describing the project. Replace this text in src/data/experience.js.\n' +
          'A second placeholder paragraph.',
      },
    ],
    related: [
      {
        id: 'flame-weeder',
        title: 'Flame-Weeding Tractor Implement',
        blurb: 'Novel mechanical design for weed control on small-scale farms · Werkr Tractors Co-op · 2025',
        to: '/projects/mechanical#flame-weeder',
        pageLink: 'flame-weeder',
      },
      {
        id: 'crane',
        title: 'Electric Tractor Implement Crane',
        blurb: 'Prototyping and Design for Manufacturing · Werkr Tractors Co-op · 2026',
        to: '/projects/mechanical#crane',
        pageLink: 'crane',
      },
      {
        id: 'rollbar',
        title: 'Electric Tractor Rollbar',
        blurb: 'Safety structure, roof mount, and antenna housing · Werkr Tractors Co-op · 2026',
        to: '/projects/mechanical#rollbar',
        pageLink: 'rollbar',
      },
      {
        id: 'pcb',
        title: 'Electric Tractor Printed Circuit Board',
        blurb: 'First PCB design, success on first revision · Werkr Tractors Co-op · 2026',
        to: '/projects/electrical#pcb',
      },
    ],
  },
    {
    id: 'slmc',
    navLabel: 'Silver Lake Camp',
    logo: '',
    header: {
      eyebrow: 'Summer Camp Counsellor · 2022-2027',
      title: 'Silver Lake',
      accent: 'Mennonite Camp',
      intro: 'A yearly summer job for a couple of weeks to counsel and teach the new generation',
      heroImage: `${IMG}/slmc-campfire.jpg`,
    },
    writeups: [
      {
        id: 'slmc-project-1',
        title: 'Placeholder Project One',
        subtitle: 'Placeholder subtitle · Silver Lake Mennonite Camp · 2024',
        skills: ['Placeholder Skill', 'Placeholder Skill 2'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph describing the project. Replace this text in src/data/experience.js.\n' +
          'A second placeholder paragraph.',
      },
    ],
    related: [
      {
        id: 'camp-map',
        title: 'Summer Camp Map 3D Model',
        blurb: 'Personal Project for Silver Lake Mennonite Camp · 2024',
        to: '/projects/printing#camp-map',
        pageLink: 'camp-map',
      },
    ],
  },
  {
    id: 'asi',
    navLabel: 'Accelerated Systems',
    logo: '',
    header: {
      eyebrow: 'Mechanical Engineering Co-op · 2024',
      title: 'Accelerated',
      accent: 'Systems',
      intro: 'Placeholder overview of the role at Accelerated Systems Inc. Replace this text in src/data/experience.js.',
      heroImage: PLACEHOLDER.hero,
    },
    writeups: [
      {
        id: 'asi-project-1',
        title: 'Placeholder Project One',
        subtitle: 'Placeholder subtitle · Accelerated Systems Inc. · 2024',
        skills: ['Placeholder Skill', 'Placeholder Skill 2'],
        media: [
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
          tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
        ],
        description:
          'Placeholder paragraph describing the project. Replace this text in src/data/experience.js.\n' +
          'A second placeholder paragraph.',
      },
    ],
    related: [
      {
        id: 'motor-controllers',
        title: 'Waterproof Motor Controllers & Golf Cart Conversion',
        blurb: 'Mechanical Engineering Co-op · Accelerated Systems Inc. · 2024',
        to: '/projects/electrical#motor-controllers',
      },
    ],
  },
]

export default experience
