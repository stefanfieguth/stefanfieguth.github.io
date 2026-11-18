import { Link } from 'react-router-dom'
import ManualGrid from '../grids/ManualGrid.jsx'
import SkillTags from '../SkillTags.jsx'
import { reportPath } from '../../data/detailedReport.js'
import styles from './ProjectSection.module.css'

const DEFAULT_GRID_WIDTH = 0.55

// Renders **bold** spans (used for short lead-ins like "**Problem:**")
// inside an otherwise plain line of text.
function renderInline(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// Splits a description on newlines into blocks. Plain lines become
// paragraphs; runs of consecutive lines starting with "- " are grouped into
// a single bulleted list.
function parseDescription(text) {
  const blocks = []
  for (const line of text.split('\n').map((l) => l.trim()).filter(Boolean)) {
    if (line.startsWith('- ')) {
      const prev = blocks[blocks.length - 1]
      const item = line.slice(2)
      if (prev?.type === 'list') prev.items.push(item)
      else blocks.push({ type: 'list', items: [item] })
    } else {
      blocks.push({ type: 'paragraph', text: line })
    }
  }
  return blocks
}

/**
 * ProjectSection
 *
 * Every project renders in the same fixed order: title, subtitle, skills,
 * then a row pairing the media grid (left) with the description (right).
 * `project.gridWidth` (0..1, fraction of the row's width) sets the split;
 * defaults to DEFAULT_GRID_WIDTH. `project.layout: 'stacked'` instead puts
 * the media full width above the description. Projects with no media
 * (project.media is empty) skip the grid column entirely rather than
 * leaving a blank box.
 *
 * The section is anchored by `project.id`, so /page#<id> links straight to it.
 * Buttons at the bottom right of the card:
 *   - `project.projectPage` (a page path, e.g. '/projects/mechanical#crane')
 *     adds "See More Projects Like This" (used on experience pages).
 *   - `project.pageLink` (a report id in src/data/detailedReport.js) adds
 *     "View Detailed Project Report".
 *
 * Props:
 *   project   { id, title, subtitle?, skills?, media?, description?, gridWidth?,
 *               layout?, pageLink?, projectPage? }
 *   plain     no highlighted card; sections are separated by a faint line
 *             (experience and report pages)
 *   compact   buttons sit directly under the description rather than at the
 *             bottom of the card (experience pages' short project cards)
 *   children  optional extra content rendered under the description
 *             (e.g. the Home page's "See all mechanical projects" link)
 */
export default function ProjectSection({ project, plain = false, compact = false, children }) {
  const hasMedia = project.media?.length > 0
  const isStacked = project.layout === 'stacked'
  const gridWidth = isStacked ? 1 : (project.gridWidth ?? DEFAULT_GRID_WIDTH)
  const blocks = project.description ? parseDescription(project.description) : []
  // Compact cards (experience pages) put the buttons right under the short
  // text instead of below the photo, so there's no empty gap.
  const buttonsInText = compact && hasMedia && !isStacked
  const buttons = (project.projectPage || project.pageLink) && (
    <div className={buttonsInText ? `${styles.reportLinkRow} ${styles.inText}` : styles.reportLinkRow}>
      {project.projectPage && (
        <Link to={project.projectPage} className={`${styles.reportLink} ${styles.secondaryLink}`}>
          See More Projects Like This
        </Link>
      )}
      {project.pageLink && (
        <Link to={reportPath(project.pageLink)} className={styles.reportLink}>
          View Detailed Project Report
        </Link>
      )}
    </div>
  )
  const description = (
    <div className={styles.description}>
      {blocks.map((block, i) =>
        block.type === 'list' ? (
          <ul key={i}>
            {block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
          </ul>
        ) : (
          <p key={i}>{renderInline(block.text)}</p>
        )
      )}
      {children}
      {buttonsInText && buttons}
    </div>
  )

  return (
    <section id={project.id} className={plain ? `${styles.section} ${styles.plain}` : styles.section}>
      <div className={styles.card}>
        <h3 className={styles.title}>{project.title}</h3>
        {project.subtitle && <p className={styles.subtitle}>{project.subtitle}</p>}

        <SkillTags skills={project.skills} className={styles.skills} />

        {hasMedia ? (
          <div className={isStacked ? `${styles.body} ${styles.stacked}` : styles.body}>
            <div className={styles.media} style={{ '--grid-width': `${gridWidth * 100}%` }}>
              <ManualGrid items={project.media} />
            </div>
            {description}
          </div>
        ) : description}

        {!buttonsInText && buttons}
      </div>
    </section>
  )
}
