/**
 * mechanical.js
 *
 * Everything shown on the Mechanical page (/projects/mechanical), top to bottom. The same
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
 *
 * writeups — one section per project, photos left and text right
 *   id           Short unique name (lowercase-with-dashes). The section can
 *                be linked to directly as /projects/mechanical#<id>; changing an id
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
 *
 * machinedParts — the "General Machined Parts" cards at the bottom of the page
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
import { tile } from '../../utils/mediaTiles.js'

const IMG = '/assets/images'

export const header = {
  eyebrow: '3D CAD · Laser Cutting · Welding · Machining · FEA',
  title: 'Mechanical',
  accent: 'Engineering',
  intro: 'Design-for-manufacturing, fabrication, and real-world implementation, from sheet metal and MIG welding to FEA-validated structural components.',
  heroImage: `${IMG}/crane-installed.jpg`,
  heroPosition: 'center',
}

export const writeups = [
  {
    id: 'flame-weeder',
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
      'Designed from scratch to eliminate young weeds before planted seeds germinate. Centered on design-for-manufacturing: minimize welding, maximize bent sheet metal, reduce both cost and complexity.\n' +
      'A forklift propane tank feeds 6 individual burners. Each has a spark plug and coil controlled by Arduino for continuous ignition. Stainless steel heat shields contain flame, increasing efficiency and travel speed.\n' +
      'As the first prototype, outer shields were given additional bolt holes to keep all shields identical, reducing laser-cutting error and cost. A project I personally initiated and led from concept through field testing.',
  },
  {
    id: 'crane',
    title: 'Electric Tractor Implement Crane',
    subtitle: 'Prototyping and Design for Manufacturing · Werkr Tractors Co-op · 2026',
    skills: ['3D CAD', 'Laser Cutting', 'MIG Welding', 'FEA'],
    media: [
      tile(0, `${IMG}/crane-cad.jpg`, 'CAD', 'CAD Design'),
      tile(0, `${IMG}/crane-fea.jpg`, 'FEA', 'FEA Stress Analysis'),
      tile(1, `${IMG}/crane-finished.jpg`, 'Finished', 'Finished Product'),
      tile(1, `${IMG}/crane-installed.jpg`, 'Installed', 'Zinc-Plated & Installed'),
    ],
    description:
      'After observing how difficult implement swaps were, I designed a front crane allowing a single operator to lift, swing, and hook up implements far more quickly. This was inspired by the Tilmor tractor design.\n' +
      'Built from bent laser-cut sheet metal and MIG-welded, this design was considerably cheaper than metal tubing. A large center cutout reduces weight. A rope-and-crank system handles loads up to 250 lbs.\n' +
      'An FEA study in SolidWorks validated structural integrity before fabrication. The finished crane was zinc-plated for corrosion and rust protection.',
  },
  {
    id: 'rollbar',
    title: 'Electric Tractor Rollbar',
    subtitle: 'Safety structure, roof mount, and antenna housing · Werkr Tractors Co-op · 2026',
    skills: ['3D CAD', 'Laser Cutting', '3D Printing'],
    media: [
      tile(0, `${IMG}/rollbar-cad.jpg`, 'Rollbar CAD', 'Rollbar CAD'),
      tile(0, `${IMG}/rollbar-context.jpg`, 'In Context', 'In Context on Tractor'),
    ],
    description:
      'Protects the driver, supports the roof, and mounts antennas at the tractor\'s highest point. Originally designed in metal tubing, I redesigned it with laser-cut bent sheet metal to allow flat-pack shipping, not possible with the welded original.\n' +
      'Three main structural tubes were retained; everything else is laser-cut and subsequently nut-and-bolt assembled. A 3D-printed antenna and WiFi router housing at the rear uses balls and springs to rotate and clear low overhangs, a passive safety mechanism.',
  },
  {
    id: 'beam-competition',
    title: 'Winning Beam Optimization Design Competition',
    subtitle: 'Designing the Highest Strength-to-Weight Ratio Beam · University Class Competition',
    skills: ['SolidWorks CAD', 'FEA', 'Machining', 'Welding', 'FDM Printing'],
    media: [
      tile(0, `${IMG}/beam-failures-small.jpg`, 'Beam Design Failures', 'Beam Design Failures'),
      tile(0, `${IMG}/beam-final.jpg`, 'Final Design', 'Final Beam Design'),
      tile(1, `${IMG}/beam-test-action.jpg`, 'On Tractor', 'Beam Testing Calibration'),
      tile(1, `${IMG}/beam-test-rig.jpg`, 'In Action', 'Beam Testing Rig'),
    ],
    description:
      'This was a competition in our Materials of Deformable Solids (MODs) class, where we designed, used FEA, and tested beams aimed at producing ones with the highest strength-to-weight ratio, with certain size constraints. We won this competition by achieving the highest ratio of 71,000 times the beam\'s own weight.\n' +
      'After learning that the university\'s testing equipment was off limits, we decided to build our own testing rig. We designed and welded it out of metal tubing, then used force meters on wrenches for overall estimates before our final design was officially tested with the university\'s equipment. Our design also needed an incredibly rigid material, thus we used Bambu Lab\'s PPA-CF Engineering Filament.\n' +
      'After printing and testing numerous beams with 9 different overarching designs, we landed on our final one. This final beam hit all the sizing constraints and took advantage of the fact that the testing rig had angled supports to hold the beam. This meant we could match the beam\'s lower geometry to match it, converting nearly all the force into compression.',
  },
]

export const machinedParts = {
  id: 'machined-parts',
  title: 'General',
  accent: 'Machined Parts',
  items: [
    {
      id: 'pizza-axe',
      title: 'Pizza Axe',
      tags: ['Welding'],
      blurb: 'A highly useful pizza axe to simultaneously cut a whole pizza into 8 slices with a strong whack!',
      image: `${IMG}/mechanical-pizza-axe.jpg`,
      alt: 'Pizza Axe',
    },
    {
      id: 'adapter-plate',
      title: 'Adapter Plate',
      tags: ['Milling'],
      blurb: 'Manually-milled mounting plate demonstrating various slots and holes.',
      image: `${IMG}/adapter-plate.jpg`,
      alt: 'Adapter Plate',
    },
    {
      id: 'motor-shaft',
      title: 'Motor Shaft',
      tags: ['Turning'],
      blurb: 'Turned motor shaft with precise shoulder and thread dimensions, produced on a manual lathe with CNC capabilities.',
      image: `${IMG}/motor-shaft.jpg`,
      alt: 'Motor Shaft',
    },
    {
      id: 'gearbox-plate',
      title: 'Gearbox Plate',
      tags: ['CNC Milling'],
      blurb: 'CNC milled gearbox mounting plate with precise recessed pockets and hole patterns.',
      image: `${IMG}/gearbox-plate.jpg`,
      alt: 'Gearbox Plate',
    },
    {
      id: 'quick-hitch',
      title: 'Quick Hitch',
      tags: ['TIG Welding'],
      blurb: 'TIG-welded quick hitch assembly demonstrating structural fabrication.',
      image: `${IMG}/quick-hitch.jpg`,
      alt: 'Quick Hitch',
    },
  ],
}
