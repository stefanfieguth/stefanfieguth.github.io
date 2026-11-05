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
  eyebrow: 'Placeholder · Eyebrow · Text',
  title: 'Other',
  accent: 'Projects',
  intro: 'Placeholder introduction for the Other Projects page. Replace this text in src/data/projects/other.js.',
  heroImage: PLACEHOLDER.hero,
  heroPosition: 'center',
}

export const writeups = [
  {
    id: 'placeholder-project-1',
    title: 'Placeholder Project One',
    subtitle: 'Placeholder subtitle · Personal Project · Year',
    skills: ['Placeholder Skill', 'Placeholder Skill 2', 'Placeholder Skill 3'],
    media: [
      wide(0, PLACEHOLDER.wide, 'Placeholder image', 'Placeholder caption'),
      tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
      tile(1, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
    ],
    description:
      'Placeholder paragraph describing the project. Replace this text in src/data/projects/other.js.\n' +
      'A second placeholder paragraph.',
  },
  {
    id: 'placeholder-project-2',
    title: 'Placeholder Project Two',
    subtitle: 'Placeholder subtitle · Personal Project · Year',
    skills: ['Placeholder Skill', 'Placeholder Skill 2'],
    media: [
      tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
      tile(0, PLACEHOLDER.photo, 'Placeholder image', 'Placeholder caption'),
    ],
    description:
      'Placeholder paragraph describing the project. Replace this text in src/data/projects/other.js.',
  },
]

export const gallery = {
  id: 'more-projects',
  title: 'More',
  accent: 'Projects',
  items: [
    { type: 'photo', caption: 'Placeholder Caption 1', alt: 'Placeholder image', src: PLACEHOLDER.photo },
    { type: 'photo', caption: 'Placeholder Caption 2', alt: 'Placeholder image', src: PLACEHOLDER.photo },
    { type: 'photo', caption: 'Placeholder Caption 3', alt: 'Placeholder image', src: PLACEHOLDER.photo },
    { type: 'photo', caption: 'Placeholder Caption 4', alt: 'Placeholder image', src: PLACEHOLDER.photo },
  ],
}
