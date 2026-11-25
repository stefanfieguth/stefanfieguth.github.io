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
 *   pageLink     Optional. The `id` of a report in src/data/detailedReport.js
 *                with much more detail on this project. When set, a "View
 *                Detailed Project Report" button appears at the bottom right
 *                of the write-up box, linking to /reports/<pageLink>.
 *
 * machinedParts — the "General Fabrication" cards at the bottom of the page
 *   id              Anchor for the section (link: <page>#<id>).
 *   title / accent  Section heading; `accent` is shown in the accent colour.
 *   items           One card per entry, in order:
 *     id     Unique short name (only used internally).
 *     title  Card heading.
 *     tags   Pills above the heading.
 *     blurb  Short description under the heading.
 *     image  Media across the top of the card (16:9): a photo, .mp4 video,
 *            .stl 3D model or https:// embed. Photos/videos open full size
 *            on click. Optional `type` overrides the guess from the file.$1 *     button Optional. { label, to }: a button at the bottom of the card
 *            linking to another page, e.g. a job's experience page.
 */
import { tile, PLACEHOLDER } from '../../utils/mediaTiles.js'

const IMG = '/assets/images'
const MODELS = '/assets/models'

export const header = {
  eyebrow: '3D CAD · Laser Cutting · Welding · Machining · FEA',
  title: 'Mechanical',
  accent: 'Engineering',
  intro: 'Design-for-manufacturing, fabrication, and real-world implementation, from sheet metal and MIG welding to FEA-validated structural components.',
  heroImage: `${IMG}/crane-installed.jpg`,
  heroPosition: 'center',
  nonExtendedPercentage: 1,
  textShadow: false,
  darkenedBehindText: true,
}

export const writeups = [
  {
    id: 'flame-weeder',
    pageLink: 'flame-weeder',
    title: 'Flame-Weeding Tractor Implement',
    subtitle: 'Novel mechanical design for weed control on small-scale farms · Werkr Tractors Co-op · 2025',
    skills: ['3D CAD', 'Laser Cutting', 'Machining', 'Arduino', 'Design for Manufacturing'],
    media: [
      tile(0, `${MODELS}/Flame_Weeder_Assembly-v1.glb`, 'CAD Model', 'CAD Model', { fallback: `${IMG}/flame-weeder-cad.jpg`, config: { upAxis: '-z', initialEuler: [0.45, 0, 0], zoom: 1.3 } }),
      tile(0, `${IMG}/flame-weeder-underside.jpg`, 'Underside', 'Underside View'),
      tile(1, `${IMG}/flame-weeder-tractor.jpg`, 'On Tractor', 'Attached to Tractor'),
      tile(1, `${IMG}/flame-weeder-action.jpg`, 'In Action', 'In Action'),
    ],
    description:
      '**Problem:** Organic farms can\'t rely on herbicides, so young weeds are usually pulled by hand or tilled, both slow and labour-intensive. Werkr needed an implement that could clear a whole bed of young weeds just before the crop emerges.\n' +
      '**Approach:** I proposed the project and led it from concept through field testing. The design is modular, currently running six burners fed by a forklift propane tank. Each burner has its own Arduino-controlled spark plug and coil for continuous ignition, so every burner stays lit, and stainless steel heat shields hold the flame against the soil.\n' +
      '**Design for manufacturing:** The body is bent laser-cut sheet metal with minimal welding, keeping cost and complexity down. All the shields are identical (the outer ones just use extra bolt holes), so only one shield design needs to be cut.\n' +
      '**Result:** Built and field tested on Werkr\'s electric tractor, it lets the tractor weed at **triple the driving speed**.',
  },
  {
    id: 'crane',
    pageLink: 'crane',
    title: 'Electric Tractor Implement Crane',
    subtitle: 'Prototyping and Design for Manufacturing · Werkr Tractors Co-op · 2026',
    skills: ['3D CAD', 'Laser Cutting', 'MIG Welding', 'FEA'],
    media: [
      tile(0, `${MODELS}/LC_Front_crane_assembly-v1.glb`, 'CAD', 'CAD Design', { fallback: `${IMG}/crane-cad.jpg`, config: { zoom: 1.3 } }),
      tile(0, `${IMG}/crane-fea.jpg`, 'FEA', 'FEA Stress Analysis'),
      tile(1, `${IMG}/crane-finished.jpg`, 'Finished', 'Finished Product'),
      tile(1, `${IMG}/crane-installed.jpg`, 'Installed', 'Zinc-Plated & Installed'),
    ],
    description:
      '**Problem:** Swapping implements on the tractor was slow and awkward, with each implement dragged sideways into the centre of the tractor by hand.\n' +
      '**Approach:** I designed a front crane that lets a single operator lift, swing and hook up implements on their own, inspired by the Tilmor tractor design. A rope-and-crank system does the lifting.\n' +
      '**Design for manufacturing:** Built from bent laser-cut sheet metal and MIG-welded, it was considerably cheaper than a tubing design, and a large centre cutout keeps the weight down.\n' +
      '**Validation:** An FEA study in SolidWorks before fabrication kept the peak stress to **15,000 psi** at full load.\n' +
      '**Result:** The finished crane lifts up to **250 lbs**, and was zinc-plated for corrosion and rust protection.',
  },
  {
    id: 'rollbar',
    pageLink: 'rollbar',
    title: 'Electric Tractor Rollbar',
    subtitle: 'Safety structure, roof mount, and antenna housing · Werkr Tractors Co-op · 2026',
    skills: ['3D CAD', 'Laser Cutting', '3D Printing'],
    media: [
      tile(0, `${MODELS}/Rollbar_assembly-v2.glb`, 'Rollbar CAD', 'Rollbar CAD', { fallback: `${IMG}/rollbar-cad.jpg`, config: { initialEuler: [-0.35, 0, 0], zoom: 1.3 } }),
      tile(0, `${IMG}/rollbar-context.jpg`, 'In Context', 'In Context on Tractor'),
    ],
    description:
      '**Problem:** The rollbar protects the driver, supports the roof and mounts the antennas at the tractor\'s highest point. The original was welded metal tubing, a large rigid frame that made the tractor awkward to ship.\n' +
      '**Approach:** I kept the three main structural tubes for strength and redesigned everything else as laser-cut bent sheet metal, bolted together instead of welded, so the whole rollbar flat-packs.\n' +
      '**Passive safety:** A 3D-printed antenna and WiFi router housing at the rear uses balls and springs to rotate out of the way of low overhangs instead of being sheared off.\n' +
      '**Result:** The rollbar now ships flat alongside the rest of the tractor on **less-than-truckload (LTL) pallets**.',
  },
  {
    id: 'stormbreaker',
    pageLink: 'stormbreaker',
    title: 'Thor\'s Stormbreaker Axe',
    subtitle: 'Making Thor\'s Stormbreaker Axe in real life to be aesthetic and functional · Personal Project',
    // TODO: confirm skills, replace the placeholder photos and description.
    skills: ['3D CAD', 'Sheet Metal Design', 'Laser Cutting', 'MIG Welding'],
    media: [
      tile(0, `${MODELS}/model.stl`, 'Stormbreaker axe head 3D model', 'CAD Model'),
      tile(0, `${IMG}/stormbreaker-polished.jpg`, 'Polished Axe', 'Polished Axe'),
      tile(1, `${IMG}/stormbreaker-forge.jpg`, 'Forging the Axe', 'Heat Treating the Blade'),
      tile(1, `${IMG}/stormbreaker-inner-frame.jpg`, 'Welding the inner frame', 'Load-Bearing Frame'),
    ],
    description:
      '**A team build:** My brother and I have long wanted to build this axe from Marvel\'s Thor, for the size and aura that come with wielding it. We built it together and shared every step, from the CAD to the welding and polishing.\n' +
      '**Problem:** The axe in the movies is enormous and would weigh far too much to be practical, so we had to find a trade-off between looking impressive and being strong and functional.\n' +
      '**Approach:** A lightweight outer shell carries the look, while a robust inner frame carries the load.\n' +
      '**Finishing:** Since the axe is welded from mild steel, we polished it and heat-treated the edge on our cousin\'s forge to harden it and make it more durable.',
  },
  {
    id: 'beam-competition',
    pageLink: 'beam-competition',
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
      '**Challenge:** A competition in our Materials of Deformable Solids (MODs) class: design, analyse with FEA and test the beam with the highest strength-to-weight ratio within set size limits.\n' +
      '**My role:** I took the lead on our team: I designed and welded our test fixture, and designed 6 of our 9 beam concepts.\n' +
      '**Testing rig:** The university\'s testing equipment was off limits until the final test, so we built our own rig from welded metal tubing, using force meters on wrenches to estimate loads between iterations.\n' +
      '**Key insight:** The official rig holds the beam on angled supports, so we shaped our final beam\'s underside to match them, turning nearly all of the load into compression.\n' +
      '**Result:** We won, with our beam holding **71,000 times its own weight**.',
  },
]

export const machinedParts = {
  id: 'machined-parts',
  title: 'General',
  accent: 'Fabrication',
  items: [
    {
      id: 'pizza-axe',
      title: 'Pizza Axe',
      tags: ['Welding'],
      blurb: 'A highly useful pizza axe to simultaneously cut a whole pizza into 8 slices with a strong whack!',
      image: `${IMG}/mechanical-pizza-axe.jpg`,
      alt: 'Pizza Axe',
    },
    // The other machined parts live on the Accelerated Systems page.
    {
      id: 'asi-machining',
      title: 'Machining & Welding',
      tags: ['Milling', 'Turning', 'CNC Milling', 'TIG Welding'],
      blurb: 'Milled plates, a turned motor shaft and a TIG-welded quick hitch, made in the Accelerated Systems shop.',
      image: `${IMG}/motor-shaft.jpg`,
      alt: 'Turned motor shaft',
      button: { label: 'Machining at Accelerated Systems', to: '/experience/asi#machining' },
    },
  ],
}
