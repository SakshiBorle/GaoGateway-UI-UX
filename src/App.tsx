import { useState, useEffect } from 'react'
import type { Page, AccessibilityConfig, BookingState, CartItem, ConfirmedBooking, UserProfile } from './types'
import { defaultBooking, defaultA11y } from './types'
import Header from './components/Header'
import Footer from './components/Footer'
import AccessibilityPanel from './components/AccessibilityPanel'
import Home from './pages/Home'
import Experiences from './pages/Experiences'
import Stay from './pages/Stay'
import BookingFlow from './pages/BookingFlow'
import AIPlanner from './pages/AIPlanner'
import FarmStore from './pages/FarmStore'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Auth from './pages/Auth'
import Payment from './pages/Payment'
import Account from './pages/Account'
import MyBookings from './pages/MyBookings'
import MyItinerary from './pages/MyItinerary'
import Reviews from './pages/Reviews'
import Appearance from './pages/Appearance'
import Settings from './pages/Settings'
import Help from './pages/Help'
import ReadAloudBar from './components/ReadAloudBar'
import { installContextualSpeech, useSpeechToText } from './speech'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [pageHistory, setPageHistory] = useState<Page[]>([])
  const [pageData, setPageData] = useState<Record<string, any>>({})
  const [booking, setBooking] = useState<BookingState>(defaultBooking)
  const [cart, setCart] = useState<CartItem[]>([])
  const [a11y, setA11y] = useState<AccessibilityConfig>(defaultA11y)
  const [showA11yPanel, setShowA11yPanel] = useState(false)
  const [showVoiceNav, setShowVoiceNav] = useState(false)
  const [showReadAloud, setShowReadAloud] = useState(false)
  const [voiceCommand, setVoiceCommand] = useState('')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(() => {
    try { return JSON.parse(window.localStorage.getItem('gaongetaway-confirmed-booking') || 'null') } catch { return null }
  })

  const navigate = (page: Page, data?: Record<string, any>) => {
    setPageHistory(prev => [...prev, currentPage])
    setCurrentPage(page)
    if (data) setPageData(prev => ({ ...prev, ...data }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    if (pageHistory.length > 0) {
      const prev = pageHistory[pageHistory.length - 1]
      setPageHistory(p => p.slice(0, -1))
      setCurrentPage(prev)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Apply accessibility classes to body
  useEffect(() => {
    const body = document.body
    document.documentElement.lang = a11y.language === 'hindi' ? 'hi' : a11y.language === 'marathi' ? 'mr' : 'en'
    body.classList.remove(
      'text-size-16px', 'text-size-18px', 'text-size-20px', 'text-size-22px', 'text-size-24px', 'text-size-26px',
      'high-contrast', 'reduce-animation',
      'theme-farm', 'theme-dark', 'font-atkinson', 'font-serif',
      'tracking-wide', 'tracking-wider', 'leading-relaxed', 'leading-loose',
      'icons-xsmall', 'icons-small', 'icons-large', 'icons-xlarge',
      'text-size-large', 'text-size-xlarge' // keep for cleanup
    )
    if (a11y.textSize) body.classList.add(`text-size-${a11y.textSize}`)
    if (a11y.theme === 'farm') body.classList.add('theme-farm')
    if (a11y.theme === 'dark') body.classList.add('theme-dark')
    if (a11y.font === 'atkinson') body.classList.add('font-atkinson')
    if (a11y.font === 'serif') body.classList.add('font-serif')
    if (a11y.letterSpacing === 'wide') body.classList.add('tracking-wide')
    if (a11y.letterSpacing === 'wider') body.classList.add('tracking-wider')
    if (a11y.lineSpacing === 'relaxed') body.classList.add('leading-relaxed')
    if (a11y.lineSpacing === 'loose') body.classList.add('leading-loose')
    if (a11y.iconSize !== 'medium') body.classList.add(`icons-${a11y.iconSize}`)
    if (a11y.highContrast || a11y.theme === 'high-contrast') body.classList.add('high-contrast')
    if (a11y.reduceAnimation) body.classList.add('reduce-animation')
  }, [a11y])

  useEffect(() => {
    const saved = window.localStorage.getItem('gaongetaway-accessibility')
    if (saved) {
      try { setA11y({ ...defaultA11y, ...JSON.parse(saved) }) } catch { /* Keep safe defaults. */ }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('gaongetaway-accessibility', JSON.stringify(a11y))
  }, [a11y])

  useEffect(() => {
    if (!a11y.hoverReadAloud) {
      window.speechSynthesis?.cancel()
    }
    return installContextualSpeech(a11y.language, a11y.hoverReadAloud)
  }, [a11y.language, a11y.hoverReadAloud])

  // Auth handlers
  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser)
    const returnTo = pageData.returnTo as Page | undefined
    if (returnTo) {
      navigate(returnTo)
    } else if (loggedInUser.role === 'admin') {
      navigate('admin')
    } else {
      navigate('home')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setShowLogoutConfirm(false)
    setShowLogoutSuccess(true)
    setTimeout(() => setShowLogoutSuccess(false), 3000)
    navigate('home')
  }

  const handleBookingConfirmed = (result: ConfirmedBooking) => {
    setConfirmedBooking(result)
    window.localStorage.setItem('gaongetaway-confirmed-booking', JSON.stringify(result))
  }

  // Voice navigation handler
  const handleVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase()
    if (lower.includes('experiences') || lower.includes('experience')) navigate('experiences')
    else if (lower.includes('stay') || lower.includes('accommodation')) navigate('stay')
    else if (lower.includes('plan') || lower.includes('itinerary')) navigate('ai-planner')
    else if (lower.includes('store') || lower.includes('shop')) navigate('farm-store')
    else if (lower.includes('gallery') || lower.includes('photo')) navigate('gallery')
    else if (lower.includes('about')) navigate('about')
    else if (lower.includes('blog')) navigate('blog')
    else if (lower.includes('contact')) navigate('contact')
    else if (lower.includes('home')) navigate('home')
    else if (lower.includes('book') || lower.includes('availability')) navigate('booking-flow')
    else if (lower.includes('account') || lower.includes('profile')) navigate('account')
    else if (lower.includes('bookings') || lower.includes('my bookings')) navigate('my-bookings')
    else if (lower.includes('accessibility') || lower.includes('settings')) setShowA11yPanel(true)
    setVoiceCommand(cmd)
    setTimeout(() => { setShowVoiceNav(false); setVoiceCommand('') }, 2000)
  }

  const noFooterPages: Page[] = ['booking-flow', 'ai-planner', 'payment', 'auth']
  const showFooter = !noFooterPages.includes(currentPage)

  const sharedProps = { navigate, goBack, pageData, booking, setBooking, cart, setCart, a11y, user, confirmedBooking }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home {...sharedProps} />
      case 'experiences': return <Experiences {...sharedProps} />
      case 'stay': return <Stay {...sharedProps} />
      case 'booking-flow': return <BookingFlow {...sharedProps} />
      case 'ai-planner': return <AIPlanner {...sharedProps} />
      case 'farm-store': return <FarmStore {...sharedProps} />
      case 'gallery': return <Gallery {...sharedProps} />
      case 'about': return <About {...sharedProps} />
      case 'blog': return <Blog {...sharedProps} />
      case 'contact': return <Contact {...sharedProps} />
      case 'reviews': return <Reviews navigate={navigate} user={user} language={a11y.language} />
      case 'help': return <Help navigate={navigate} />
      case 'admin':
        return user?.role === 'admin'
          ? <AdminDashboard navigate={navigate} confirmedBooking={confirmedBooking} onBookingChange={result => {
              setConfirmedBooking(result)
              if (result) window.localStorage.setItem('gaongetaway-confirmed-booking', JSON.stringify(result))
              else window.localStorage.removeItem('gaongetaway-confirmed-booking')
            }} />
          : <Auth navigate={navigate} goBack={goBack} pageData={{ returnTo: 'admin', admin: true }} onLogin={handleLogin} a11y={a11y} />
      case 'appearance':
        return <Appearance navigate={navigate} goBack={goBack} a11y={a11y} onUpdate={setA11y} />
      case 'settings':
        return <Settings navigate={navigate} goBack={goBack} a11y={a11y} onUpdate={setA11y} user={user} />

      // Auth — accessible without login
      case 'auth':
        return <Auth navigate={navigate} goBack={goBack} pageData={pageData} onLogin={handleLogin} a11y={a11y} />

      // Payment — requires auth; redirect to auth if not logged in
      case 'payment':
        return user
          ? <Payment navigate={navigate} goBack={goBack} booking={booking} user={user} a11y={a11y} onConfirm={handleBookingConfirmed} />
          : <Auth navigate={navigate} goBack={goBack} pageData={{ ...pageData, fromBooking: true, returnTo: 'payment' }} onLogin={handleLogin} a11y={a11y} />

      // Account pages — require auth
      case 'account':
        return user
          ? <Account navigate={navigate} goBack={goBack} user={user} onLogout={handleLogout} a11y={a11y} onOpenA11y={() => setShowA11yPanel(true)} />
          : <Auth navigate={navigate} goBack={goBack} pageData={{ returnTo: 'account' }} onLogin={handleLogin} a11y={a11y} />
      case 'my-bookings':
        return user
          ? <MyBookings navigate={navigate} goBack={goBack} user={user} booking={booking} confirmedBooking={confirmedBooking} />
          : <Auth navigate={navigate} goBack={goBack} pageData={{ returnTo: 'my-bookings' }} onLogin={handleLogin} a11y={a11y} />
      case 'my-itinerary':
        return user
          ? <MyItinerary navigate={navigate} goBack={goBack} user={user} booking={booking} />
          : <Auth navigate={navigate} goBack={goBack} pageData={{ returnTo: 'my-itinerary' }} onLogin={handleLogin} a11y={a11y} />

      default: return <Home {...sharedProps} />
    }
  }

  const hideHeader = currentPage === 'auth'

  return (
    <div className={`min-h-screen flex flex-col app-frame ${currentPage === 'home' || currentPage === 'admin' ? '' : 'warli-page'}`}>
      {!hideHeader && (
        <Header
          currentPage={currentPage}
          navigate={navigate}
          cart={cart}
          onOpenA11y={() => setShowA11yPanel(true)}
          onOpenVoice={() => setShowVoiceNav(true)}
          onOpenReadAloud={() => setShowReadAloud(value => !value)}
          a11y={a11y}
          onUpdateA11y={setA11y}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {showReadAloud && <ReadAloudBar language={a11y.language} onClose={() => setShowReadAloud(false)} />}

      <main className="flex-1">
        {renderPage()}
      </main>

      {showFooter && (
        <Footer navigate={navigate} />
      )}

      {/* Accessibility Panel */}
      {showA11yPanel && (
        <>
          <div className="overlay-backdrop" onClick={() => setShowA11yPanel(false)} />
          <AccessibilityPanel
            a11y={a11y}
            onUpdate={setA11y}
            onClose={() => setShowA11yPanel(false)}
          />
        </>
      )}

      {/* Voice Navigation Overlay */}
      {showVoiceNav && (
        <>
          <div className="overlay-backdrop" onClick={() => setShowVoiceNav(false)} />
          <VoiceNavigationModal
            command={voiceCommand}
            onCommand={handleVoiceCommand}
            onClose={() => setShowVoiceNav(false)}
            language={a11y.language}
          />
        </>
      )}

      {/* Logout success toast */}
      {showLogoutSuccess && (
        <div className="language-toast" role="status" style={{ bottom: '20px', top: 'auto' }}>
          <strong>✓ Logged out</strong>
          <span>You have been successfully logged out.</span>
        </div>
      )}

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (
        <>
          <div className="overlay-backdrop" onClick={() => setShowLogoutConfirm(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: '90%', maxWidth: '400px', background: 'white', borderRadius: '16px',
              padding: '32px', zIndex: 300, boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2rem' }}>🚪</div>
            <h2 id="logout-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#2A2015', textAlign: 'center', marginBottom: '8px' }}>
              Log out of GaonGetaway?
            </h2>
            <p style={{ color: '#6A5840', textAlign: 'center', marginBottom: '28px', lineHeight: 1.6, fontSize: '0.9rem' }}>
              Are you sure you want to log out? You can still browse the website freely after logging out.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1, padding: '13px', background: '#F5EFE0', color: '#4A3A28', border: '2px solid #D4C4A0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleLogout}
                style={{ flex: 1, padding: '13px', background: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#6B1010')}
                onMouseLeave={e => (e.currentTarget.style.background = '#8B1A1A')}>
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile sticky book button — hidden on auth-related pages */}
      <div className="md:hidden sticky-book-btn" style={{ display: ['booking-flow', 'ai-planner', 'auth', 'payment'].includes(currentPage) ? 'none' : 'flex' }}>
        <button
          onClick={() => navigate('booking-flow')}
          className="sticky-book-btn w-full"
          style={{ position: 'static', padding: '0', background: 'none', boxShadow: 'none', justifyContent: 'center' }}
        >
          <span style={{ fontSize: '20px' }}>🏡</span>
          Book Your Stay
        </button>
      </div>
    </div>
  )
}

function VoiceNavigationModal({ command, onCommand, onClose, language }: {
  command: string
  onCommand: (cmd: string) => void
  onClose: () => void
  language: any
}) {
  const [transcript, setTranscript] = useState('')
  const speech = useSpeechToText(language, text => {
    simulateCommand(text)
  })
  const isListening = speech.status === 'listening'

  const exampleCommands = [
    'Show available stays',
    'Show experiences',
    'Plan my trip',
    'Open accessibility settings',
    'Book a farm',
    'Show gallery',
  ]

  const simulateCommand = (cmd: string) => {
    setTranscript(cmd)
    onCommand(cmd)
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%', maxWidth: '480px', background: 'white', borderRadius: '16px',
        padding: '32px', zIndex: 50, boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#2B5219' }}>
          🎙️ Voice Navigation
        </h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#6A5840' }} aria-label="Close voice navigation">
          ×
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => isListening ? speech.stop() : speech.start()}
          style={{ width: '80px', height: '80px', borderRadius: '50%', background: isListening ? '#C8902A' : '#2B5219', border: 'none', cursor: 'pointer', fontSize: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: isListening ? '0 0 0 8px rgba(200,144,42,0.2)' : 'none', transition: 'all 0.3s ease', animation: isListening ? 'pulseGreen 1.5s ease infinite' : 'none' }}
          aria-label={isListening ? 'Stop listening' : 'Start voice navigation'}
          aria-live="polite"
        >
          🎙️
        </button>
        <p style={{ marginTop: '12px', color: isListening ? '#C8902A' : '#6A5840', fontWeight: 600 }}>
          {speech.status === 'unsupported' ? 'Voice unsupported' : speech.status === 'error' ? (speech.errorReason === 'not-allowed' ? 'Mic access denied' : 'Try again') : isListening ? 'Listening...' : 'Tap to speak'}
        </p>
        {transcript && <p style={{ marginTop: '8px', color: '#2B5219', fontStyle: 'italic' }}>"{transcript}"</p>}
      </div>

      <div>
        <p style={{ fontWeight: 600, color: '#3C2815', marginBottom: '12px', fontSize: '0.9rem' }}>Try saying:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {exampleCommands.map(cmd => (
            <button key={cmd} onClick={() => simulateCommand(cmd)}
              style={{ padding: '8px 14px', background: '#F5EFE0', border: '1px solid #D4C4A0', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', color: '#3C2815', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}>
              "{cmd}"
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
