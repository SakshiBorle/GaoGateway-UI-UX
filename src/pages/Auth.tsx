import { useState } from 'react'
import type { AccessibilityConfig, Page, UserProfile } from '../types'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  pageData: Record<string, any>
  onLogin: (user: UserProfile) => void
  a11y: AccessibilityConfig
}

type AuthView = 'login' | 'register' | 'forgot' | 'forgot-sent' | 'reg-success'

// ── Small reusable field ─────────────────────────────────────────────────────
function Field({
  id, label, type = 'text', value, onChange, error, placeholder, required,
  hint, rightAddon,
}: {
  id: string; label: string; type?: string; value: string
  onChange: (v: string) => void; error?: string; placeholder?: string
  required?: boolean; hint?: string; rightAddon?: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label htmlFor={id} style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, color: '#2A2015', marginBottom: '6px', fontSize: '0.9rem' }}>
        {label}{required && <span style={{ color: '#C0281A' }} aria-hidden="true"> *</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id} type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          style={{
            display: 'block', width: '100%', padding: '14px 16px',
            paddingRight: rightAddon ? '52px' : '16px',
            border: `2px solid ${error ? '#C0281A' : '#D4C4A0'}`,
            borderRadius: '10px', fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: '#2A2015', background: 'white', outline: 'none',
            boxSizing: 'border-box', transition: 'border-color 0.15s ease',
          }}
          onFocus={e => { if (!error) e.currentTarget.style.borderColor = '#2B5219' }}
          onBlur={e => { if (!error) e.currentTarget.style.borderColor = '#D4C4A0' }}
        />
        {rightAddon && (
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            {rightAddon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" style={{ color: '#C0281A', fontSize: '0.82rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} style={{ color: '#8A7860', fontSize: '0.8rem', marginTop: '4px' }}>{hint}</p>
      )}
    </div>
  )
}

// ── Password strength indicator ───────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'At least one number', pass: /\d/.test(password) },
    { label: 'At least one special character (!@#$…)', pass: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ]
  return (
    <div style={{ background: '#F5EFE0', borderRadius: '8px', padding: '10px 14px', marginTop: '-8px', marginBottom: '14px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 700, color: '#3C2815', marginBottom: '6px' }}>
        Password must contain:
      </p>
      {checks.map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ color: c.pass ? '#2B6A1A' : '#B0A090', fontSize: '0.8rem', fontWeight: 900 }}>{c.pass ? '✓' : '○'}</span>
          <span style={{ fontSize: '0.8rem', color: c.pass ? '#2B5219' : '#8A7860' }}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Logo strip ────────────────────────────────────────────────────────────────
function LogoStrip({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
      <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} aria-label="GaonGetaway - Go to homepage">
        <img src="/gaongetaway-logo.png" alt="GaonGetaway" style={{ height: '52px', width: 'auto' }} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#2B5219' }}>GaonGetaway</div>
          <div style={{ fontSize: '0.6rem', color: '#7A4828', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Explore · Unwind · Reconnect</div>
        </div>
      </button>
    </div>
  )
}

// ── Booking context banner ────────────────────────────────────────────────────
function BookingBanner({ returnTo }: { returnTo?: string }) {
  return (
    <div style={{ background: 'linear-gradient(90deg, #2B5219, #5A7A3A)', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '1.4rem' }}>🏡</span>
      <div>
        <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>Almost there!</div>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', marginTop: '2px' }}>
          {returnTo === 'payment'
            ? 'Sign in or create a free account to complete your GaonGetaway booking. Your dates and preferences are saved.'
            : 'Sign in to access your GaonGetaway account.'}
        </div>
      </div>
    </div>
  )
}

// ── Shared card wrapper ───────────────────────────────────────────────────────
function AuthCard({ children, maxWidth = 500 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px 60px' }}>
      <div style={{ width: '100%', maxWidth, background: 'white', borderRadius: '20px', border: '1px solid #E8DCC8', boxShadow: '0 8px 40px rgba(43,82,25,0.10)', padding: '36px 32px' }}>
        {children}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Auth({ navigate, goBack, pageData, onLogin, a11y }: Props) {
  const [adminMode, setAdminMode] = useState(pageData.admin === true)
  const authText = a11y.language === 'hindi'
    ? { loginTitle: 'गाँवगेटअवे में फिर स्वागत है', email: 'ईमेल', password: 'पासवर्ड', forgot: 'पासवर्ड भूल गए?', login: 'लॉग इन', registerTitle: 'अपना गाँवगेटअवे खाता बनाएँ', name: 'पूरा नाम', confirm: 'पासवर्ड की पुष्टि करें', create: 'खाता बनाएँ' }
    : a11y.language === 'marathi'
      ? { loginTitle: 'गावगेटअवेमध्ये पुन्हा स्वागत', email: 'ईमेल', password: 'पासवर्ड', forgot: 'पासवर्ड विसरलात?', login: 'लॉग इन', registerTitle: 'तुमचे गावगेटअवे खाते तयार करा', name: 'पूर्ण नाव', confirm: 'पासवर्ड पुन्हा लिहा', create: 'खाते तयार करा' }
      : { loginTitle: 'Welcome Back to GaonGetaway', email: 'Email Address', password: 'Password', forgot: 'Forgot Password?', login: 'LOGIN', registerTitle: 'Create Your GaonGetaway Account', name: 'Full Name', confirm: 'Confirm Password', create: 'CREATE ACCOUNT' }
  const fromBooking = pageData.fromBooking === true
  const returnTo = pageData.returnTo as Page | undefined

  const [view, setView] = useState<AuthView>(
    pageData.defaultView === 'register' ? 'register' : 'login'
  )

  // ── LOGIN state ──────────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginShowPw, setLoginShowPw] = useState(false)
  const [loginRemember, setLoginRemember] = useState(false)
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({})

  const validateLogin = (): boolean => {
    const errs: Record<string, string> = {}
    if (!loginEmail.trim()) errs.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) errs.email = 'Please enter a valid email address.'
    if (!loginPassword) errs.password = 'Please enter your password.'
    setLoginErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleLogin = () => {
    if (!validateLogin()) return
    // Simulate auth — any valid email + password ≥ 6 chars succeeds
    if (loginPassword.length < 6) {
      setLoginErrors({ password: 'The email or password is incorrect. Please try again.' })
      return
    }
    const name = loginEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    onLogin({ name: adminMode ? 'GaonGetaway Administrator' : name, email: loginEmail, phone: '', language: a11y.language, a11yPrefs: [], role: adminMode ? 'admin' : 'user' })
  }

  // ── REGISTER state ───────────────────────────────────────────────────────
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regLang, setRegLang] = useState<'english' | 'hindi' | 'marathi'>('english')
  const [regA11y, setRegA11y] = useState<string[]>([])
  const [regShowPw, setRegShowPw] = useState(false)
  const [regShowConfirm, setRegShowConfirm] = useState(false)
  const [regErrors, setRegErrors] = useState<Record<string, string>>({})

  const toggleRegA11y = (id: string) =>
    setRegA11y(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const validateRegister = (): boolean => {
    const errs: Record<string, string> = {}
    if (!regName.trim()) errs.name = 'Please enter your name.'
    if (!regEmail.trim()) errs.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = 'Please enter a valid email address.'
    if (!regPhone.trim()) errs.phone = 'Please enter a valid phone number.'
    else if (!/^[0-9+\-\s()]{7,15}$/.test(regPhone)) errs.phone = 'Please enter a valid phone number.'
    if (!regPassword) errs.password = 'Please enter a password.'
    else if (regPassword.length < 8) errs.password = 'Password must contain at least 8 characters.'
    else if (!/\d/.test(regPassword)) errs.password = 'Password must contain at least one number.'
    else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(regPassword)) errs.password = 'Password must contain at least one special character.'
    if (!regConfirm) errs.confirm = 'Please confirm your password.'
    else if (regConfirm !== regPassword) errs.confirm = 'Passwords do not match.'
    setRegErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleRegister = () => {
    if (!validateRegister()) return
    setView('reg-success')
  }

  // ── FORGOT state ─────────────────────────────────────────────────────────
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')

  const handleForgot = () => {
    if (!forgotEmail.trim()) { setForgotError('Please enter your email address.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) { setForgotError('Please enter a valid email address.'); return }
    setForgotError('')
    setView('forgot-sent')
  }

  // ── Shared back-to-booking button ────────────────────────────────────────
  const BackToBooking = () => fromBooking ? (
    <button
      onClick={goBack}
      aria-label="Back to your booking"
      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, color: '#6A5840', padding: '0 0 20px' }}
    >
      ← Back to Booking
    </button>
  ) : null

  // ── PRIMARY BUTTON style ─────────────────────────────────────────────────
  const btnPrimary: React.CSSProperties = {
    display: 'block', width: '100%', padding: '16px',
    background: '#2B5219', color: 'white', border: 'none',
    borderRadius: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)',
    fontSize: '1rem', fontWeight: 700, letterSpacing: '0.04em',
    transition: 'background 0.2s ease', marginTop: '8px',
  }
  const btnSecondary: React.CSSProperties = {
    display: 'block', width: '100%', padding: '14px',
    background: 'transparent', color: '#2B5219',
    border: '2px solid #D4C4A0', borderRadius: '12px', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600,
    transition: 'border-color 0.15s ease', marginTop: '10px',
  }
  const divider = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
      <div style={{ flex: 1, height: '1px', background: '#E8DCC8' }} />
      <span style={{ color: '#B0A090', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>or</span>
      <div style={{ flex: 1, height: '1px', background: '#E8DCC8' }} />
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (view === 'login') {
    return (
      <AuthCard>
        <LogoStrip navigate={navigate} />
        <BackToBooking />
        {fromBooking && <BookingBanner returnTo={returnTo} />}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3.5vw,2rem)', color: '#2B5219', marginBottom: '6px' }}>
          {adminMode ? 'GaonGetaway Admin Login' : authText.loginTitle}
        </h1>
        <p style={{ color: '#6A5840', fontSize: '0.95rem', marginBottom: '28px' }}>
          {adminMode ? 'Restricted access for authorised property staff.' : 'Sign in to continue your rural getaway experience.'}
        </p>

        <Field id="login-email" label={authText.email} type="email" value={loginEmail} onChange={setLoginEmail}
          error={loginErrors.email} placeholder="you@example.com" required />
        <Field id="login-password" label={authText.password} type={loginShowPw ? 'text' : 'password'}
          value={loginPassword} onChange={setLoginPassword} error={loginErrors.password}
          placeholder="Enter your password" required
          rightAddon={
            <button type="button" onClick={() => setLoginShowPw(p => !p)}
              aria-label={loginShowPw ? 'Hide password' : 'Show password'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6A5840', fontSize: '1.1rem', padding: '2px', display: 'flex', alignItems: 'center' }}>
              {loginShowPw ? '🙈' : '👁'}
            </button>
          }
        />

        {/* Remember me + Forgot password */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', marginTop: '-4px', flexWrap: 'wrap', gap: '8px' }}>
          <label htmlFor="remember-me" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#4A3A28', userSelect: 'none' }}>
            <input id="remember-me" type="checkbox" checked={loginRemember} onChange={e => setLoginRemember(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2B5219', cursor: 'pointer' }} />
            Remember me
          </label>
          <button onClick={() => setView('forgot')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#2B5219', fontWeight: 600, padding: 0 }}>
            {authText.forgot}
          </button>
        </div>

        <button onClick={handleLogin} style={btnPrimary}
          onMouseEnter={e => (e.currentTarget.style.background = '#3A6B26')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2B5219')}>
          {adminMode ? 'ADMIN LOGIN' : authText.login}
        </button>

        {divider}

        <button onClick={() => setAdminMode(value => !value)} style={btnSecondary}>
          {adminMode ? '← Back to Guest Login' : 'Admin Login'}
        </button>

        <p style={{ textAlign: 'center', color: '#6A5840', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <button onClick={() => setView('register')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2B5219', fontWeight: 700, fontFamily: 'var(--font-body)', fontSize: '0.9rem', padding: 0 }}>
            Register →
          </button>
        </p>
        <button onClick={() => navigate('home')} style={{ ...btnSecondary, marginTop: '10px' }}>
          Continue Browsing Without Login
        </button>
      </AuthCard>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (view === 'register') {
    return (
      <AuthCard maxWidth={560}>
        <LogoStrip navigate={navigate} />
        <BackToBooking />
        {fromBooking && <BookingBanner returnTo={returnTo} />}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,1.9rem)', color: '#2B5219', marginBottom: '6px' }}>
          {authText.registerTitle}
        </h1>
        <p style={{ color: '#6A5840', fontSize: '0.95rem', marginBottom: '28px' }}>
          Join GaonGetaway and plan your perfect rural escape.
        </p>

        <Field id="reg-name" label={authText.name} value={regName} onChange={setRegName}
          error={regErrors.name} placeholder="Your full name" required />
        <Field id="reg-email" label={authText.email} type="email" value={regEmail} onChange={setRegEmail}
          error={regErrors.email} placeholder="you@example.com" required />
        <Field id="reg-phone" label="Phone Number" type="tel" value={regPhone} onChange={setRegPhone}
          error={regErrors.phone} placeholder="+91 98765 43210" required
          hint="We'll use this for booking confirmations only." />
        <Field id="reg-password" label={authText.password} type={regShowPw ? 'text' : 'password'}
          value={regPassword} onChange={setRegPassword} error={regErrors.password}
          placeholder="Create a strong password" required
          rightAddon={
            <button type="button" onClick={() => setRegShowPw(p => !p)} aria-label={regShowPw ? 'Hide password' : 'Show password'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6A5840', fontSize: '1.1rem', padding: '2px', display: 'flex', alignItems: 'center' }}>
              {regShowPw ? '🙈' : '👁'}
            </button>
          }
        />
        <PasswordStrength password={regPassword} />
        <Field id="reg-confirm" label={authText.confirm} type={regShowConfirm ? 'text' : 'password'}
          value={regConfirm} onChange={setRegConfirm} error={regErrors.confirm}
          placeholder="Repeat your password" required
          rightAddon={
            <button type="button" onClick={() => setRegShowConfirm(p => !p)} aria-label={regShowConfirm ? 'Hide' : 'Show'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6A5840', fontSize: '1.1rem', padding: '2px', display: 'flex', alignItems: 'center' }}>
              {regShowConfirm ? '🙈' : '👁'}
            </button>
          }
        />

        {/* Language */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, color: '#2A2015', marginBottom: '8px', fontSize: '0.9rem' }}>
            Preferred Language <span style={{ color: '#8A7860', fontWeight: 400 }}>(optional)</span>
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(['english', 'hindi', 'marathi'] as const).map(lang => (
              <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', padding: '10px 16px', border: `2px solid ${regLang === lang ? '#2B5219' : '#D4C4A0'}`, borderRadius: '8px', background: regLang === lang ? 'rgba(43,82,25,0.07)' : 'white', userSelect: 'none' }}>
                <input type="radio" name="reg-lang" checked={regLang === lang} onChange={() => setRegLang(lang)} style={{ accentColor: '#2B5219' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: regLang === lang ? '#2B5219' : '#4A3A28' }}>
                  {lang === 'english' ? '🇮🇳 English' : lang === 'hindi' ? 'हिन्दी' : 'मराठी'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Accessibility prefs */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: '#2A2015', marginBottom: '8px', fontSize: '0.9rem' }}>
            Accessibility Preferences <span style={{ color: '#8A7860', fontWeight: 400 }}>(optional)</span>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'wheelchair', label: '♿ Wheelchair accessibility' },
              { id: 'audio', label: '🔊 Audio assistance' },
              { id: 'visual', label: '👁️ Visual assistance' },
              { id: 'easy-walk', label: '🚶 Easy walking activities' },
              { id: 'other', label: '📝 Other accessibility needs' },
            ].map(({ id, label }) => (
              <label key={id} htmlFor={`reg-a11y-${id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 14px', border: `1.5px solid ${regA11y.includes(id) ? '#2B5219' : '#E8DCC8'}`, borderRadius: '8px', background: regA11y.includes(id) ? 'rgba(43,82,25,0.05)' : 'white', userSelect: 'none' }}>
                <input id={`reg-a11y-${id}`} type="checkbox" checked={regA11y.includes(id)} onChange={() => toggleRegA11y(id)}
                  style={{ width: '18px', height: '18px', accentColor: '#2B5219', cursor: 'pointer' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#2A2015' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={handleRegister} style={btnPrimary}
          onMouseEnter={e => (e.currentTarget.style.background = '#3A6B26')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2B5219')}>
          {authText.create}
        </button>

        {divider}
        <p style={{ textAlign: 'center', color: '#6A5840', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <button onClick={() => setView('login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2B5219', fontWeight: 700, fontFamily: 'var(--font-body)', fontSize: '0.9rem', padding: 0 }}>
            Login →
          </button>
        </p>
        <button onClick={() => navigate('home')} style={{ ...btnSecondary, marginTop: '10px' }}>
          Continue Browsing Without Account
        </button>
      </AuthCard>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTRATION SUCCESS
  // ─────────────────────────────────────────────────────────────────────────
  if (view === 'reg-success') {
    const handleContinue = () => {
      onLogin({
        name: regName, email: regEmail, phone: regPhone,
        language: regLang, a11yPrefs: regA11y,
      })
    }
    return (
      <AuthCard>
        <LogoStrip navigate={navigate} />
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #5A7A3A, #2B5219)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(43,82,25,0.25)' }}>
            ✓
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: '#2B5219', marginBottom: '10px' }}>
            Welcome to GaonGetaway!
          </h1>
          <p style={{ color: '#6A5840', fontSize: '0.95rem', maxWidth: '340px', margin: '0 auto 12px', lineHeight: 1.6 }}>
            Your account has been created successfully. Welcome to the GaonGetaway family!
          </p>
          <p style={{ color: '#2B5219', fontWeight: 700, fontSize: '0.9rem', marginBottom: '32px' }}>
            Hi, {regName}! 🌾
          </p>
          <button onClick={handleContinue} style={{ ...btnPrimary, maxWidth: '360px', margin: '0 auto' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3A6B26')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2B5219')}>
            {fromBooking ? 'Continue to Booking →' : 'CONTINUE TO GAONGETAWAY'}
          </button>
        </div>
      </AuthCard>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────────────────────────────────────
  if (view === 'forgot') {
    return (
      <AuthCard>
        <LogoStrip navigate={navigate} />
        <button onClick={() => setView('login')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, color: '#6A5840', padding: '0 0 20px' }}>
          ← Back to Login
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#2B5219', marginBottom: '8px' }}>
          Forgot Your Password?
        </h1>
        <p style={{ color: '#6A5840', fontSize: '0.95rem', marginBottom: '28px' }}>
          Enter your email address and we'll help you reset your password.
        </p>
        <Field id="forgot-email" label="Email Address" type="email" value={forgotEmail} onChange={e => { setForgotEmail(e); setForgotError('') }}
          error={forgotError} placeholder="you@example.com" required />
        <button onClick={handleForgot} style={btnPrimary}
          onMouseEnter={e => (e.currentTarget.style.background = '#3A6B26')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2B5219')}>
          SEND RESET LINK
        </button>
      </AuthCard>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FORGOT SENT
  // ─────────────────────────────────────────────────────────────────────────
  if (view === 'forgot-sent') {
    return (
      <AuthCard>
        <LogoStrip navigate={navigate} />
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📧</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#2B5219', marginBottom: '12px' }}>
            Reset Link Sent
          </h1>
          <p style={{ color: '#6A5840', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 32px', fontSize: '0.95rem' }}>
            If an account exists with <strong>{forgotEmail}</strong>, password reset instructions will be sent to that email.
          </p>
          <button onClick={() => setView('login')} style={{ ...btnPrimary, maxWidth: '320px', margin: '0 auto' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3A6B26')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2B5219')}>
            ← BACK TO LOGIN
          </button>
        </div>
      </AuthCard>
    )
  }

  return null
}
