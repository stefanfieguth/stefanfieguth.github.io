import styles from './SkillGrid.module.css'

/**
 * SkillGrid
 *
 * Responsive grid of skill cards, each a short heading over a list of
 * skills. Used for the Home page's Key Skills.
 *
 * Props:
 *   groups  { title: string, items: string[] }[]
 */
export default function SkillGrid({ groups }) {
  return (
    <div className={styles.grid}>
      {groups.map(({ title, items }) => (
        <div key={title} className={styles.card}>
          <h3 className={styles.title}>{title}</h3>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item} className={styles.item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
