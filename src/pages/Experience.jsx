import { Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ProjectSection from '../components/project/ProjectSection.jsx'
import CardGrid from '../components/grids/CardGrid.jsx'
import experience from '../data/experience.js'
import NotFound from './NotFound.jsx'
import styles from './Experience.module.css'

/**
 * Experience
 *
 * One page per job (/experience/:jobId), picked from the navbar's
 * Experience dropdown: the job's title block, its write-ups, and cards
 * linking to related projects elsewhere on the site. Bare /experience
 * redirects to the first job; an unknown id shows NotFound.
 */
export default function Experience() {
  const { jobId } = useParams()

  if (!jobId) {
    return <Navigate to={`/experience/${experience[0].id}`} replace />
  }

  const job = experience.find((j) => j.id === jobId)
  if (!job) return <NotFound />

  return (
    <div className={styles.page} key={job.id}>
      <PageHeader header={job.header} />
      {job.writeups.map((project) => (
        <ProjectSection key={project.id} project={project} plain />
      ))}
      {job.related?.length > 0 && (
        <section id="related-projects" className={styles.gridSection}>
          <SectionHeading title="Related" accent="Projects" />
          <CardGrid items={job.related} />
        </section>
      )}
    </div>
  )
}
