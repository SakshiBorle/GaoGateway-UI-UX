import type { Page } from '../types'

interface FooterProps {
  navigate: (page: Page) => void
}

export default function Footer({ navigate }: FooterProps) {
  const links: { label: string; page: Page }[] = [
    { label: 'Stay', page: 'stay' },
    { label: 'Experiences', page: 'experiences' },
    { label: 'Farm Store', page: 'farm-store' },
    { label: 'Our Story', page: 'about' },
    { label: 'Reviews', page: 'reviews' },
    { label: 'Contact', page: 'contact' },
    { label: 'Help / FAQ', page: 'help' },
  ]

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="footer-brand">
          <img src="/gaongetaway-logo.png" alt="GaonGetaway" />
          <p>A quieter rhythm, local food, and honest countryside hospitality near Pune.</p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <div className="footer-links">
            {links.map(link => <button key={link.label} onClick={() => navigate(link.page)}>{link.label}</button>)}
          </div>
        </div>
        <div className="footer-contact">
          <p className="footer-label">Visit us</p>
          <p>Mulshi countryside<br />Pune, Maharashtra</p>
          <p>+91 98765 43210<br />hello@gaongetaway.in</p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© 2026 GaonGetaway</span>
        <span>Made with care for the land and its people.</span>
      </div>
    </footer>
  )
}
