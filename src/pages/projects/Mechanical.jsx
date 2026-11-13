import PageHeader from '../../components/PageHeader.jsx'
import SectionHeading from '../../components/SectionHeading.jsx'
import ProjectSection from '../../components/project/ProjectSection.jsx'
import CardGrid from '../../components/grids/CardGrid.jsx'
import { header, writeups, machinedParts } from '../../data/projects/mechanical.js'
import styles from './Mechanical.module.css'

export default function Mechanical() {
  return (
    <div className={styles.page}>
      <PageHeader header={header} />
      {writeups.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
      <section id={machinedParts.id} className={styles.gridSection}>
        <SectionHeading title={machinedParts.title} accent={machinedParts.accent} />
        <CardGrid items={machinedParts.items} />
      </section>
    </div>
  )
}
