/**
 * electrical.js
 *
 * Everything shown on the Electrical page (/projects/electrical), top to bottom. The same
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
 *                be linked to directly as /projects/electrical#<id>; changing an id
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
 */
import { tile, wide } from '../../utils/mediaTiles.js'

const IMG = '/assets/images'

export const header = {
  eyebrow: 'PCB Design · Circuit Design · Arduino · Wiring · Soldering',
  title: 'Electrical',
  accent: 'Engineering',
  intro: 'From PCB design and Arduino programming to wiring harness production and soldering, building reliable, testable electrical systems.',
  heroImage: `${IMG}/pcb-render.jpg`,
  heroPosition: 'center',
}

export const writeups = [
  {
    id: 'pcb',
    title: 'Electric Tractor Printed Circuit Board',
    subtitle: 'First PCB design, success on first revision · Werkr Tractors Co-op · 2026',
    skills: ['PCB Design', 'Circuit Design', 'Wiring'],
    media: [
      wide(0, `${IMG}/pcb-render.jpg`, 'PCB Board', 'Finished PCB — Werkr Tractor Computer Box V1'),
      tile(1, `${IMG}/pcb-eda.jpg`, 'PCB EDA', 'PCB Layout in EDA'),
      tile(1, `${IMG}/pcb-installed.jpg`, 'Installed', 'Installed in Control Box'),
    ],
    description:
      'As the autonomous tractor\'s control box grew more complex, debugging became harder and connections less reliable. I designed a custom PCB to reorganize the wiring, moving away from DIN rail connections and focusing on reliability and debuggability.\n' +
      'This was my first PCB design, mentored by professional electrical engineers. I am proud to say it was a success on the first revision, dramatically simplifying the wiring layout and improving system reliability.\n' +
      'Future-proofed with connections for future controls such as remote e-stops and emergency brakes, the PCB positions the tractor for expanded autonomy features.',
  },
  {
    id: 'periodic-table-leds',
    title: 'Periodic Table, Arduino LED Control System',
    subtitle: '120 individually addressable LEDs · Interactive learning tool · Personal Project',
    skills: ['Arduino IDE', 'LED Control', 'Wiring', 'Circuit Design'],
    media: [
      tile(0, `${IMG}/periodic-groups.jpg`, 'Groups', 'Elements by Groups'),
      tile(0, `${IMG}/periodic-density.jpg`, 'Density', 'Elements by Density'),
      tile(1, `${IMG}/periodic-animation.jpg`, 'Animation', '"Boil" Scrolling Animation'),
      tile(1, `${IMG}/periodic-table-small.jpg`, 'Full Table', 'Solid Colour Mode'),
    ],
    description:
      'The electrical backbone of the Periodic Table Wall Art, 120 individually addressable LEDs behind 3D printed element boxes with diffusing layers. All controlled by an Arduino.\n' +
      'Display modes: elements coloured by group, density, melting point, half-life, electronegativity, molecular composition, and various others. This allows students to discover patterns within the table. Scrolling text animations (e.g. "BOIL" for boiling point) add engagement.\n' +
      'Shown at several high schools to generate excitement about chemistry, making an abstract subject tangible and visually compelling.',
  },
  {
    id: 'motor-controllers',
    title: 'Waterproof Motor Controllers & Golf Cart Conversion',
    subtitle: 'Mechanical Engineering Co-op · Accelerated Systems Inc. · 2024',
    skills: ['Circuit Design', 'Wiring', 'Motor Diagnostics'],
    media: [
      tile(0, `${IMG}/motor-controller.jpg`, 'Motor Controller', 'Motor Controller Design'),
      tile(0, `${IMG}/golf-cart.jpg`, 'Golf Cart', 'Golf Cart Conversion'),
    ],
    description:
      'At Accelerated Systems Inc., I diagnosed and repaired broken electric motors, designed waterproof motor controllers, and converted gas-powered golf carts to electric drive systems.\n' +
      'Additional initiatives included managing all 3D printers in the shop and contributing to the restoration of a CNC machine.',
  },
]
