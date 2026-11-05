import { Link } from 'react-router-dom'
import { PLACEHOLDER } from '../utils/mediaTiles.js'
import styles from './NotFound.module.css'

// ⚠ TEMPORARY: replace with a real image, e.g. '/assets/images/404.jpg'
// for the file public/assets/images/404.jpg.
const NOT_FOUND_IMAGE = PLACEHOLDER.photo

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <img className={styles.image} src={NOT_FOUND_IMAGE} alt="" />
        <h1 className={styles.heading}>404 — Page Not Found</h1>
        <p className={styles.body}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className={styles.homeButton}>Return Home</Link>
      </div>
    </div>
  )
}
