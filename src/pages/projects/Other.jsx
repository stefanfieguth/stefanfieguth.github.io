import PageHeader from '../../components/PageHeader.jsx'
import SectionHeading from '../../components/SectionHeading.jsx'
import ProjectSection from '../../components/project/ProjectSection.jsx'
import CaptionGrid from '../../components/grids/CaptionGrid.jsx'
import { header, writeups, gallery } from '../../data/projects/other.js'
import styles from './Other.module.css'

export default function Other() {
  return (
    <div className={styles.page}>
      <PageHeader header={header} />
      {writeups.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
      <section id={gallery.id} className={styles.gridSection}>
        <SectionHeading title={gallery.title} accent={gallery.accent} />
        <CaptionGrid items={gallery.items} />
      </section>
    </div>
  )
}
