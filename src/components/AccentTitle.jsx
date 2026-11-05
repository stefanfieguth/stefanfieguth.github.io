/**
 * AccentTitle
 *
 * Heading text whose last word(s) are set in the accent color, e.g.
 * "Mechanical <Engineering>" or "About <Me>". Renders inline content only;
 * the caller supplies the heading element.
 *
 * Props:
 *   title   string?  — plain leading text (may be empty)
 *   accent  string?  — accent-colored trailing text
 */
export default function AccentTitle({ title, accent }) {
  return (
    <>
      {title}
      {title && accent ? ' ' : null}
      {accent && <span className="text-accent">{accent}</span>}
    </>
  )
}
