/**
 * printing.js
 *
 * Everything shown on the 3D Printing page (/projects/3d-printing), top to bottom. The same
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
 *                be linked to directly as /projects/3d-printing#<id>; changing an id
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
 * gallery — the "General 3D Printing Projects" thumbnails at the bottom
 *   id              Anchor for the section (link: <page>#<id>).
 *   title / accent  Section heading; `accent` is shown in the accent colour.
 *   items           One thumbnail per entry, in order:
 *     type     Optional: 'photo', 'video', 'stl' or 'iframe'. Normally
 *              left out — it's worked out from `src`.
 *     caption  Text under the thumbnail.
 *     alt      Short description of the photo for screen readers.
 *     src      What to show: a photo, .mp4 video, .stl 3D model or https://
 *              embed (cropped to 4:3 in the grid; photos/videos enlarge on click).
 */
import { tile, wide } from '../../utils/mediaTiles.js'

const IMG = '/assets/images'

export const header = {
  eyebrow: '3D CAD · FDM Printing · Scale Modelling · Artistic Design',
  title: '3D',
  accent: 'Printing',
  intro: 'Years of whimsical, functional, and artistic modelling; specializing in small, detailed models with high printability, strength, and reliability.',
  heroImage: `${IMG}/camp-map-overview.jpg`,
  heroPosition: 'center',
  nonExtendedPercentage: 1,
  textShadow: true,
  darkenedBehindText: true,
}

export const writeups = [
  {
    id: 'camp-map',
    pageLink: 'camp-map',
    title: 'Summer Camp Map / 3D Scale Model',
    subtitle: 'About 500 printed parts and 500 hours of work · Personal Project for Silver Lake Mennonite Camp',
    skills: ['Onshape CAD', 'FDM Printing', 'CNC Routing', 'Soldering', 'Woodworking'],
    media: [
      wide(0, `${IMG}/camp-map-overview.jpg`, 'Camp Map Overview', 'Full Camp Map Overview'),
      tile(1, `${IMG}/camp-map-washhouse.jpg`, 'Wash House', 'Wash House & Dining Hall'),
      tile(1, `${IMG}/camp-map-night.jpg`, 'Night Lights', 'Night View with LEDs'),
    ],
    description:
      '**Goal:** Help campers and retreat groups understand the layout of Silver Lake Mennonite Camp with a detailed scale model of the whole property.\n' +
      '**Modelling and printing:** Every structure was individually modelled to scale in Onshape and printed on a Bambu Lab X1C, from the large buildings down to the ball bins and kayaks, about **500 printed parts** in all.\n' +
      '**Bringing it together:** The parts sit on a base with CNC-routed paths (Scienci LongMill) and epoxied lakes. Buildings that are lit at night in real life have their own LEDs, switchable as a group, and mini campfires light up for extra ambiance.\n' +
      '**Scale:** Roughly **500 hours** over half a year, managing a complex multi-part assembly, dozens of unique print settings and wiring throughout, while keeping it accurate and sturdy.\n' +
      '**Result:** The model was very well received by the camp community, and helps visitors find their way around the property.',
  },
  {
    id: 'periodic-table',
    pageLink: 'periodic-table',
    title: 'Periodic Table of Elements',
    subtitle: '120 uniquely designed element boxes · Art piece and learning tool · Personal Project',
    skills: ['Onshape CAD', 'Blender', 'FDM Printing', 'Woodworking', 'Arduino'],
    media: [
      wide(0, `${IMG}/periodic-table-full.jpg`, 'Full Periodic Table', 'Full Periodic Table'),
      tile(1, `${IMG}/periodic-groups.jpg`, 'Groups', 'Elements by Groups'),
      tile(1, `${IMG}/periodic-density.jpg`, 'Density', 'Elements by Density'),
    ],
    description:
      '**Goal:** A **4-foot** periodic table designed as both an art piece and a learning tool for high school classes, to create excitement around chemistry and make patterns between elements visible.\n' +
      '**Design:** Each of the **120 element boxes** was individually 3D modelled with its own symbol, designed from scratch. A diffusing layer halfway through each box spreads the light from the LED behind it evenly. Why 120? For the kids, I added vibranium (from Marvel) and netherite (from Minecraft) as elements 119 and 120.\n' +
      '**Build:** Every box is **individually controlled** by an Arduino housed in a 3D-printed box, and the title and LED holes are CNC routed into the plywood backing.\n' +
      '**Result:** Shown at several schools and very well received, letting students see properties like melting point, electronegativity and density light up in colour-coded patterns.',
  },
  {
    id: 'beam-competition',
    pageLink: 'beam-competition',
    title: 'Winning Beam Optimization Design Competition',
    subtitle: 'Designing the Highest Strength-to-Weight Ratio Beam · University Class Competition',
    skills: ['SolidWorks CAD', 'FEA', 'FDM Printing', 'Welding', 'Engineering Filaments'],
    media: [
      wide(0, `${IMG}/beam-failures.jpg`, 'Beam Design Failures', 'Beam Designs & Failure Modes'),
      tile(1, `${IMG}/beam-test-rig.jpg`, 'Rig', 'Self-Made Testing Rig'),
      tile(1, `${IMG}/beam-final.jpg`, 'Density', 'Final Beam Design'),
    ],
    description:
      '**Challenge:** A competition in our Materials of Deformable Solids (MODs) class: build the beam with the highest strength-to-weight ratio within set size limits.\n' +
      '**Material:** The beam needed to be incredibly rigid for its weight, so we printed it in Bambu Lab\'s PPA-CF, a carbon-fibre-reinforced engineering filament.\n' +
      '**Iterating with 3D printing:** Printing let us build and break many beams quickly across 9 overarching designs (6 of them mine), learning from how each one failed.\n' +
      '**Final design:** The official rig holds the beam on angled supports, so the final beam\'s underside matches them, turning nearly all of the load into compression. Between iterations we tested on our own welded rig.\n' +
      '**Result:** We won, with our beam holding **71,000 times its own weight**.',
  },
  {
    id: 'signal-projector',
    title: 'Flashlight Signal Projector',
    subtitle: 'Infinite Symbol Possibilities - Infinite Fun · Personal Project',
    skills: ['Onshape CAD', 'FDM Printing', 'Optics'],
    media: [
      wide(0, `${IMG}/bat-signals.jpg`, 'Signal Examples', 'Examples of Symbols'),
      tile(1, `${IMG}/bat-signals-v1.jpg`, 'Version 1', 'Version 1'),
      tile(1, `${IMG}/bat-signals-v2.jpg`, 'Version 2', 'Version 2'),
    ],
    description:
      '**Origin:** This started as a cardboard Batman logo taped to a stick in front of a small flashlight. Once the proof of concept worked, I was hooked.\n' +
      '**Version 1:** A 3000-lumen flashlight with a 3D-printed threaded attachment that focuses the symbol crisply.\n' +
      '**Version 2:** Version 1\'s flashlight was a little flaky, so I switched to a Laser Excited Phosphor (LEP) flashlight. LEPs are superb at long range, projecting the symbol **over a kilometre away**.\n' +
      '**In use:** At summer camp it convinces kids that Batman might show up, or simply grabs their attention. I also printed an SOS symbol as an emergency signal for camping; luckily, I haven\'t needed it yet.',
  },
]

export const gallery = {
  id: 'general-projects',
  title: 'General',
  accent: '3D Printing Projects',
  items: [
    { type: 'photo', caption: 'Werkr Tractor 3D Model', alt: 'Werkr Tractor Model', src: `${IMG}/3dp-tractor-model.jpg` },
    { type: 'photo', caption: 'Mercedes Hood Ornament', alt: 'Mercedes Hood Ornament', src: `${IMG}/3dp-mercedes.jpg` },
    { type: 'photo', caption: 'Local Church 3D Model', alt: 'Local Church Model', src: `${IMG}/3dp-church.jpg` },
    { type: 'photo', caption: 'Cordless Drill Boat Propeller', alt: 'Drill Boat Propeller', src: `${IMG}/3dp-propeller.jpg` },
    { type: 'photo', caption: 'Low Poly Bear Head', alt: 'Low Poly Bear Head', src: `${IMG}/3dp-bear.jpg` },
    { type: 'photo', caption: 'V12 Engine Battery Holder', alt: 'V12 Engine Battery Holder', src: `${IMG}/3dp-engine-battery.jpg` },
    { type: 'photo', caption: 'Helical Aluminum Decoration', alt: 'Helical Aluminum Decoration', src: `${IMG}/3dp-helical-aluminum.jpg` },
    { type: 'photo', caption: 'Desk Organizer', alt: 'Desk Organizer', src: `${IMG}/3dp-desk-org.jpg` },
    { type: 'photo', caption: 'Canoe Light Switch', alt: 'Canoe Switch', src: `${IMG}/3dp-canoe-switch.jpg` },
    { type: 'photo', caption: 'Ravioli Mold', alt: 'Ravioli Mold', src: `${IMG}/3dp-ravioli-mold.jpg` },
  ],
}
