import styles from './STLViewer.module.css'

/**
 * STLViewerFallback
 *
 * Same-sized box shown while STLViewer's lazy chunk (and three.js) loads.
 * Kept in its own file so importing it doesn't pull STLViewer into the
 * page's bundle.
 *
 * Props:
 *   fill  boolean? — fill the parent box, matching STLViewer's `fill`
 */
export default function STLViewerFallback({ fill = false }) {
  return (
    <div className={fill ? `${styles.wrapper} ${styles.fill}` : styles.wrapper}>
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner} />
        {!fill && <span className={styles.loadingText}>Loading viewer…</span>}
      </div>
    </div>
  )
}
