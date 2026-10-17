import type { AccessibilityConfig, Page, UserProfile } from '../types'

interface Props {
  navigate: (page: Page) => void
  goBack: () => void
  a11y: AccessibilityConfig
  onUpdate: (config: AccessibilityConfig) => void
  user: UserProfile | null
}

export default function Settings({ navigate, goBack, a11y, onUpdate, user }: Props) {
  const setLanguage = (language: AccessibilityConfig['language']) => onUpdate({ ...a11y, language })
  return (
    <div className="page-shell settings-hub">
      <button className="back-link" onClick={goBack}>← Back</button>
      <header className="page-hero page-hero--compact">
        <p className="eyebrow">Your preferences</p><h1>Settings</h1>
        <p>Manage your account, language, privacy, and accessibility in one place.</p>
      </header>
      <div className="settings-hub__grid">
        <section><h2>Account Settings</h2><p>{user ? <>{user.name}<br />{user.email}</> : 'Log in to manage personal information and saved trips. Accessibility preferences work without an account.'}</p><button onClick={() => navigate(user ? 'account' : 'auth')}>{user ? 'Personal information' : 'Log in'} →</button>{user && <><button onClick={() => alert('A password reset link has been prepared for your email address.')}>Password →</button><button onClick={() => alert('Notification preferences saved for this prototype.')}>Notifications →</button></>}</section>
        <section><h2>Appearance & Accessibility</h2><p>Theme, font, spacing, icon size and live preview.</p><button onClick={() => navigate('appearance')}>Open appearance settings →</button></section>
        <section><h2>Language</h2><div className="language-choice">{(['english', 'hindi', 'marathi'] as const).map((language, index) => <button className={a11y.language === language ? 'active' : ''} onClick={() => setLanguage(language)} key={language}>{['English', 'हिन्दी', 'मराठी'][index]}</button>)}</div></section>
        <section><h2>Help & privacy</h2><p>Your prototype data stays in this browser and is never submitted.</p><button onClick={() => navigate('help')}>Help & FAQ →</button><button onClick={() => alert('Privacy preferences are up to date.')}>Review privacy preferences →</button></section>
      </div>
    </div>
  )
}
