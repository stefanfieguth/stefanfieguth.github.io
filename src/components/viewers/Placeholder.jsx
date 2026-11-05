import styles from './Placeholder.module.css'

/**
 * Placeholder
 *
 * Stand-in box for media that doesn't exist yet, filling its parent's box
 * (100% × 100%). Shared by CaptionGrid, CardGrid, and Hero.
 *
 * Props:
 *   label    string   — e.g. 'Image needed'
 *   note     string?  — smaller second line, e.g. what file is needed
 *   variant  'tile' | 'banner'  (default 'tile') — 'tile' is a dashed
 *            outline with a small label, for grid cells/cards; 'banner' is
 *            borderless with a larger label, for Hero
 */
export default function Placeholder({ label, note, variant = 'tile' }) {
  return (
    <div className={`${styles.placeholder} ${styles[variant]}`}>
      <span className={styles.label}>{label}</span>
      {note && <span className={styles.note}>{note}</span>}
    </div>
  )
}
