import AccentTitle from './AccentTitle.jsx'
import styles from './SectionHeading.module.css'

/**
 * SectionHeading
 *
 * Section title (last word(s) in the accent colour) with a short accent
 * bar underneath. Used for "About Me", "General Machined Parts", etc.
 *
 * Props:
 *   title   string?  plain leading text
 *   accent  string?  accent-coloured trailing text
 */
export default function SectionHeading({ title, accent }) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>
        <AccentTitle title={title} accent={accent} />
      </h2>
      <div className={styles.bar} />
    </div>
  )
}
