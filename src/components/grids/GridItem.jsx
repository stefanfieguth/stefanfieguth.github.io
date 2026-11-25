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
 *   onOpen  ((item, snapshot?) => void)?  — open this item in the grid's
 *           shared lightbox, which can step through its sibling items
 */
export default function GridItem({ item, style, onOpen }) {
  // Embeds and 3D models with a slider underneath put the caption along
  // the top, where it won't cover the player controls / slider.
  const type = mediaType(item.src, item.type)
  const atTop = type === 'iframe' || type === 'gltfProgression' || type === 'gltfInternal'

  return (
    <figure className={styles.itemBox} style={style}>
      <MediaBox item={item} onOpen={onOpen ? (snapshot) => onOpen(item, snapshot) : undefined} />
      {item.caption && (
        <figcaption className={`${styles.caption} ${atTop ? styles.captionTop : ''}`}>
          {item.caption}
        </figcaption>
      )}
    </figure>
  )
}
