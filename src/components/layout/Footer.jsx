import contactLinks, { contactHeading } from '../../data/contactLinks.js'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <h2 className={styles.name}>{contactHeading}</h2>
        <ul className={styles.links}>
          {contactLinks.map(({ label, href, external, icon }) => {
            const content = (
              <>
                <img
                  src={icon}
                  alt=""
                  className={styles.icon}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                {label}
              </>
            )
            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className={styles.link}
                  >
                    {content}
                  </a>
                ) : (
                  <span className={`${styles.link} ${styles.plain}`}>{content}</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
