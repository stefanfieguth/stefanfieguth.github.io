/**
 * Parses an aspect-ratio config value into a numeric width/height ratio.
 * Accepts a number (1.778), a CSS-style string ('16 / 9', '16/9'), or a
 * single number as a string ('1.778'). Falls back to 16:9 if unparseable.
 */
export function parseAspectRatio(value, fallback = 16 / 9) {
  if (typeof value === 'number' && value > 0) return value

  if (typeof value === 'string') {
    const parts = value.split('/').map(s => parseFloat(s.trim()))
    if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
      return parts[0] / parts[1]
    }
    const single = parseFloat(value)
    if (single > 0) return single
  }

  return fallback
}
