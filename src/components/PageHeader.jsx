import AccentTitle from './AccentTitle.jsx'
import HeroBackdrop from './HeroBackdrop.jsx'
import styles from './PageHeader.module.css'

/**
 * PageHeader
 *
 * Title block at the top of each project and experience page: a hero photo
 * in the background, a small uppercase eyebrow line, the page title (last
 * word in the accent colour) and a short intro.
 *
 * Props:
 *   header  { eyebrow, title, accent, intro, heroImage?, nonExtendedPercentage?,
 *             textShadow?, darkenedBehindText? }
 *           — see src/data/projects/*.js and src/data/experience.js
 */
export default function PageHeader({ header }) {
  const { eyebrow, title, accent, intro, heroImage, nonExtendedPercentage, textShadow, darkenedBehindText } = header
  const className = [
    styles.header,
    textShadow && styles.textShadow,
    darkenedBehindText && styles.darkened,
  ].filter(Boolean).join(' ')
  return (
    <header className={className}>
      <HeroBackdrop image={heroImage} nonExtendedPercentage={nonExtendedPercentage} />
      <div className={styles.inner}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>
          <AccentTitle title={title} accent={accent} />
        </h1>
        {intro && <p className={styles.intro}>{intro}</p>}
      </div>
    </header>
  )
}
