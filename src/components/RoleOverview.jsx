import SectionHeading from './SectionHeading.jsx'
import SkillTags from './SkillTags.jsx'
import styles from './RoleOverview.module.css'

// "https://www.werkrtractors.com/" -> "werkrtractors.com"
const displayUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

// **bold** spans, same convention as project descriptions.
const renderInline = (text) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))

/**
 * RoleOverview
 *
 * The role summary at the top of each experience page, under the title
 * block, styled like the rest of the page (no box): one line of facts
 * (role, location, company website), a short paragraph about the work, and
 * the key skills as the same pill tags as the project pages. Then an
 * optional "Responsibilities" bullet list, and a faint line leading into
 * the job's projects below it.
 *
 * Props:
 *   overview          { role?, location?, website?, skills?, summary? }
 *   responsibilities  string[]? bullet points (**bold** supported)
 *   divider           true = faint line at the bottom, leading into the
 *                     projects (left out when there are none)
 */
export default function RoleOverview({ overview, responsibilities, divider = false }) {
  const facts = [
    { label: 'Role', value: overview.role },
    { label: 'Location', value: overview.location },
    overview.website && {
      label: 'Website',
      value: (
        <a href={overview.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {displayUrl(overview.website)}
          <span aria-hidden="true"> ↗</span>
        </a>
      ),
    },
  ].filter((fact) => fact && fact.value)

  const paragraphs = (overview.summary ?? '').split('\n').map((p) => p.trim()).filter(Boolean)

  return (
    <div id="role" className={styles.wrap}>
      {facts.length > 0 && (
        <dl className={styles.facts}>
          {facts.map(({ label, value }) => (
            <div key={label} className={styles.fact}>
              <dt className={styles.label}>{label}</dt>
              <dd className={styles.value}>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {paragraphs.length > 0 && (
        <div className={styles.summary}>
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}

      <SkillTags skills={overview.skills} />

      {responsibilities?.length > 0 && (
        <div className={styles.block}>
          <SectionHeading accent="Responsibilities" />
          <ul className={styles.list}>
            {responsibilities.map((item, i) => (
              <li key={i} className={styles.item}>{renderInline(item)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Same faint line that separates the projects below from each other. */}
      {divider && <div className={styles.divider} />}
    </div>
  )
}
