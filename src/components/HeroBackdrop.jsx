import styles from './HeroBackdrop.module.css'

/**
 * HeroBackdrop
 *
 * Full-bleed background photo for a title block. Renders absolutely
 * positioned, filling its parent — the parent must be
 * `position: relative` and put its own content above it (z-index: 1).
 *
 * The photo is pinned to the hero's right edge. Photos can be "extended"
 * on the left (extra scenery added so the text has somewhere to sit); that
 * extra strip is dimmed and progressively blurred, and is the first part to
 * crop off on narrower screens. See HeroBackdrop.module.css for the sizing.
 *
 * Props:
 *   image                 string   image src; nothing is rendered without one
 *   nonExtendedPercentage number?  fraction (0–1) of the photo's width, from
 *                                  the right, that is the original photo;
 *                                  1 (default) means it isn't extended
 */
export default function HeroBackdrop({ image, nonExtendedPercentage = 1 }) {
  if (!image) return null
  const extended = nonExtendedPercentage < 1
  return (
    <div
      className={styles.backdrop}
      aria-hidden="true"
      style={{ '--non-ext': nonExtendedPercentage }}
    >
      <div className={styles.frame}>
        <div className={styles.photo}>
          <img src={image} alt="" className={styles.image} loading="eager" decoding="async" />
          {extended && (
            <>
              {[1, 2, 3].map((n) => (
                <img key={n} src={image} alt="" className={`${styles.layer} ${styles[`blur${n}`]}`} />
              ))}
              <div className={`${styles.layer} ${styles.dim}`} />
            </>
          )}
        </div>
      </div>
      <div className={styles.shade} />
    </div>
  )
}
