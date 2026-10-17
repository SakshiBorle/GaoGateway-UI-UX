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

const COTTAGE_IMG = 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop&auto=format'
const FARM_ROOM = 'https://images.unsplash.com/photo-1694532635472-00eb7bfb720f?w=800&h=600&fit=crop&auto=format'
const FARM_INDIA = 'https://images.unsplash.com/photo-1772512799691-004541bc2f7c?w=800&h=600&fit=crop&auto=format'
const RURAL_IMG = 'https://images.unsplash.com/photo-1695666403934-5929e4690900?w=800&h=600&fit=crop&auto=format'

const accommodations = [
  {
    id: '1',
    name: 'Farmhouse Room',
    type: 'Farm Stay Room',
    price: 3500,
    capacity: 2,
    img: FARM_ROOM,
    badge: 'Most Popular',
    desc: 'Comfortable and cozy rooms within the main farmhouse. Featuring traditional décor, views of the farm, and access to all shared amenities.',
    amenities: ['Queen bed', 'Private bathroom', 'Farm view window', 'Ceiling fan', 'Wi-Fi', 'Daily housekeeping', 'Complimentary breakfast', 'Evening tea/snacks'],
    accessibility: ['Wheelchair-accessible pathway to room', 'Ground-floor option available', 'Accessible restroom with grab bars', 'Wide doorways (90cm)', 'Audio assistance available'],
    size: '22 sqm',
    rating: 4.7,
    reviews: 89,
  },
  {
    id: '2',
    name: 'Heritage Farmhouse Room',
    type: 'Farm Stay Room',
    price: 4200,
    capacity: 3,
    img: FARM_INDIA,
    badge: '',
    desc: 'A spacious room with heritage furniture, handwoven textiles, and authentic local art. Perfect for those who want to soak in the cultural atmosphere.',
    amenities: ['King bed + single bed', 'Private bathroom', 'Heritage décor', 'Reading nook', 'Wi-Fi', 'Daily housekeeping', 'Complimentary breakfast', 'Traditional lamps'],
    accessibility: ['Ground-floor option on request', 'Wide doorways', 'Accessible bathroom on request', 'Visual assistance available'],
    size: '28 sqm',
    rating: 4.6,
    reviews: 62,
  },
  {
    id: '3',
    name: 'Private Farm Cottage',
    type: 'Private Cottage',
    price: 5800,
    capacity: 4,
    img: COTTAGE_IMG,
    badge: 'Family Favourite',
    desc: 'A charming standalone cottage with a private garden, outdoor sitting area, and stunning countryside views. Perfect for families and couples.',
    amenities: ['2 bedrooms (king + twin)', 'Private garden', 'Mini kitchen', 'Outdoor sitting', 'Private bathroom', 'Wi-Fi', 'Daily housekeeping', 'Breakfast + dinner included'],
    accessibility: ['Wheelchair-accessible garden paths', 'Ground-floor bedrooms', 'Accessible bathroom', 'Grab bars in bathroom', 'Step-free entrance'],
    size: '55 sqm',
    rating: 4.9,
    reviews: 143,
  },
  {
    id: '4',
    name: 'Deluxe Valley Cottage',
    type: 'Private Cottage',
    price: 7500,
    capacity: 6,
    img: RURAL_IMG,
    badge: 'Luxury Pick',
    desc: 'Our premium cottage with panoramic valley views, a private terrace, and all modern comforts. The ultimate rural luxury experience.',
    amenities: ['3 bedrooms', 'Private terrace with valley view', 'Full kitchen', 'Living room', 'Outdoor bathtub', 'Premium toiletries', 'All meals included', 'Dedicated farm host'],
    accessibility: ['Fully accessible throughout', 'Wheelchair accessible', 'Roll-in shower available', 'Emergency call system', 'Audio & visual assistance'],
    size: '90 sqm',
    rating: 4.9,
    reviews: 58,
  },
]

export default function Stay({ navigate, goBack, pageData, booking, setBooking }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(pageData?.selectedId || null)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  const selected = selectedId ? accommodations.find(a => a.id === selectedId) : null

  const toggleCompare = (id: string) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 2 ? [...prev, id] : prev)
  }

  if (showCompare && compareIds.length >= 2) {
    const items = compareIds.map(id => accommodations.find(a => a.id === id)!)
    return <CompareView items={items} navigate={navigate} onClose={() => setShowCompare(false)} booking={booking} setBooking={setBooking} />
  }

  if (selected) {
    return <AccommodationDetail acc={selected} navigate={navigate} goBack={() => setSelectedId(null)} booking={booking} setBooking={setBooking} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3C2815, #7A4828)', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', marginBottom: '16px' }}>
            Where You'll Stay
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Choose from our cozy farmhouse rooms and private cottages — all surrounded by peaceful countryside.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* AI Planner CTA */}
        <div style={{ background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', borderRadius: '16px', padding: '28px 32px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'white', marginBottom: '8px' }}>
              ✨ Not sure which stay is right for you?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>Let our AI planner create a perfect retreat plan based on your group and preferences.</p>
          </div>
          <button onClick={() => navigate('ai-planner')}
            style={{ padding: '12px 24px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, flexShrink: 0 }}>
            ✨ Plan My Trip
          </button>
        </div>

        {/* Compare notice */}
        {compareIds.length > 0 && (
          <div style={{ background: '#FFF8E8', border: '2px solid #E8C070', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#7A4800' }}>
              📊 Comparing {compareIds.length}/2 stays{compareIds.length === 1 ? ' — Select one more to compare' : ''}
            </span>
            {compareIds.length === 2 && (
              <button onClick={() => setShowCompare(true)}
                style={{ padding: '8px 20px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                Compare Stays →
              </button>
            )}
          </div>
        )}

        {/* Accommodation cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {accommodations.map(acc => (
            <div
              key={acc.id}
              className="card-hover"
              style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(212,196,160,0.4)', boxShadow: '0 4px 20px rgba(43,82,25,0.06)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/10', background: '#C8DEB0', cursor: 'pointer' }} onClick={() => setSelectedId(acc.id)}>
                <img src={acc.img} alt={acc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                {acc.badge && <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#C8902A', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{acc.badge}</span>}
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(60,40,21,0.85)', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {acc.type}
                </span>
              </div>

              <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#2A2015', cursor: 'pointer' }} onClick={() => setSelectedId(acc.id)}>{acc.name}</h3>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#2B5219' }}>₹{acc.price.toLocaleString()}</div>
                    <div style={{ fontSize: '0.7rem', color: '#8A7860' }}>per night</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6A5840' }}>👥 Up to {acc.capacity} guests</span>
                  <span style={{ fontSize: '0.8rem', color: '#6A5840' }}>📐 {acc.size}</span>
                  <span style={{ fontSize: '0.8rem', color: '#C8902A' }}>★ {acc.rating} ({acc.reviews})</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#6A5840', lineHeight: 1.6, marginBottom: '14px', flex: 1 }} className="line-clamp-2">{acc.desc}</p>

                {/* Amenity pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {acc.amenities.slice(0, 3).map(a => (
                    <span key={a} style={{ fontSize: '0.75rem', color: '#4A3A28', background: '#F5EFE0', padding: '3px 8px', borderRadius: '8px' }}>{a}</span>
                  ))}
                  {acc.amenities.length > 3 && <span style={{ fontSize: '0.75rem', color: '#8A7860', padding: '3px 0' }}>+{acc.amenities.length - 3} more</span>}
                </div>

                {/* Accessibility badge */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#2B6A1A', background: '#E8F4E0', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                    ♿ Accessible options available
                  </span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setSelectedId(acc.id)}
                    style={{ flex: 1, padding: '10px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600 }}>
                    View Details
                  </button>
                  <button onClick={() => { setBooking({ ...booking, accommodation: { id: acc.id, name: acc.name, type: acc.type, price: acc.price } }); navigate('booking-flow', { accommodation: { id: acc.id, name: acc.name, type: acc.type, price: acc.price } }) }}
                    style={{ flex: 1, padding: '10px', background: 'transparent', color: '#2B5219', border: '2px solid #2B5219', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600 }}>
                    Check Availability
                  </button>
                </div>

                {/* Compare checkbox */}
                <button onClick={() => toggleCompare(acc.id)}
                  style={{ marginTop: '8px', padding: '6px', background: compareIds.includes(acc.id) ? '#E8F4E0' : 'transparent', border: `1px solid ${compareIds.includes(acc.id) ? '#5A7A3A' : '#D4C4A0'}`, borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#4A3A28', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  <span>{compareIds.includes(acc.id) ? '✓' : '+'}</span>
                  {compareIds.includes(acc.id) ? 'Added to Compare' : 'Compare Stays'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Accessibility Notice */}
        <div style={{ background: '#F0F7E8', border: '1px solid #C8DEB0', borderRadius: '12px', padding: '20px 24px', marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>♿</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2B5219', marginBottom: '8px' }}>Accessibility at GaonGetaway</h3>
            <p style={{ fontSize: '0.9rem', color: '#3A3025', lineHeight: 1.6 }}>
              All our accommodations offer accessibility options. Wheelchair-accessible rooms, grab bars, wide doorways, and ground-floor options are available. Contact us to specify your needs when booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccommodationDetail({ acc, navigate, goBack, booking, setBooking }: {
  acc: typeof accommodations[0]
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  booking: BookingState
  setBooking: (b: BookingState) => void
}) {
  const handleCheckAvailability = () => {
    setBooking({ ...booking, accommodation: { id: acc.id, name: acc.name, type: acc.type, price: acc.price } })
    navigate('booking-flow', { accommodation: { id: acc.id, name: acc.name, type: acc.type, price: acc.price } })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px 0' }}>
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2B5219', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0' }}>
          ← Back to Stays
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
          {/* Image */}
          <div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', background: '#C8DEB0', marginBottom: '20px' }}>
              <img src={acc.img} alt={acc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Quick Info */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8DCC8' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { icon: '👥', label: 'Capacity', val: `Up to ${acc.capacity} guests` },
                  { icon: '📐', label: 'Room Size', val: acc.size },
                  { icon: '★', label: 'Rating', val: `${acc.rating} (${acc.reviews} reviews)` },
                  { icon: '🏷️', label: 'Type', val: acc.type },
                ].map(({ icon, label, val }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.75rem', color: '#8A7860', fontWeight: 500, marginBottom: '2px' }}>{icon} {label}</div>
                    <div style={{ fontSize: '0.88rem', color: '#2A2015', fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <span style={{ background: '#C8902A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-block', marginBottom: '12px' }}>{acc.badge || acc.type}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#2B5219', marginBottom: '8px' }}>{acc.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: '#2B5219' }}>₹{acc.price.toLocaleString()}</span>
              <span style={{ color: '#8A7860' }}>per night</span>
            </div>

            <p style={{ fontSize: '1rem', color: '#4A3A28', lineHeight: 1.8, marginBottom: '28px' }}>{acc.desc}</p>

            {/* Amenities */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', marginBottom: '14px' }}>Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {acc.amenities.map(a => (
                  <div key={a} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.88rem', color: '#4A3A28' }}>
                    <span style={{ color: '#5A7A3A' }}>✓</span> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div style={{ background: '#F0F7E8', borderRadius: '12px', padding: '20px', border: '1px solid #C8DEB0', marginBottom: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2B5219', marginBottom: '12px' }}>♿ Accessibility</h3>
              {acc.accessibility.map(a => (
                <div key={a} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ color: '#2B5219', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: '0.88rem', color: '#3A3025' }}>{a}</span>
                </div>
              ))}
            </div>

            {/* Availability indicator */}
            <div style={{ background: '#E8F4E0', borderRadius: '10px', padding: '14px 18px', border: '1px solid #A8D490', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#2B6A1A', fontSize: '1.2rem' }}>✓</span>
              <div>
                <div style={{ fontWeight: 700, color: '#2B6A1A', fontSize: '0.95rem' }}>AVAILABLE</div>
                <div style={{ fontSize: '0.8rem', color: '#3A5A2A' }}>3 rooms remaining for selected dates</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={handleCheckAvailability}
                style={{ flex: 1, minWidth: '200px', padding: '16px 24px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700 }}>
                🗓️ Check Availability
              </button>
              <button onClick={() => navigate('ai-planner')}
                style={{ padding: '16px 20px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600 }}>
                ✨ Plan My Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompareView({ items, navigate, onClose, booking, setBooking }: {
  items: typeof accommodations
  navigate: (page: Page, data?: any) => void
  onClose: () => void
  booking: BookingState
  setBooking: (b: BookingState) => void
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2B5219', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0', marginBottom: '24px' }}>
          ← Back to Stays
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#2B5219', marginBottom: '32px' }}>Compare Stays</h1>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: '24px' }}>
          {items.map(acc => (
            <div key={acc.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E8DCC8' }}>
              <div style={{ aspectRatio: '16/9', background: '#C8DEB0' }}>
                <img src={acc.img} alt={acc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#2A2015', marginBottom: '4px' }}>{acc.name}</h3>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#2B5219', marginBottom: '16px' }}>₹{acc.price.toLocaleString()}<span style={{ fontSize: '0.8rem', color: '#8A7860', fontFamily: 'var(--font-body)', fontWeight: 400 }}>/night</span></div>

                {[
                  { label: 'Capacity', val: `Up to ${acc.capacity} guests` },
                  { label: 'Size', val: acc.size },
                  { label: 'Rating', val: `★ ${acc.rating}` },
                  { label: 'Type', val: acc.type },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0E8D8' }}>
                    <span style={{ fontSize: '0.85rem', color: '#8A7860' }}>{label}</span>
                    <span style={{ fontSize: '0.85rem', color: '#2A2015', fontWeight: 600 }}>{val}</span>
                  </div>
                ))}

                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#8A7860', marginBottom: '6px' }}>Accessibility</div>
                  {acc.accessibility.slice(0, 2).map(a => (
                    <div key={a} style={{ fontSize: '0.8rem', color: '#3A3025', marginBottom: '3px' }}>✓ {a}</div>
                  ))}
                </div>

                <button
                  onClick={() => { setBooking({ ...booking, accommodation: { id: acc.id, name: acc.name, type: acc.type, price: acc.price } }); navigate('booking-flow') }}
                  style={{ width: '100%', padding: '12px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, marginTop: '8px' }}>
                  Book This Stay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
