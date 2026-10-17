import { useEffect, useRef, useState } from 'react'
import type { AccessibilityConfig, CartItem, Page, UserProfile } from '../types'
import { translate } from '../i18n'
import { speak } from '../speech'

interface HeaderProps {
  currentPage: Page
  navigate: (page: Page, data?: any) => void
  cart: CartItem[]
  onOpenA11y: () => void
  onOpenVoice: () => void
  onOpenReadAloud: () => void
  a11y: AccessibilityConfig
  onUpdateA11y: (config: AccessibilityConfig) => void
  user: UserProfile | null
  onLogout: () => void
}

const navItems: { label: 'stay' | 'experiences' | 'dining' | 'store' | 'story' | 'reviews'; page: Page }[] = [
  { label: 'stay', page: 'stay' },
  { label: 'experiences', page: 'experiences' },
  { label: 'dining', page: 'experiences' },
  { label: 'store', page: 'farm-store' },
  { label: 'story', page: 'about' },
  { label: 'reviews', page: 'reviews' },
]

export default function Header({ currentPage, navigate, a11y, onUpdateA11y, user, onOpenA11y, onOpenReadAloud, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [languageNotice, setLanguageNotice] = useState('')
  const languageRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) setLanguageOpen(false)
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setAccountMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const go = (page: Page) => {
    navigate(page)
    setMenuOpen(false)
    setLanguageOpen(false)
    setAccountMenuOpen(false)
  }

  const handleLogout = () => {
    setAccountMenuOpen(false)
    onLogout()
  }

  const toggleHoverSpeech = () => {
    const enabled = !a11y.hoverReadAloud
    onUpdateA11y({ ...a11y, hoverReadAloud: enabled })
  }

  const changeLanguage = (language: AccessibilityConfig['language'], name: string) => {
    onUpdateA11y({ ...a11y, language })
    speak(name, language)
    setLanguageNotice(name)
    setLanguageOpen(false)
    window.setTimeout(() => setLanguageNotice(''), 2400)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button className="brand-mark" onClick={() => go('home')} aria-label="GaonGetaway home">
          <img src="/gaongetaway-logo.png" alt="GaonGetaway" />
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(item => (
            <button
              key={item.label}
              className={currentPage === item.page ? 'nav-link nav-link--active' : 'nav-link'}
              onClick={() => go(item.page)}
              aria-current={currentPage === item.page ? 'page' : undefined}
            >
              {translate(a11y.language, item.label)}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="nav-link"
            style={{ padding: '0.4rem 0.8rem', background: a11y.hoverReadAloud ? '#e8f5e9' : '#ffebee', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}
            onClick={toggleHoverSpeech}
            aria-label={`Toggle hover read-aloud. Currently ${a11y.hoverReadAloud ? 'ON' : 'OFF'}`}
          >
            Hover Read-Aloud: {a11y.hoverReadAloud ? 'ON' : 'OFF'}
          </button>

          {!user ? (
            <button className="nav-link" style={{ fontWeight: 600 }} onClick={() => go('auth')}>
              Login
            </button>
          ) : (
            <div className="profile-menu" ref={accountRef}>
              <button className="icon-button has-tooltip profile-action" data-speech="profile" data-speech-click="Profile. View your bookings, saved trips and itineraries." data-tooltip="Open your profile" title="Open your profile" onClick={() => setAccountMenuOpen(!accountMenuOpen)} aria-label={translate(a11y.language, 'profile')} aria-expanded={accountMenuOpen}>
                <span aria-hidden="true">👤</span>
              </button>
              {accountMenuOpen && (
                <div className="profile-popover language-popover" style={{ right: 0 }}>
                  <button onClick={() => go('account')}>Profile</button>
                  {user.role === 'admin' && <button onClick={() => go('admin')}>Admin</button>}
                  <button onClick={handleLogout} style={{ color: '#8B1A1A', fontWeight: 600 }}>Logout</button>
                </div>
              )}
            </div>
          )}

          <button className="icon-button has-tooltip settings-action" data-speech="settings" data-speech-click="Settings. Customize your website preferences." data-tooltip="Open settings" title="Open settings" onClick={() => go('settings')} aria-label={translate(a11y.language, 'settings')}>
            <span aria-hidden="true">⚙️</span>
          </button>
          <div className="profile-menu" ref={languageRef}>
            <button className="icon-button has-tooltip" data-speech="language" data-speech-click="Language. Choose your preferred language." data-tooltip="Change language" title="Change language" onClick={() => setLanguageOpen(value => !value)} aria-label={translate(a11y.language, 'language')} aria-expanded={languageOpen}>
              <span aria-hidden="true">🌐</span>
            </button>
            {languageOpen && (
              <div className="profile-popover language-popover">
                <button aria-label="English" onClick={() => changeLanguage('english', 'English')}>English</button>
                <button aria-label="Hindi" onClick={() => changeLanguage('hindi', 'Hindi')}>हिन्दी</button>
                <button aria-label="Marathi" onClick={() => changeLanguage('marathi', 'Marathi')}>मराठी</button>
              </div>
            )}
          </div>
          <button className="icon-button has-tooltip accessibility-action" data-speech="accessibility" data-tooltip="Accessibility settings" title="Accessibility settings" onClick={onOpenA11y} aria-label="Accessibility settings">
            <span aria-hidden="true">Aa</span>
          </button>
          <button className="icon-button has-tooltip" data-speech="read aloud" data-tooltip="Read this page aloud" title="Read this page aloud" onClick={onOpenReadAloud} aria-label="Read aloud">
            <span aria-hidden="true">◖</span>
          </button>
          <button className="button button--primary header-book" onClick={() => go('booking-flow')}>{translate(a11y.language, 'book')}</button>
          <button className="menu-button" onClick={() => setMenuOpen(value => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav">
          {navItems.map(item => <button key={item.label} onClick={() => go(item.page)}>{translate(a11y.language, item.label)}</button>)}
          <button onClick={() => go('settings')}>{translate(a11y.language, 'settings')}</button>
          <button onClick={onOpenA11y}>Accessibility</button>
          <button className="button button--primary" onClick={() => go('booking-flow')}>{translate(a11y.language, 'book')}</button>
        </div>
      )}
      {languageNotice && <div className="language-toast" role="status"><strong>✓ {a11y.language === 'english' ? 'Language changed' : 'भाषा बदलली'}</strong><span>{a11y.language === 'english' ? `Website language changed to ${languageNotice}.` : `${languageNotice} निवडली आहे.`}</span></div>}
    </header>
  )
}
