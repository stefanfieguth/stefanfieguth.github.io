import PageHeader from '../../components/PageHeader.jsx'
import ProjectSection from '../../components/project/ProjectSection.jsx'
import { header, writeups } from '../../data/projects/electrical.js'
import styles from './Electrical.module.css'

export default function Electrical() {
  return (
    <div className={styles.page}>
      <PageHeader header={header} />
      {writeups.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
    </div>
  )
}
