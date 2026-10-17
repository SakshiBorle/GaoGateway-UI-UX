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

const FARM_IMG = 'https://images.unsplash.com/photo-1772512799691-004541bc2f7c?w=800&h=600&fit=crop&auto=format'
const FARMING_IMG = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&auto=format'
const NATURE_IMG = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format'

export default function About({ navigate }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      {/* Hero */}
      <div style={{ position: 'relative', background: '#2B5219', padding: '96px 24px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={FARM_IMG} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
        </div>
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,4rem)', color: 'white', marginBottom: '20px', lineHeight: 1.1 }}>
            About GaonGetaway
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}>
            GaonGetaway is an agri-tourism initiative that connects visitors with authentic rural experiences, local agriculture, nature and farm-based hospitality.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section aria-labelledby="mission-heading" style={{ padding: '80px 24px', background: '#FAF6EE' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C8902A', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Our Purpose</span>
            <h2 id="mission-heading" className="section-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#2B5219', marginBottom: '24px' }}>
              Our Mission
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#4A3A28', lineHeight: 1.8, marginBottom: '20px' }}>
              To create meaningful connections between rural communities and visitors while promoting local agriculture, authentic rural experiences, and sustainable tourism.
            </p>
            <p style={{ fontSize: '1rem', color: '#6A5840', lineHeight: 1.7 }}>
              We believe that tourism should benefit not just visitors but also the communities and ecosystems that make these experiences possible. Every stay at GaonGetaway supports local farming families and helps preserve traditional agricultural knowledge.
            </p>
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(43,82,25,0.2)', aspectRatio: '4/3', background: '#C8DEB0' }}>
            <img src={FARMING_IMG} alt="Local farmer tending to organic crops at GaonGetaway" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section aria-labelledby="values-heading" style={{ padding: '80px 24px', background: '#F0ECD8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C8902A', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Our Values</span>
            <h2 id="values-heading" className="section-heading section-heading-center" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#2B5219' }}>
              What We Believe
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🌾', title: 'Support Local Agriculture', desc: 'Every visit directly supports the farming families and local growers who make GaonGetaway possible.' },
              { icon: '🏡', title: 'Promote Rural Tourism', desc: 'We champion rural India as a destination — showcasing the beauty, culture, and richness of farm life.' },
              { icon: '🌱', title: 'Sustainable Practices', desc: 'From organic farming to minimal waste, every decision at GaonGetaway considers the impact on the environment.' },
              { icon: '🤝', title: 'Connect Rural & Urban', desc: 'We bridge the gap between city life and countryside — fostering understanding, respect, and community.' },
              { icon: '🍲', title: 'Celebrate Local Food & Culture', desc: 'Traditional recipes, local produce, and culinary heritage are at the heart of every meal at GaonGetaway.' },
              { icon: '♿', title: 'Inclusive & Accessible', desc: 'GaonGetaway is designed for everyone. We are committed to making farm experiences accessible to all visitors.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid rgba(212,196,160,0.5)', boxShadow: '0 4px 16px rgba(43,82,25,0.06)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#2A2015', marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#6A5840', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section aria-labelledby="approach-heading" style={{ padding: '80px 24px', background: '#FAF6EE' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(43,82,25,0.15)', aspectRatio: '4/3', background: '#C8DEB0', order: -1 }}>
            <img src={NATURE_IMG} alt="A serene forest nature trail at GaonGetaway" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C8902A', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Our Approach</span>
            <h2 id="approach-heading" className="section-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#2B5219', marginBottom: '24px' }}>
              Authentic. Responsible. Inclusive.
            </h2>
            <p style={{ fontSize: '1rem', color: '#4A3A28', lineHeight: 1.8, marginBottom: '20px' }}>
              GaonGetaway operates with a deep respect for the land, the farming communities, and our visitors. We work directly with local farming families to ensure every experience is genuine and every rupee spent supports rural livelihoods.
            </p>
            <p style={{ fontSize: '1rem', color: '#6A5840', lineHeight: 1.7, marginBottom: '32px' }}>
              Our accessibility programme ensures that visitors of all abilities — including elderly guests, wheelchair users, families with young children, and those with sensory needs — can participate in and enjoy the rural experience fully.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[
                { icon: '🌱', label: 'Organic Certified' },
                { icon: '♿', label: 'Accessibility Focused' },
                { icon: '🤝', label: 'Community Owned' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, color: '#2B5219', fontSize: '0.9rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section aria-labelledby="offer-heading" style={{ padding: '80px 24px', background: '#2B5219' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 id="offer-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: 'white', marginBottom: '16px' }}>
            What We Offer
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', marginBottom: '48px' }}>
            Everything you need for a complete, enriching rural retreat.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🏡', label: 'Farm Stay Rooms & Cottages' },
              { icon: '🌾', label: 'Organic Farming Workshops' },
              { icon: '🍽️', label: 'Farm-to-Table Dining' },
              { icon: '🦋', label: 'Nature Walks & Bird Watching' },
              { icon: '🏺', label: 'Cultural & Craft Experiences' },
              { icon: '🎲', label: 'Indoor & Traditional Games' },
              { icon: '🌻', label: 'Farm Store & Fresh Produce' },
              { icon: '♿', label: 'Fully Accessible Facilities' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ padding: '24px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2.5rem' }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: '#F5EFE0', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#2B5219', marginBottom: '16px' }}>
            Come Experience GaonGetaway
          </h2>
          <p style={{ color: '#6A5840', lineHeight: 1.7, marginBottom: '36px', fontSize: '1rem' }}>
            Whether you're a family seeking a weekend escape, elderly visitors looking for a peaceful farm holiday, or travellers wanting genuine cultural immersion — GaonGetaway welcomes you.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('booking-flow')}
              style={{ padding: '15px 32px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700 }}>
              🏡 Book Your Stay
            </button>
            <button onClick={() => navigate('contact')}
              style={{ padding: '15px 32px', background: 'transparent', color: '#2B5219', border: '2px solid #2B5219', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600 }}>
              Get in Touch →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
