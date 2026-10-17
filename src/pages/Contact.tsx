import { useState } from 'react'
import type { Page, BookingState, CartItem, AccessibilityConfig } from '../types'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  pageData: Record<string, any>
  booking: BookingState
  setBooking: (b: BookingState) => void
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
  a11y: AccessibilityConfig
}

export default function Contact({ navigate }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Please enter a valid email address.'
    if (!form.message.trim()) errs.message = 'Please enter your message.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3C2815, #7A4828)', padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', marginBottom: '16px' }}>
          Get in Touch
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          We'd love to hear from you. Whether you have questions about staying, need accessibility help, or want to plan your visit — we're here.
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '64px' }}>
          {/* Contact info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#2B5219', marginBottom: '32px' }}>
              Contact Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#E8F4E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📍</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', marginBottom: '4px' }}>Location</h3>
                  <p style={{ color: '#6A5840', lineHeight: 1.6, fontSize: '0.9rem' }}>
                    GaonGetaway Farm<br />
                    Pune–Nashik Highway<br />
                    Near Manchar, Maharashtra 410503
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#E8F4E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📞</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', marginBottom: '4px' }}>Phone</h3>
                  <p style={{ color: '#6A5840', fontSize: '0.9rem' }}>+91 98765 43210</p>
                  <p style={{ color: '#9A8870', fontSize: '0.8rem' }}>Mon–Sun, 8:00 AM – 8:00 PM IST</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#E8F4E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>✉️</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', marginBottom: '4px' }}>Email</h3>
                  <p style={{ color: '#6A5840', fontSize: '0.9rem' }}>hello@gaongetaway.in</p>
                  <p style={{ color: '#9A8870', fontSize: '0.8rem' }}>We reply within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Accessibility contact */}
            <div style={{ background: '#F0F7E8', border: '1px solid #C8DEB0', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2B5219', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ♿ Accessibility Support
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#3A3025', lineHeight: 1.6 }}>
                Need help planning an accessible stay? Our accessibility team is available to discuss your specific needs. Call us or email <strong>accessibility@gaongetaway.in</strong>
              </p>
            </div>

            {/* AI Planner CTA */}
            <div style={{ background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', borderRadius: '12px', padding: '20px 22px' }}>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 500 }}>
                Need help planning your stay?
              </p>
              <button onClick={() => navigate('ai-planner')}
                style={{ padding: '10px 22px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 700 }}>
                ✨ Plan My Trip
              </button>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#2B5219', marginBottom: '32px' }}>
              Send a Message
            </h2>

            {submitted ? (
              <div style={{ background: '#E8F4E0', border: '2px solid #A8D490', borderRadius: '16px', padding: '40px', textAlign: 'center' }} role="alert" aria-live="polite">
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✉️</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#2B5219', marginBottom: '12px' }}>
                  Message Sent!
                </h3>
                <p style={{ color: '#3A5A2A', lineHeight: 1.6 }}>
                  Thank you! Your message has been sent. We'll get back to you within 24 hours.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }) }}
                  style={{ marginTop: '20px', padding: '10px 22px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontWeight: 600, color: '#2A2015', marginBottom: '6px', fontSize: '0.95rem' }}>
                    Full Name *
                  </label>
                  <input id="contact-name" type="text" placeholder="Your full name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="rural-input"
                    aria-required="true"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p id="name-error" role="alert" style={{ color: '#8B1A1A', fontSize: '0.82rem', marginTop: '4px' }}>⚠ {errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', fontWeight: 600, color: '#2A2015', marginBottom: '6px', fontSize: '0.95rem' }}>
                    Email Address *
                  </label>
                  <input id="contact-email" type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="rural-input"
                    aria-required="true"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p id="email-error" role="alert" style={{ color: '#8B1A1A', fontSize: '0.82rem', marginTop: '4px' }}>⚠ {errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="contact-phone" style={{ display: 'block', fontWeight: 600, color: '#2A2015', marginBottom: '6px', fontSize: '0.95rem' }}>
                    Phone Number
                  </label>
                  <input id="contact-phone" type="tel" placeholder="+91 xxxxx xxxxx" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="rural-input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" style={{ display: 'block', fontWeight: 600, color: '#2A2015', marginBottom: '6px', fontSize: '0.95rem' }}>
                    Your Message *
                  </label>
                  <textarea id="contact-message" rows={5} placeholder="Tell us about your visit plans, questions, or accessibility needs..." value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="rural-input"
                    style={{ resize: 'vertical', minHeight: '120px' }}
                    aria-required="true"
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p id="message-error" role="alert" style={{ color: '#8B1A1A', fontSize: '0.82rem', marginTop: '4px' }}>⚠ {errors.message}</p>}
                </div>

                <button type="submit" disabled={submitting}
                  style={{ padding: '16px 32px', background: submitting ? '#8BAD6A' : '#2B5219', color: 'white', border: 'none', borderRadius: '10px', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 700, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {submitting ? (
                    <><span style={{ display: 'inline-block', animation: 'spinSlow 1s linear infinite' }}>⏳</span> Sending...</>
                  ) : (
                    <> ✉️ Send Message</>
                  )}
                </button>

                <p style={{ fontSize: '0.82rem', color: '#9A8870', textAlign: 'center' }}>
                  Fields marked with * are required. We respect your privacy and will never share your details.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
