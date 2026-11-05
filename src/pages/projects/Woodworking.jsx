import PageHeader from '../../components/PageHeader.jsx'
import SectionHeading from '../../components/SectionHeading.jsx'
import ProjectSection from '../../components/project/ProjectSection.jsx'
import CardGrid from '../../components/grids/CardGrid.jsx'
import { header, writeups, generalProjects } from '../../data/projects/woodworking.js'
import styles from './Woodworking.module.css'

export default function Woodworking() {
  return (
    <div className={styles.page}>
      <PageHeader header={header} />
      {writeups.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
      <section id={generalProjects.id} className={styles.gridSection}>
        <SectionHeading title={generalProjects.title} accent={generalProjects.accent} />
        <CardGrid items={generalProjects.items} />
      </section>
    </div>
  )
}
