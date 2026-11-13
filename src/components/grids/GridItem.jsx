import MediaBox from '../viewers/MediaBox.jsx'
import mediaType from '../../utils/mediaType.js'
import styles from './GridItem.module.css'

/**
 * GridItem
 *
 * One media item (photo, video, STL model or embed — see MediaBox) inside
 * the box the calling grid (ManualGrid) sized for it.
 *
 * An item with a `caption` shows it centred over the bottom of the media
 * on a soft dark fade, so the photo and its label read as one tile. Embeds
 * put it along the top instead, where it won't cover a video player's
 * controls. The caption never blocks clicks or drags on the media.
 *
 * Props:
 *   item    object   — the media-item descriptor (see src/utils/mediaTiles.js)
 *   style   object   — inline style for the wrapper div (sizing)
 *   onOpen  ((item) => void)?  — open this item in the grid's shared
 *           lightbox, which can step through its sibling items
 */
export default function GridItem({ item, style, onOpen }) {
  const atTop = mediaType(item.src, item.type) === 'iframe'

  return (
    <figure className={styles.itemBox} style={style}>
      <MediaBox item={item} onOpen={onOpen ? () => onOpen(item) : undefined} />
      {item.caption && (
        <figcaption className={`${styles.caption} ${atTop ? styles.captionTop : ''}`}>
          {item.caption}
        </figcaption>
      )}
    </figure>
  )
}
