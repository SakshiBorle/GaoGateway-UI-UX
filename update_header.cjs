const fs = require('fs')

let code = fs.readFileSync('src/components/Header.tsx', 'utf8')

code = code.replace(
  `export default function Header({ currentPage, navigate, a11y, onUpdateA11y, user, onOpenA11y, onOpenReadAloud }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [languageNotice, setLanguageNotice] = useState('')
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setLanguageOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])`,
  `export default function Header({ currentPage, navigate, a11y, onUpdateA11y, user, onOpenA11y, onOpenReadAloud, onLogout }: HeaderProps) {
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
  }, [])`
)

code = code.replace(
  `  const go = (page: Page) => {
    navigate(page)
    setMenuOpen(false)
    setLanguageOpen(false)
  }`,
  `  const go = (page: Page) => {
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
  }`
)

code = code.replace(
  `        <div className="header-actions">
          <button className="icon-button has-tooltip profile-action" data-speech="profile" data-speech-click="Profile. View your bookings, saved trips and itineraries." data-tooltip="Open your profile" title="Open your profile" onClick={() => go(user?.role === 'admin' ? 'admin' : user ? 'account' : 'auth')} aria-label={translate(a11y.language, 'profile')}>
            <span aria-hidden="true">👤</span>
          </button>
          <button className="icon-button has-tooltip settings-action" data-speech="settings" data-speech-click="Settings. Customize your website preferences." data-tooltip="Open settings" title="Open settings" onClick={() => go('settings')} aria-label={translate(a11y.language, 'settings')}>
            <span aria-hidden="true">⚙️</span>
          </button>
          <div className="profile-menu" ref={profileRef}>`,
  `        <div className="header-actions">
          <button
            className="nav-link"
            style={{ padding: '0.4rem 0.8rem', background: a11y.hoverReadAloud ? '#e8f5e9' : '#ffebee', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}
            onClick={toggleHoverSpeech}
            aria-label={\`Toggle hover read-aloud. Currently \${a11y.hoverReadAloud ? 'ON' : 'OFF'}\`}
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
          <div className="profile-menu" ref={languageRef}>`
)

fs.writeFileSync('src/components/Header.tsx', code)
