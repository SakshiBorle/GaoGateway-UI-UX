import type { Page, UserProfile, BookingState, CartItem, AccessibilityConfig } from '../types'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  user: UserProfile
  onLogout: () => void
  a11y: AccessibilityConfig
  onOpenA11y: () => void
}

export default function Account({ navigate, goBack, user, onLogout, onOpenA11y }: Props) {
  const A11Y_LABELS: Record<string, string> = {
    wheelchair: '♿ Wheelchair accessibility',
    audio: '🔊 Audio assistance',
    visual: '👁️ Visual assistance',
    'easy-walk': '🚶 Easy walking',
    other: '📝 Other accessibility needs',
    'ground-floor': '🏠 Ground-floor room',
    'accessible-restroom': '🚿 Accessible restroom',
  }

  const initial = user.name.charAt(0).toUpperCase()

  const NavBtn = ({ label, icon, page, onClick }: { label: string; icon: string; page?: Page; onClick?: () => void }) => (
    <button
      onClick={onClick ?? (() => page && navigate(page))}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
        padding: '14px 18px', background: 'white', border: '1px solid #E8DCC8',
        borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
        fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, color: '#2A2015',
        marginBottom: '8px',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2B5219'; e.currentTarget.style.background = '#F5F2EC' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DCC8'; e.currentTarget.style.background = 'white' }}
    >
      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ color: '#B0A090', fontSize: '0.9rem' }}>→</span>
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '60px' }}>
      {/* Top bar */}
      <div style={{ background: '#2B5219', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={goBack} aria-label="Go back"
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '8px 14px', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}>
          ← Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>My Account</h1>
      </div>

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Profile header */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8DCC8', padding: '28px 24px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '2rem', flexShrink: 0, boxShadow: '0 4px 16px rgba(43,82,25,0.25)' }}>
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#2B5219', marginBottom: '4px' }}>{user.name}</h2>
            <p style={{ color: '#6A5840', fontSize: '0.9rem', marginBottom: '2px' }}>📧 {user.email}</p>
            {user.phone && <p style={{ color: '#6A5840', fontSize: '0.9rem', marginBottom: '2px' }}>📞 {user.phone}</p>}
            <p style={{ color: '#6A5840', fontSize: '0.88rem', marginTop: '6px' }}>
              🌐 Language: <strong style={{ color: '#2A2015' }}>{user.language.charAt(0).toUpperCase() + user.language.slice(1)}</strong>
            </p>
          </div>
        </div>

        {/* Accessibility prefs */}
        {user.a11yPrefs.length > 0 && (
          <div style={{ background: '#E8F4E0', borderRadius: '12px', border: '1px solid #A8D490', padding: '18px 20px', marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#2B5219', marginBottom: '10px', fontSize: '0.95rem' }}>
              ♿ Saved Accessibility Preferences
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {user.a11yPrefs.map(id => (
                <span key={id} style={{ background: 'white', border: '1px solid #A8D490', borderRadius: '20px', padding: '5px 12px', fontSize: '0.82rem', color: '#2B5219', fontWeight: 600 }}>
                  {A11Y_LABELS[id] || id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation cards */}
        <div style={{ marginBottom: '24px' }}>
          <NavBtn icon="📋" label="My Bookings" page="my-bookings" />
          <NavBtn icon="✨" label="My Itinerary" page="my-itinerary" />
          <NavBtn icon="★" label="My Reviews" page="reviews" />
          <NavBtn icon="♡" label="Saved / Wishlist" onClick={() => alert('Your saved stays and experiences will appear here.')} />
          <NavBtn icon="⚙️" label="Settings" page="settings" />
          <NavBtn icon="Aa" label="Appearance & Accessibility" page="appearance" />
          <NavBtn icon="♿" label="Quick Accessibility Settings" onClick={onOpenA11y} />
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '14px', background: '#FFF0EE', border: '2px solid #F0B8B0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, color: '#8B1A1A', transition: 'all 0.15s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FFE0DC' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFF0EE' }}
          aria-label="Log out of GaonGetaway"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
