import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.heading}>404 — Page Not Found</h1>
        <p className={styles.body}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className={styles.homeButton}>Return Home</Link>
      </div>
    </div>
  )
}
