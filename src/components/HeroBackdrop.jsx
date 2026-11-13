import styles from './HeroBackdrop.module.css'

/**
 * HeroBackdrop
 *
 * Full-bleed background photo for a title block, darkened with a navy
 * gradient so the text on top stays readable. Renders absolutely
 * positioned, filling its parent — the parent must be
 * `position: relative` and put its own content above it (z-index: 1).
 *
 * Props:
 *   image     string   image src; nothing is rendered without one
 *   position  string?  CSS object-position for the crop (default 'center')
 */
export default function HeroBackdrop({ image, position = 'center' }) {
  if (!image) return null
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <img
        src={image}
        alt=""
        className={styles.image}
        style={{ objectPosition: position }}
        loading="eager"
        decoding="async"
      />
      <div className={styles.shade} />
    </div>
  )
}
