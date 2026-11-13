import { Link } from 'react-router-dom'
import ManualGrid from '../grids/ManualGrid.jsx'
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
 * If `project.pageLink` names a report in src/data/detailedReport.js, a
 * "View Detailed Project Report" button linking to it sits at the bottom
 * right of the card.
 *
 * Props:
 *   project   { id, title, subtitle?, skills?, media?, description?, gridWidth?,
 *               layout?, pageLink? }
 *   plain     no highlighted card; sections are separated by a faint line
 *             (experience and report pages)
 *   children  optional extra content rendered under the description
 *             (e.g. the Home page's "See all mechanical projects" link)
 */
export default function ProjectSection({ project, plain = false, children }) {
  const hasMedia = project.media?.length > 0
  const isStacked = project.layout === 'stacked'
  const gridWidth = isStacked ? 1 : (project.gridWidth ?? DEFAULT_GRID_WIDTH)
  const blocks = project.description ? parseDescription(project.description) : []
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
    </div>
  )

  return (
    <section id={project.id} className={plain ? `${styles.section} ${styles.plain}` : styles.section}>
      <div className={styles.card}>
        <h3 className={styles.title}>{project.title}</h3>
        {project.subtitle && <p className={styles.subtitle}>{project.subtitle}</p>}

        {project.skills?.length > 0 && (
          <ul className={styles.skills}>
            {project.skills.map((skill) => (
              <li key={skill} className={styles.skillTag}>{skill}</li>
            ))}
          </ul>
        )}

        {hasMedia ? (
          <div className={isStacked ? `${styles.body} ${styles.stacked}` : styles.body}>
            <div className={styles.media} style={{ '--grid-width': `${gridWidth * 100}%` }}>
              <ManualGrid items={project.media} />
            </div>
            {description}
          </div>
        ) : description}

        {project.pageLink && (
          <div className={styles.reportLinkRow}>
            <Link to={reportPath(project.pageLink)} className={styles.reportLink}>
              View Detailed Project Report
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
