/**
 * youtube.js
 *
 * Turns a YouTube video id or link (watch, youtu.be, shorts, embed;
 * unlisted videos work too) into an embed URL that starts playing.
 * Returns null if nothing usable was given.
 */
const ID = /^[\w-]{11}$/

export function youtubeId(value = '') {
  const v = value.trim()
  if (!v) return null
  if (ID.test(v)) return v
  const match = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/)
  return match ? match[1] : null
}

export function youtubeEmbed(value) {
  const id = youtubeId(value)
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`
    : null
}
