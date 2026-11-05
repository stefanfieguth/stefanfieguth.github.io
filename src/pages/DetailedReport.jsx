import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ProjectSection from '../components/project/ProjectSection.jsx'
import CardGrid from '../components/grids/CardGrid.jsx'
import detailedReport from '../data/detailedReport.js'
import NotFound from './NotFound.jsx'
import styles from './DetailedReport.module.css'

/**
 * DetailedReport
 *
 * One page per detailed project report (/reports/:reportId), reached from
 * the "View Detailed Project Report" button on a write-up whose `pageLink`
 * names this report: the title block, the report's sections, and cards
 * linking to related projects. An unknown id shows NotFound.
 */
export default function DetailedReport() {
  const { reportId } = useParams()
  const report = detailedReport.find((r) => r.id === reportId)
  if (!report) return <NotFound />

  return (
    <div className={styles.page} key={report.id}>
      <PageHeader header={report.header} />
      {report.writeups.map((section) => (
        <ProjectSection key={section.id} project={section} />
      ))}
      {report.related?.length > 0 && (
        <section id="related-projects" className={styles.gridSection}>
          <SectionHeading title="Related" accent="Projects" />
          <CardGrid items={report.related} />
        </section>
      )}
    </div>
  )
}
