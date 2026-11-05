import { Link } from 'react-router-dom'
import Lightbox from '../viewers/Lightbox.jsx'
import MediaBox from '../viewers/MediaBox.jsx'
import useLightboxSequence from '../../hooks/useLightboxSequence.js'
import styles from './CardGrid.module.css'

/**
 * CardGrid
 *
 * Responsive grid of cards. Two kinds:
 *
 *   Project cards (General Machined Parts / General Woodworking Projects):
 *     media across the top (photo, video, STL model or embed — see
 *     MediaBox), then tags, title and a short description. Clicking a
 *     photo/video opens it in the lightbox, where Left/Right (or swipe)
 *     steps through the other cards' media.
 *
 *   Link cards (Explore Projects, Related Projects): an item with a `to`
 *     and no media — the whole card is a link, text centred.
 *
 * Props:
 *   items  { id, title, blurb, image?, type?, alt?, tags?, to?,
 *            maximumCutoffRatio?, xMove?, yMove? }[]
 *          — `image` is the media src (any type; `type` overrides the
 *          guess from the file name); the last three adjust a photo's crop
 */
export default function CardGrid({ items }) {
  const mediaItems = items.filter((item) => item.image)
  const lightbox = useLightboxSequence(mediaItems)
  const openItem = lightbox.openItem

  return (
    <>
      <div className={styles.grid}>
        {items.map((item) => {
          const body = (
            <div className={styles.body}>
              {item.tags?.length > 0 && (
                <ul className={styles.tags}>
                  {item.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>{tag}</li>
                  ))}
                </ul>
              )}
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.blurb}>{item.blurb}</p>
            </div>
          )

          if (item.to && !item.image) {
            return (
              <Link key={item.id} to={item.to} className={`${styles.card} ${styles.linkCard}`}>
                {body}
              </Link>
            )
          }

          return (
            <article key={item.id} className={styles.card}>
              {item.image && (
                <div className={styles.media}>
                  <MediaBox
                    item={{ ...item, src: item.image, alt: item.alt ?? item.title }}
                    onOpen={() => lightbox.open(item)}
                  />
                </div>
              )}
              {item.to ? <Link to={item.to} className={styles.bodyLink}>{body}</Link> : body}
            </article>
          )
        })}
      </div>

      {openItem && (
        <Lightbox
          src={openItem.image}
          type={openItem.type}
          alt={openItem.alt ?? openItem.title}
          onClose={lightbox.close}
          onPrev={lightbox.prev}
          onNext={lightbox.next}
        />
      )}
    </>
  )
}
