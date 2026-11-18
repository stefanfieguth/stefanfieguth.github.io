import styles from './SkillTags.module.css'

/**
 * SkillTags
 *
 * A wrapping row of cyan pill tags, one per skill. Used under every
 * project's subtitle (ProjectSection) and in each job's role overview
 * (RoleOverview), so the two always look the same.
 *
 * Props:
 *   skills     string[]
 *   className  optional extra class (e.g. to change the spacing below)
 */
export default function SkillTags({ skills, className }) {
  if (!skills?.length) return null
  return (
    <ul className={className ? `${styles.skills} ${className}` : styles.skills}>
      {skills.map((skill) => (
        <li key={skill} className={styles.tag}>{skill}</li>
      ))}
    </ul>
  )
}
