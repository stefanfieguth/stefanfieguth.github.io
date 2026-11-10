/**
 * other.js
 *
 * Everything shown on the Other Projects page (/projects/other), top to
 * bottom. The same data also feeds the static HTML that search engines read
 * (scripts/prerender.mjs) and the page's tab title (pageMeta.js).
 *
 * ⚠ TEMPORARY CONTENT: all text and images below are placeholders.
 * Replace them with real projects.
 *
 * HOW TO EDIT
 *   - Change text: edit the strings below. Inside '...' strings, write an
 *     apostrophe as \' (e.g. 'tractor\'s').
 *   - Add a project: copy a whole write-up (from `{ id:` to its closing
 *     `},`), paste it where it should appear, give it a new unique `id`,
 *     and edit it. Projects appear top to bottom in the order listed.
 *   - Remove a project: delete its whole entry. Reorder: move entries.
 *   - Add a photo: save it in public/assets/images/ and replace a
 *     PLACEHOLDER.* value with `${IMG}/<file name>`.
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
 *                be linked to directly as /projects/other#<id>.
 *   title        Project heading.
 *   subtitle     Small line under the title (context · year).
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
 * gallery — the small captioned thumbnails at the bottom of the page
 *   id              Anchor for the section (link: /projects/other#<id>).
 *   title / accent  Section heading; `accent` is shown in the accent colour.
 *   items           One thumbnail per entry, in order:
 *     type     Optional: 'photo', 'video', 'stl' or 'iframe'. Normally
 *              left out — it's worked out from `src`.
 *     caption  Text under the thumbnail.
 *     alt      Short description of the photo for screen readers.
 *     src      What to show: a photo, .mp4 video, .stl 3D model or https://
 *              embed (cropped to 4:3 in the grid; photos/videos enlarge on click).
 */
import { tile, wide, PLACEHOLDER } from '../../utils/mediaTiles.js'

// Folder prefix for real photos, e.g. `${IMG}/my-photo.jpg` for the file
// public/assets/images/my-photo.jpg. Not used until real photos are added.
const IMG = '/assets/images'

export const header = {
  eyebrow: 'Pyrotechnics · LEGO · Gingerbread',
  title: 'Other',
  accent: 'Projects',
  intro: 'Projects that do not quite fit the norm. From incredibly artistic videos and photos showcasing fire, to elaborate gingerbread houses and custom LEGO figurines',
  heroImage: `${IMG}/pyro-steelwool.jpg`,
  heroPosition: 'center',
}

export const writeups = [
  {
    id: 'Pyrotechnics',
    title: 'Pyrotechnics & Visual Effects',
    subtitle: 'Fire and light as a creative medium · Personal Passion',
    skills: ['Visual Effects', 'Pyrotechnics', 'Photography', 'Videography'],
    media: [
      wide(0, `${IMG}/pyro-green-sword.jpg`, 'Green Fire Sword', 'Green Fire Sword'),
      tile(1, `${IMG}/pyro-steel-wool.jpg`, 'Steel Wool', 'Steel Wool Long Exposure'),
      tile(1, `${IMG}/pyro-sword-pointing.jpg`, 'Pointing Sword', 'Bluish Fire Sword'),
      tile(2, `${IMG}/pyro-weld.jpg`, 'Welding', 'Close-up Welding'),
      tile(2, `${IMG}/pyro-weld-smash.jpg`, 'Pointing Sword', 'Weld Puddle Smashing'),
    ],
    description:
      'An ongoing creative pursuit exploring the visual possibilities of fire and light. From custom-built props and fire performances to long-exposure photography and cinematic video production, pyrotechnics offers me an opportunity to combine hands-on creativity with visual storytelling.\n' +
      'I enjoy capturing these experiences through photography and videography, using long-exposure techniques, some bad acting, and video editing to transform these short moments into lasting visual pieces. I especially enjoy showing people how fire can be an art form, more than simply a destructive force.',
  },
  {
    id: 'Gingerbread',
    title: 'Extreme Gingerbread Builds',
    subtitle: 'A yearly family challenge · Personal Project · Yearly',
    skills: ['Gingerbread Baking', 'CAD'],
    media: [
      tile(0, `${IMG}/gingerbread-pyramid.jpg`, 'Rotating Christmas Pyramid', 'Rotating Christmas Pyramid - 2025'),
      tile(0, `${IMG}/gingerbread-eiffel.jpg`, 'Eiffel Tower', 'Eiffel Tower - 2024'),
      tile(1, `${IMG}/gingerbread-airport.jpg`, 'Airport', 'Airport - 2023'),
      tile(1, `${IMG}/gingerbread-seuss.jpg`, 'Dr. Seuss Tree House', 'Dr. Seuss Tree House - 2022'),
    ],
    description:
      'Every year my family and I design an extremely complicated gingerbread house. It always starts reasonably, and then gets more and more difficult. We have discovered that designs in CAD do not always easily transfer to gingerbread.\n' +
      '2025 - Most recently we made a spinning Christmas pyramid using a stepper motor and marbles as ball bearings. Having a 3D printer and a CNC allows us to add bases and gears to support the design of the gingerbread. Making it so tall was a challenge, but to our delight, it worked without a hitch.\n' +
      '2024 - The Eiffel Tower had long been on our mind due to how classic the structure is. Likely one of our prettiest and neatest designs.\n' +
      '2024 - In making an airport and plane, we discovered why no one makes cylinders in gingerbread; it is nearly impossible. We tried to wrap gingerbread around a rolling pin and then bake it. It mostly worked but the effort was there for sure.\n' +
      '2023 - This Dr. Seuss was our first big crazy gingerbread build that we fully modelled in CAD beforehand due to the complicated shapes. We utilized some wooden blocks to support the base since the gingerbread was not strong enough.',
  },
]

export const gallery = {
  id: 'more-projects',
  title: 'More',
  accent: 'Projects',
  items: [
    { type: 'photo', caption: 'Custom LEGO Figurine', alt: 'Custom LEGO Figurine', src: `${IMG}/lego-figure.jpg` },
  ],
}
