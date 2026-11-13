import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import HeroBackdrop from '../components/HeroBackdrop.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import FeaturedGrid from '../components/grids/FeaturedGrid.jsx'
import STLViewerFallback from '../components/viewers/STLViewerFallback.jsx'
import { intro, model, featured, about, skills, explore, experience as experienceHeading } from '../data/home.js'
import jobs from '../data/experience.js'
import styles from './Home.module.css'

// Code-split so three.js only downloads once the Home page actually renders
// the viewer, not as part of the main bundle every route shares.
const STLViewer = lazy(() => import('../components/viewers/STLViewer.jsx'))

// Up to two initials for a job card without a logo.
const initials = (name) => {
  const words = name.split(/\s+/).filter(Boolean)
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase()
}

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <HeroBackdrop image={intro.heroImage} position={intro.heroPosition} />

        <div className={styles.intro}>
          <div className={styles.summary}>
            <div>
              <p className={styles.eyebrow}>{intro.eyebrow}</p>
              <h1 className={styles.name}>
                {intro.nameLines.map((line, i) => (
                  <span key={line}>{i > 0 && <br />}{line}</span>
                ))}
              </h1>
              <p className={styles.subtitle}>{intro.subtitle}</p>
            </div>

            <ul className={styles.tags}>
              {intro.tags.map((tag) => (
                <li key={tag} className={styles.tag}>{tag}</li>
              ))}
            </ul>

            <p className={styles.bio}>{intro.bio}</p>
          </div>

          <figure className={styles.viewer}>
            <Suspense fallback={<STLViewerFallback />}>
              <STLViewer src={model.src} hint={model.hint} />
            </Suspense>
            <figcaption className={styles.viewerCaption}>{model.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={styles.about}>
          <SectionHeading title={about.title} accent={about.accent} />
          {about.columns.flat().map((paragraph) => (
            <p key={paragraph} className={styles.aboutBody}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.featured}>
          <SectionHeading title={featured.title} accent={featured.accent} />
          <FeaturedGrid items={featured.items} />
          <nav className={styles.browse} aria-label={explore.label}>
            <span className={styles.browseLabel}>{explore.label}</span>
            {explore.items.map((item) => (
              <Link key={item.id} to={item.to} className={styles.browseLink}>{item.title}</Link>
            ))}
          </nav>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading title={experienceHeading.title} accent={experienceHeading.accent} />
        <ul className={styles.jobs}>
          {jobs.map((job) => {
            const name = [job.header.title, job.header.accent].filter(Boolean).join(' ')
            return (
              <li key={job.id}>
                <Link to={`/experience/${job.id}`} className={styles.job}>
                  <span className={styles.jobLogo} aria-hidden="true">
                    {job.logo ? <img src={job.logo} alt="" /> : initials(name)}
                  </span>
                  <span className={styles.jobText}>
                    <span className={styles.jobName}>{name}</span>
                    <span className={styles.jobRole}>{job.header.eyebrow}</span>
                  </span>
                  <span className={styles.jobArrow} aria-hidden="true">→</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.section}>
        <SectionHeading title={skills.title} accent={skills.accent} />
        <div className={styles.skills}>
          {skills.groups.map((group) => (
            <div key={group.title} className={styles.skillGroup}>
              <h3 className={styles.skillTitle}>{group.title}</h3>
              <ul className={styles.skillItems}>
                {group.items.map((item) => (
                  <li key={item} className={styles.skillItem}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
