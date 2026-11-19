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
 *     nonExtendedPercentage  Fraction (0–1) of the photo's width, from the right,
 *                            that is the original photo. Use it when the photo has
 *                            been extended on the left so the text has room: that
 *                            strip gets dimmed and blurred and crops off first on
 *                            narrow screens. 1 = not extended.
 *     textShadow          true = soft dark halo around the title text.
 *     darkenedBehindText  true = soft dark patch behind the title text.
 *
 *   overview  The "Role Overview" box between the title block and the
 *             projects:
 *     role      Official role / job title.
 *     location  Where the job was, e.g. 'Waterloo, ON'.
 *     website   Company website (full address, starting with https://).
 *               Opens in a new tab; shown without the https://www. part.
 *     skills    Key skills used in this job, shown as the same pill tags
 *               as on the project pages.
 *     summary   Short paragraph about the work. Each '\n' starts a new
 *               paragraph.
 *     Any field can be left out and its line is simply not shown.
 *
 *   responsibilities  Optional. Bullet points shown under "Responsibilities
 *             & Impact", between the overview and the projects. This is the
 *             place for work that isn't a stand-alone project (day-to-day
 *             duties, shop work, testing, documentation...) and for results,
 *             ideally with numbers. **text** is bold. Leave the list empty
 *             (or remove it) to hide the section.
 *
 *   gallery   Optional. Captioned photo thumbnails at the bottom of the
 *             page (click to enlarge):
 *     id              Anchor for the section (link: /experience/<id>#<id>).
 *     title / accent  Section heading; `accent` is in the accent colour.
 *     large           Optional. true = big photos in justified rows, each
 *                     at its real shape (no cropping), instead of small
 *                     square-ish thumbnails. Any mix of portrait and
 *                     landscape photos works.
 *     items           One photo per entry, in order:
 *       src      Photo, .mp4 video, .stl model or https:// embed.
 *       caption  Text under the thumbnail.
 *       alt      Short description for screen readers.
 *
 *   writeups  Projects done at this job, shown under "Key Projects", each
 *             as a section with photos on the left and text on the right.
 *             A project that already lives on a project page can be pulled
 *             in with fromProjectPage() (see below) instead of being
 *             written out again. Keep these short (one photo, two or three
 *             sentences on your role and the result): the full write-up
 *             stays on the project page and in its report, which the
 *             buttons link to. Otherwise write a project out with these
 *             fields:
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
 *     projectPage  Optional. A page address (optionally with #section) for
 *                  a "See More Projects Like This" button next to the
 *                  report button, e.g. '/projects/mechanical#crane'.
 *                  fromProjectPage() fills this in automatically.
 */
import { tile, wide, PLACEHOLDER } from '../utils/mediaTiles.js'
import { writeups as mechanical } from './projects/mechanical.js'
import { writeups as electrical } from './projects/electrical.js'
import { writeups as printing } from './projects/printing.js'

/**
 * Reuses a project write-up from one of the project pages, so its photos
 * and text only live in one place. Adds a "See More Projects Like This"
 * button linking back to that project on its page.
 *   page       The project page's address, e.g. '/projects/mechanical'.
 *   writeups   That page's write-ups (imported above).
 *   id         The project's `id` on that page.
 *   overrides  Fields to change for the experience page only, usually a
 *              shorter description, one photo and a subtitle without the
 *              company name (it's already the page title).
 */
function fromProjectPage(page, writeups, id, overrides = {}) {
  const project = writeups.find((w) => w.id === id)
  if (!project) throw new Error(`experience.js: no project "${id}" on ${page}`)
  return { ...project, projectPage: `${page}#${id}`, ...overrides }
}

// Experience pages show each project as a short card: one photo in a
// narrower column, so the text gets more room.
const COMPACT = { gridWidth: 0.4 }

// Folder prefix for real photos, e.g. `${IMG}/werkr-shop.jpg` for the file
// public/assets/images/werkr-shop.jpg. Not used until real photos are added.
const IMG = '/assets/images'

const experience = [
  {
    id: 'electrans',
    navLabel: 'Electrans',
    logo: `${IMG}/logo/electrans-logo.png`,
    header: {
      eyebrow: 'Mechatronics Engineering Co-op · 2026',
      title: '',
      accent: 'Electrans',
      intro: 'Electrans Technologies makes an autonomous coupling system between semi-trailers and the truck, saving operators time and allowing fleets to become autonomous.',
      heroImage: `${IMG}/electrans-hero.jpg`,
      nonExtendedPercentage: 1,
      textShadow: true,
      darkenedBehindText: false,
    },
    // TODO: confirm role title, location and website.
    overview: {
      role: 'Mechatronics Engineering Co-op',
      location: 'Waterloo, ON',
      website: 'https://www.electrans.com',
      skills: ['Placeholder Skill', 'Placeholder Skill 2'],
      summary:
        'I worked as a mechatronics engineering co-op, making their autonomous truck-trailer connections more adjustable and reliable.',
    },
    // TODO: add responsibilities and results.
    responsibilities: [],
    writeups: [
      {
        id: 'electrans-project-1',
        title: 'Placeholder Project One',
        subtitle: 'Placeholder subtitle · Electrans · Year',
        skills: ['Placeholder Skill', 'Placeholder Skill 2'],
        ...COMPACT,
        media: [wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption')],
        description:
          'Placeholder paragraph describing the project. Replace this text in src/data/experience.js.\n' +
          'A second placeholder paragraph.',
      },
    ],
  },
  {
    id: 'werkr',
    navLabel: 'Werkr Tractors',
    logo: `${IMG}/logo/werkr-logo.png`,
    header: {
      eyebrow: 'Engineering Co-op · Three Co-op Terms · 2024-2026',
      title: 'Werkr',
      accent: 'Tractors',
      intro: 'Werkr Tractors aims to make small-scale organic agriculture more profitable and sustainable by developing electric tractors and implements to go along with them.',
      heroImage: `${IMG}/werkr-hero.jpg`,
      nonExtendedPercentage: 1,
      textShadow: false,
      darkenedBehindText: true,
    },
    // TODO: confirm role title, location and website.
    overview: {
      role: 'Engineering Co-op',
      location: 'Waterloo, ON',
      website: 'https://www.werkrtractors.com',
      skills: ['3D CAD', 'Design for Manufacturing', 'Laser Cutting', 'MIG Welding', 'FEA', 'Machining', 'PCB Design', '3D Printing'],
      summary:
        'Over three co-op terms at Werkr Tractors, I led the design of a flame-weeding implement, designed my first PCB, rebuilt their website, designed a new implement-installing crane, and redesigned the tractor\'s rollbar for flat-pack shipping.',
    },
    // TODO: replace with your real responsibilities, ideally with numbers.
    responsibilities: [
      '**Website/Marketing:** Rebuilt the company website. Kept the website up to date with blog posts. Filmed and edited Instagram and YouTube videos.',
      '**Part Organization:** Developed a part numbering system which automatically provided new part numbers, tracked current stock, and gave a complete BOM for a tractor.',
      '**Testing:** Conducted field tests to gather data on the accuracy, reliability, and ruggedness of various implements and the tractor\'s autonomous driving.',
      '**Machining:** When days were slower, I machined in-house parts for the newer tractor models, which gave us more complete control over accuracy and timelines.',
    ],
    // TODO: these short descriptions are drafts; rewrite them in your own words.
    writeups: [
      fromProjectPage('/projects/mechanical', mechanical, 'flame-weeder', {
        ...COMPACT,
        subtitle: 'Weed control implement for small-scale farms · 2025',
        media: [wide(0, `${IMG}/flame-weeder-action.jpg`, 'Flame weeder in action', 'In Action')],
        description:
          'A project I led from concept through field testing, my first time owning a full design cycle. This flame weeder is meant to kill young weeds before they have been well established.\n' +
          'Designed for manufacturing from the start: bent laser-cut sheet metal with minimal welding, and Arduino-controlled ignition across six propane burners.',
      }),
      fromProjectPage('/projects/mechanical', mechanical, 'crane', {
        ...COMPACT,
        subtitle: 'Implement-installing crane · 2026',
        media: [wide(0, `${IMG}/crane-installed.jpg`, 'Crane installed on the tractor', 'Installed on the Tractor')],
        description:
          'After seeing how slow implement swaps were, I designed a front crane that lets one operator lift, swing and hook up implements on their own. Removing the need to drag the implement sideways into the tractor\'s center.\n' +
          'Validated with FEA before fabrication, this crane is built from bent laser-cut sheet metal for far less in cost and weight than a tubing design. It handles loads up to 250 lbs.',
      }),
      fromProjectPage('/projects/mechanical', mechanical, 'rollbar', {
        ...COMPACT,
        subtitle: 'Flat-pack rollbar redesign · 2026',
        media: [wide(0, `${IMG}/rollbar-context.jpg`, 'Rollbar CAD on the tractor', 'In Context on Tractor')],
        description:
          'Redesigned the welded tubing rollbar as bolted, laser-cut sheet metal so the tractor can ship flat-packed. I kept the initial frame as tubes for strength, then made the rest laser-cut bent sheet metal for cost savings.\n' +
          'Added a 3D-printed antenna and WIFI router housing that collapses out of the way in both directions to prevent low overhangs from shearing it off.',
      }),
      fromProjectPage('/projects/electrical', electrical, 'pcb', {
        ...COMPACT,
        subtitle: 'Control box PCB · 2026',
        media: [wide(0, `${IMG}/pcb-render.jpg`, 'Finished PCB', 'Finished PCB')],
        description:
          'Replaced the control box\'s growing tangle of DIN-rail wiring with my first self-designed custom PCB, mentored by professional electrical engineers.\n' +
          'Amazingly, it worked on the first revision, making the system more reliable, easier to debug, and simply much prettier within the control box.',
      }),
    ],
    // TODO: replace the placeholders with real photos.
    gallery: {
      id: 'werkr-gallery',
      title: 'Photo',
      accent: 'Gallery',
      items: [
        { src: `${IMG}/werkr-show.jpg`, caption: 'Farm Show', alt: 'Farm Show' },
        { src: `${IMG}/werkr-mower.jpg`, caption: 'Mower Deck', alt: 'Mower Deck' },
        { src: `${IMG}/werkr-rainy.jpg`, caption: 'Weeding in the Rain', alt: 'Weeding in the Rain' },
        { src: `${IMG}/werkr-seeding.jpg`, caption: 'Autonomous Seeding', alt: 'Autonomous Seeding' },
        { src: `${IMG}/werkr-weeding.jpg`, caption: 'Weeding Between Rows', alt: 'Weeding Between Rows' },
        { src: `${IMG}/werkr-model.jpg`, caption: '3D Printed Model', alt: '3D Printed Model' },
        { src: `${IMG}/werkr-render.jpg`, caption: 'Placeholder caption', alt: 'Placeholder image' },
      ],
    },
  },
    {
    id: 'slmc',
    navLabel: 'Silver Lake Camp',
    logo: `${IMG}/logo/slmc-logo.png`,
    header: {
      eyebrow: 'Summer Camp Counsellor · 2022-2027',
      title: 'Silver Lake',
      accent: 'Mennonite Camp',
      intro: 'Silver Lake Mennonite Camp is a summer camp located in the Bruce Peninsula, priding itself on the community aspect of its staff and campers.',
      heroImage: `${IMG}/slmc-campfire-extended.jpg`,
      nonExtendedPercentage: 0.625,
      textShadow: true,
      darkenedBehindText: false,
    },
    // TODO: confirm role title, location and website.
    overview: {
      role: 'Summer Camp Counsellor',
      location: 'Sauble Beach, ON',
      website: 'https://www.slmc.ca',
      skills: ['Leadership', 'Teamwork', 'Teaching', 'Building Maintenance'],
      summary:
        'A yearly summer job for a couple of weeks to counsel and teach the new generation. Summers at camp keep me grounded: counselling kids, fixing buildings, and pursuing projects like a detailed 3D-printed scale model of the entire camp.',
    },
    // TODO: replace with your real responsibilities.
    responsibilities: [
      '**Leadership:** Counselled cabins of campers for week-long sessions with ages ranging from 6 to 15.',
      '**Maintenance:** Repaired and maintained various camp buildings.',
      '**Initiative:** Designed and 3D printed a scale model/map of the property.',
    ],
    // TODO: this short description is a draft; rewrite it in your own words.
    writeups: [
      fromProjectPage('/projects/3d-printing', printing, 'camp-map', {
        ...COMPACT,
        subtitle: 'Personal project for the camp',
        media: [wide(0, `${IMG}/camp-map-overview.jpg`, 'Camp map overview', 'Full Camp Map')],
        description:
          'A half-year volunteer side project for the camp: a scale model of the whole site, built from nearly 500 3D-printed parts with CNC-routed paths,  LED-lit buildings, and epoxied lakes.\n' +
          'This map/model was very well received by the community since it helps campers and retreat groups find their way around the property.',
      }),
      {
        ...COMPACT,
        id: 'maintenance-sign',
        title: 'Maintenance Shed Sign',
        subtitle: 'CNC-routed sign for the camp\'s maintenance shed',
        skills: ['CNC Routing', 'Woodworking'],
        media: [wide(0, `${IMG}/woodwork-slmc.jpg`, 'Summer Camp Maintenance Sign', 'Maintenance Shed Sign')],
        // TODO: this description is a draft; rewrite it in your own words.
        description:
          'A heavily edited version of the camp\'s logo, CNC routed into a sign for the maintenance shed.',
        projectPage: '/projects/woodworking#general-projects',
      },
    ],
    gallery: {
      id: 'slmc-gallery',
      title: 'Life at',
      accent: 'Camp',
      large: true,
      items: [
        { src: `${IMG}/slmc-gallery-lake-fire.jpg`, caption: 'Fire on the Lake', alt: 'Fire on the Lake' },
        { src: `${IMG}/slmc-gallery-fire-leaves.jpg`, caption: 'Beacon of Leaves Burning', alt: 'Beacon of Leaves Burning' },
        { src: `${IMG}/slmc-gallery-lake-gathering.jpg`, caption: 'Lake Gathering', alt: 'Lake Gathering' },
        { src: `${IMG}/slmc-gallery-fire-tending.jpg`, caption: 'Tending to the Flame', alt: 'Tending to the Flame' },
        { src: `${IMG}/slmc-gallery-maintenance-sign.jpg`, caption: 'Custom Maintenance Sign', alt: 'Custom Maintenance Sign' },
        { src: `${IMG}/slmc-gallery-skit.jpg`, caption: 'Campfire Skit with Siblings', alt: 'Campfire Skit with Siblings' },
      ],
    },
  },
  {
    id: 'asi',
    navLabel: 'Accelerated Systems',
    logo: `${IMG}/logo/asi-logo.png`,
    header: {
      eyebrow: 'Mechanical Engineering Co-op · 2024',
      title: 'Accelerated',
      accent: 'Systems',
      intro: 'Accelerated Systems makes high-power electric motors, motor controllers, and batteries to provide a complete electrification system from golf karts and e-bikes to lawn mowers and tractors.',
      heroImage: `${IMG}/asi-hero.jpg`,
      nonExtendedPercentage: 1,
      textShadow: true,
      darkenedBehindText: false,
    },
    // TODO: confirm role title, location and website.
    overview: {
      role: 'Mechanical Engineering Co-op',
      location: 'Waterloo, ON',
      website: 'https://www.acceleratedsystems.com',
      skills: ['Circuit Design', 'Wiring', 'Motor Diagnostics', '3D Printing'],
      summary:
        'I worked in the Accelerated Systems shop on electric motors, motor controllers and gas-to-electric conversions, alongside keeping the shop\'s equipment running.',
    },
    // TODO: replace with your real responsibilities, ideally with numbers.
    responsibilities: [
      'Diagnosed and repaired failed electric motors.',
      'Managed all of the shop\'s 3D printers.',
      'Helped restore a CNC machine.',
    ],
    // TODO: these short descriptions are drafts; rewrite them in your own words.
    writeups: [
      {
        ...COMPACT,
        id: 'golf-cart-conversion',
        title: 'Golf Cart Electric Conversion',
        subtitle: 'Gas-to-electric drivetrain conversion · 2024',
        skills: ['Wiring', 'Machining', 'Electric Drivetrains'],
        media: [wide(0, `${IMG}/golf-cart.jpg`, 'Converted golf cart', 'Golf Cart Conversion')],
        description:
          'Converted gas-powered golf carts to electric drive using Accelerated Systems motors and controllers. Learned how the front linkages worked to provide steering, power, and brakes.\n' +
          'Developed fuse holders, junction boxes, and controller mounting plates to neatly install the new components\n' +
          'These 4-wheel-drive golf karts then gave better traction in muddy terrain, and simply gave more power when under heavy loads.',
      },
      {
        ...COMPACT,
        id: 'waterproof-motor-controllers',
        title: 'Waterproof Motor Controllers',
        subtitle: 'Motor controller enclosure design · 2024',
        skills: ['3D CAD', 'Epoxy', 'Waterproofing'],
        media: [wide(0, `${IMG}/motor-controller.jpg`, 'Motor controller', 'Motor Controller Design')],
        description:
          'Designed a waterproof housing for the motor controllers so the drive systems could survive wet, outdoor use. I achieved this by adding 3D-printed strain relief coupled with epoxy to the cable\'s exit hole.\n' +
          'The main trouble was that the epoxy had trouble bonding to the cables, which allowed it to shear and pull away from the cables. I solved this by first painting a primer onto the cables, which securely stuck the epoxy to them.',
      },
    ],
  },
]

export default experience
