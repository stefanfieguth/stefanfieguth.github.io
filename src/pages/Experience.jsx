import { Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import RoleOverview from '../components/RoleOverview.jsx'
import ProjectSection from '../components/project/ProjectSection.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import CaptionGrid from '../components/grids/CaptionGrid.jsx'
import JustifiedGallery from '../components/grids/JustifiedGallery.jsx'
import experience from '../data/experience.js'
import NotFound from './NotFound.jsx'
import styles from './Experience.module.css'

const PROJECTS_TITLE = { title: 'Key', accent: 'Projects' }

/**
 * Experience
 *
 * One page per job (/experience/:jobId), picked from the navbar's
 * Experience dropdown: the job's title block, a role overview (title,
 * location, website, key skills, summary), then the projects done there,
 * each with its own "See More Projects Like This" / "View Detailed Project
 * Report" buttons, and an optional photo gallery. Bare /experience redirects to the first job; an unknown
 * id shows NotFound.
 */
export default function Experience() {
  const { jobId } = useParams()

  if (!jobId) {
    return <Navigate to={`/experience/${experience[0].id}`} replace />
  }

  const job = experience.find((j) => j.id === jobId)
  if (!job) return <NotFound />

  const hasProjects = job.writeups.length > 0

  return (
    <div className={styles.page} key={job.id}>
      <PageHeader header={job.header} />
      {job.overview && (
        <RoleOverview
          overview={job.overview}
          responsibilities={job.responsibilities}
          projectsTitle={hasProjects ? PROJECTS_TITLE : null}
        />
      )}
      {job.writeups.map((project) => (
        <ProjectSection key={project.id} project={project} plain compact />
      ))}
      {job.gallery?.items.length > 0 && (
        <section id={job.gallery.id} className={styles.gridSection}>
          <SectionHeading title={job.gallery.title} accent={job.gallery.accent} />
          {job.gallery.large
            ? <JustifiedGallery items={job.gallery.items} />
            : <CaptionGrid items={job.gallery.items} />}
        </section>
      )}
    </div>
  )
}
