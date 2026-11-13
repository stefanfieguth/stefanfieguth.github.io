import { Link } from 'react-router-dom'
import MediaFrame from '../viewers/MediaFrame.jsx'
import styles from './FeaturedGrid.module.css'

/**
 * FeaturedGrid
 *
 * Home page "Featured Projects": compact photo tiles with the title over
 * the photo. Each tile links to the project's section on its project page
 * (e.g. /projects/mechanical#crane).
 *
 * Props:
 *   items  { id, title, category?, blurb?, image, alt?, to,
 *            maximumCutoffRatio?, xMove?, yMove? }[]
 */
export default function FeaturedGrid({ items }) {
  return (
    <ul className={styles.grid}>
      {items.map((item) => (
        <li key={item.id}>
          <Link to={item.to} className={styles.tile} title={item.blurb}>
            <MediaFrame
              src={item.image}
              alt={item.alt ?? item.title}
              maximumCutoffRatio={item.maximumCutoffRatio}
              xMove={item.xMove}
              yMove={item.yMove}
            />
            <span className={styles.overlay}>
              {item.category && <span className={styles.category}>{item.category}</span>}
              <span className={styles.title}>{item.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
