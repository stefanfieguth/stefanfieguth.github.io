import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import HeroBackdrop from '../components/HeroBackdrop.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ProjectSection from '../components/project/ProjectSection.jsx'
import CardGrid from '../components/grids/CardGrid.jsx'
import SkillGrid from '../components/grids/SkillGrid.jsx'
import STLViewerFallback from '../components/viewers/STLViewerFallback.jsx'
import { intro, model, featured, about, skills, explore } from '../data/home.js'
import styles from './Home.module.css'

// Code-split so three.js only downloads once the Home page actually renders
// the viewer, not as part of the main bundle every route shares.
const STLViewer = lazy(() => import('../components/viewers/STLViewer.jsx'))

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

      <section className={styles.featured} aria-labelledby="featured-heading">
        <h2 id="featured-heading" className={styles.featuredBadge}>{featured.heading}</h2>
        <ProjectSection project={featured.project}>
          <Link to={featured.cta.to} className={styles.cta}>{featured.cta.label}</Link>
        </ProjectSection>
      </section>

      <section className={styles.section}>
        <SectionHeading title={about.title} accent={about.accent} />
        <div className={styles.aboutColumns}>
          {about.columns.map((paragraphs, i) => (
            <div key={i}>
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.aboutBody}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading title={skills.title} accent={skills.accent} />
        <SkillGrid groups={skills.groups} />
      </section>

      <section className={styles.section}>
        <SectionHeading title={explore.title} accent={explore.accent} />
        <CardGrid items={explore.items} />
      </section>
    </div>
  )
}
