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
}

export const writeups = [
  {
    id: 'camp-map',
    pageLink: 'camp-map',
    title: 'Summer Camp Map / 3D Scale Model',
    subtitle: 'Half-year passion project totalling around 500 individual printed parts · Personal Project for Silver Lake Mennonite Camp',
    skills: ['Onshape CAD', 'FDM Printing', 'CNC Routing', 'Soldering', 'Woodworking'],
    media: [
      wide(0, `${IMG}/camp-map-overview.jpg`, 'Camp Map Overview', 'Full Camp Map Overview'),
      tile(1, `${IMG}/camp-map-washhouse.jpg`, 'Wash House', 'Wash House & Dining Hall'),
      tile(1, `${IMG}/camp-map-night.jpg`, 'Night Lights', 'Night View with LEDs'),
    ],
    description:
      'A half-year passion project helping campers and retreat groups understand the layout of Silver Lake Mennonite Camp. Every structure was individually modelled to scale in Onshape and printed on a Bambu Lab X1C. Everything from large buildings, to small ball bins and kayaks was included.\n' +
      'The model consists of nearly 500 printed parts, epoxied lake surfaces, and CNC-routed paths (Scienci LongMill). Buildings lit at night in real life have individual LEDs mounted inside, switchable as a group. Mini campfires light up giving the model an added ambiance.\n' +
      'Managing a complex multi-part assembly, coordinating dozens of unique print settings, and integrating wiring throughout, all while maintaining visual accuracy and structural integrity.',
  },
  {
    id: 'periodic-table',
    title: 'Periodic Table of Elements',
    subtitle: '120 uniquely designed element boxes · Art piece and learning tool · Personal Project',
    skills: ['Onshape CAD', 'Blender', 'FDM Printing', 'Woodworking', 'Arduino'],
    media: [
      wide(0, `${IMG}/periodic-table-full.jpg`, 'Full Periodic Table', 'Full Periodic Table'),
      tile(1, `${IMG}/periodic-groups.jpg`, 'Groups', 'Elements by Groups'),
      tile(1, `${IMG}/periodic-density.jpg`, 'Density', 'Elements by Density'),
    ],
    description:
      'A 4-foot interactive periodic table designed as both an art piece and a learning tool for high school classes, aimed at creating excitement around chemistry and visualizing elemental patterns.\n' +
      'Each of the 120 element boxes was individually 3D modelled with a unique symbol designed from scratch. Each box includes a diffusing layer halfway through to evenly spread light from the LEDs behind. The title and LED holes were CNC routed into the plywood backing.\n' +
      'Shown at several schools, the table allows students to visualize properties like melting point, electronegativity, and density through individually controllable, colour-coded LEDs which are controlled by a 3D-printed box housing an Arduino.',
  },
  {
    id: 'beam-competition',
    title: 'Winning Beam Optimization Design Competition',
    subtitle: 'Designing the Highest Strength-to-Weight Ratio Beam · University Class Competition',
    skills: ['SolidWorks CAD', 'FEA', 'FDM Printing', 'Welding', 'Engineering Filaments'],
    media: [
      wide(0, `${IMG}/beam-failures.jpg`, 'Beam Design Failures', 'Beam Designs & Failure Modes'),
      tile(1, `${IMG}/beam-test-rig.jpg`, 'Rig', 'Self-Made Testing Rig'),
      tile(1, `${IMG}/beam-final.jpg`, 'Density', 'Final Beam Design'),
    ],
    description:
      'This was a competition in our Materials of Deformable Solids (MODs) class, where we designed, used FEA, and tested beams aimed at producing ones with the highest strength-to-weight ratio, with certain size constraints. We won this competition by achieving the highest ratio of 71,000 times the beam\'s own weight.\n' +
      'After printing and testing numerous beams with 9 different overarching designs, we landed on our final one. This final beam hit all the sizing constraints and took advantage of the fact that the testing rig had angled supports to hold the beam. This meant we could match the beam\'s lower geometry to match it, converting nearly all the force into compression.\n' +
      'After learning that the university\'s testing equipment was off limits, we decided to build our own testing rig. We designed and welded it out of metal tubing, then used force meters on wrenches for overall estimates before our final design was officially tested with the university\'s equipment. Our design also needed an incredibly rigid material, thus we used Bambu Lab\'s PPA-CF Engineering Filament.',
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
      'This project started as a cardboard cut-out of a Batman logo, taped to a stick in front of a small flashlight. Once the proof of concept was complete, I was hooked and started designing Version 1 of my bat signal. The flashlight outputted 3000 lumens, and the threaded attachment allowed me to crisply focus the image.\n' +
      'The flashlight I used in version 1, however, was a little flaky, so I switched to a Laser Excited Phosphor (LEP) flashlight. This flashlight technology is superb at shooting great distances, allowing me to shoot this signal for over a kilometre away.\n' +
      'I used this symbol frequently at the summer camp to trick kids into thinking that Batman will show up, or to simply draw their attention away. I decided to print the SOS as a potential emergency signal when camping; luckily, I have not needed to use it yet.',
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
