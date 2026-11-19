import PageHeader from '../components/PageHeader.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ProjectSection from '../components/project/ProjectSection.jsx'
import CaptionGrid from '../components/grids/CaptionGrid.jsx'
import JustifiedGallery from '../components/grids/JustifiedGallery.jsx'
import { header, writeups, gallery } from '../data/hobbies.js'
import styles from './Hobbies.module.css'

export default function Hobbies() {
  return (
    <div className={styles.page}>
      <PageHeader header={header} />
      {writeups.map((project) => (
        <ProjectSection key={project.id} project={project}>
          {project.gallery?.length > 0 && (
            <div className={styles.inlineGallery}>
              <JustifiedGallery items={project.gallery} />
            </div>
          )}
        </ProjectSection>
      ))}
      <section id={gallery.id} className={styles.gridSection}>
        <SectionHeading title={gallery.title} accent={gallery.accent} />
        <CaptionGrid items={gallery.items} />
      </section>
    </div>
  )
}
