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

const FARMING_IMG = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&auto=format'
const FOOD_IMG = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop&auto=format'
const TRAIL_IMG = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format'
const BIRDS_IMG = 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&h=600&fit=crop&auto=format'
const VEG_IMG = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&auto=format'
const FARM_IMG = 'https://images.unsplash.com/photo-1694532635472-00eb7bfb720f?w=800&h=600&fit=crop&auto=format'
const RURAL_IMG = 'https://images.unsplash.com/photo-1695666403934-5929e4690900?w=800&h=600&fit=crop&auto=format'
const INDIA_IMG = 'https://images.unsplash.com/photo-1772512799691-004541bc2f7c?w=800&h=600&fit=crop&auto=format'
const HARVEST_IMG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format'

const experiences = [
  { id: '1', title: 'Organic Farming Workshop', cat: 'Farming', duration: '3 hours', price: 850, img: FARMING_IMG, badge: 'Popular', desc: 'Get your hands in the soil and learn traditional organic farming techniques from expert local farmers. Plant seeds, learn composting, and understand sustainable agriculture.', accessibility: ['Wheelchair-accessible area', 'Easy walking activities', 'Audio guidance available'], tags: ['Hands-on', 'Educational', 'Family-friendly'], groupSize: 'Max 12 people', location: 'Main Farm, Green Valley' },
  { id: '2', title: 'Crop Harvesting Experience', cat: 'Farming', duration: '2 hours', price: 600, img: HARVEST_IMG, badge: '', desc: 'Experience the joy of harvest season! Pick fresh fruits and vegetables directly from the farm and learn what it feels like to grow your own food.', accessibility: ['Ground-floor activities', 'Easy walking activities', 'Assistive support available'], tags: ['Seasonal', 'Outdoor', 'Family-friendly'], groupSize: 'Max 15 people', location: 'Harvest Fields, Green Valley' },
  { id: '3', title: 'Farm-to-Table Dining', cat: 'Food', duration: '2.5 hours', price: 1200, img: FOOD_IMG, badge: 'New', desc: 'Enjoy a freshly prepared traditional Maharashtra meal made entirely from farm-harvested ingredients. Cook alongside local hosts and discover traditional recipes.', accessibility: ['Fully accessible dining hall', 'Wheelchair accessible', 'Accessible restroom nearby'], tags: ['Culinary', 'Cultural', 'Vegetarian-friendly'], groupSize: 'Max 20 people', location: 'Farm Kitchen, Green Valley' },
  { id: '4', title: 'Traditional Food Preparation', cat: 'Food', duration: '3 hours', price: 950, img: VEG_IMG, badge: '', desc: 'Learn to prepare authentic Maharashtra dishes using stone grinders, clay pots, and traditional methods passed down through generations.', accessibility: ['Seated cooking sessions', 'Easy access', 'Audio guidance'], tags: ['Culinary', 'Cultural', 'Traditional'], groupSize: 'Max 10 people', location: 'Heritage Kitchen, Green Valley' },
  { id: '5', title: 'Nature Walk & Bird Watching', cat: 'Nature', duration: '2.5 hours', price: 500, img: BIRDS_IMG, badge: '', desc: 'Walk gentle countryside trails and spot native birds with a professional naturalist guide. Binoculars provided. Suitable for all fitness levels.', accessibility: ['Easy walking path', 'No steep inclines', 'Audio captions available'], tags: ['Outdoor', 'Wildlife', 'Family-friendly'], groupSize: 'Max 15 people', location: 'Nature Reserve Trail' },
  { id: '6', title: 'Forest & Field Trail', cat: 'Nature', duration: '3 hours', price: 650, img: TRAIL_IMG, badge: '', desc: 'Explore the beautiful forested areas and open fields surrounding the farm. Learn about local trees, plants, and ecosystems from your naturalist guide.', accessibility: ['Moderate walking', 'Flat paths available', 'Senior-friendly pacing'], tags: ['Outdoor', 'Eco', 'Active'], groupSize: 'Max 12 people', location: 'Western Forest Trail' },
  { id: '7', title: 'Village Life Experience', cat: 'Culture', duration: '4 hours', price: 1100, img: RURAL_IMG, badge: 'Unique', desc: 'Visit a nearby village, meet local families, see traditional crafts, and understand the daily rhythms of rural life in Maharashtra.', accessibility: ['Village paths accessible', 'Rest stops included', 'Senior-friendly'], tags: ['Cultural', 'Community', 'Immersive'], groupSize: 'Max 10 people', location: 'Nearby Village (3 km)' },
  { id: '8', title: 'Traditional Indoor Games', cat: 'Recreation', duration: '2 hours', price: 300, img: INDIA_IMG, badge: '', desc: 'Enjoy traditional indoor games including Carrom, Chess, Pallanguzhi, and other rural games. Perfect for rainy days or family evenings.', accessibility: ['Fully accessible indoors', 'Seated activities', 'All ages welcome'], tags: ['Indoor', 'Family', 'Relaxing'], groupSize: 'Up to 20 people', location: 'Recreation Hall' },
  { id: '9', title: 'Local Craft Workshop', cat: 'Culture', duration: '3 hours', price: 750, img: FARM_IMG, badge: '', desc: 'Learn traditional crafts like pottery, weaving, and natural dye techniques from local artisans. Take home your handmade creation as a souvenir.', accessibility: ['Seated workshop', 'Adapted tools available', 'All abilities welcome'], tags: ['Creative', 'Hands-on', 'Cultural'], groupSize: 'Max 12 people', location: 'Craft Studio, Green Valley' },
]

const categories = ['All', 'Farming', 'Nature', 'Food', 'Culture', 'Recreation']

export default function Experiences({ navigate, goBack, pageData, booking, setBooking }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(pageData?.selectedId || null)
  const adminImage = localStorage.getItem('gaongetaway-admin-image')
  const visibleExperiences = experiences.map((experience, index) => index === 0 && adminImage ? { ...experience, img: adminImage } : experience)

  const filtered = activeCategory === 'All' ? visibleExperiences : visibleExperiences.filter(e => e.cat === activeCategory)
  const selected = selectedId ? visibleExperiences.find(e => e.id === selectedId) : null

  if (selected) {
    return <ExperienceDetail exp={selected} navigate={navigate} goBack={() => setSelectedId(null)} booking={booking} setBooking={setBooking} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', marginBottom: '16px' }}>
            Farm Experiences
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Immerse yourself in authentic rural life — from organic farming and traditional cooking to nature walks and village culture.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Category Filter */}
        <div role="group" aria-label="Filter experiences by category" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              style={{
                padding: '10px 22px',
                borderRadius: '30px',
                border: `2px solid ${activeCategory === cat ? '#2B5219' : '#D4C4A0'}`,
                background: activeCategory === cat ? '#2B5219' : 'white',
                color: activeCategory === cat ? 'white' : '#4A3A28',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'All' ? '🌾 All' : cat === 'Farming' ? '🌱 Farming' : cat === 'Nature' ? '🦋 Nature' : cat === 'Food' ? '🍽️ Food' : cat === 'Culture' ? '🏺 Culture' : '🎲 Recreation'}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#6A5840', marginBottom: '32px', fontSize: '0.9rem' }}>
          Showing {filtered.length} experience{filtered.length !== 1 ? 's' : ''}{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
        </p>

        {/* Experience Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {filtered.map(exp => (
            <button
              key={exp.id}
              onClick={() => setSelectedId(exp.id)}
              className="card-hover"
              style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', textAlign: 'left', cursor: 'pointer', padding: 0, border: '1px solid rgba(212,196,160,0.4)', boxShadow: '0 4px 20px rgba(43,82,25,0.06)' }}
              aria-label={`${exp.title} - ${exp.duration} - ₹${exp.price} per person - View details`}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#C8DEB0' }}>
                <img src={exp.img} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                {exp.badge && (
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: exp.badge === 'Popular' ? '#2B5219' : exp.badge === 'Unique' ? '#7A4828' : '#C8902A', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{exp.badge}</span>
                )}
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(43,82,25,0.9)', color: 'white', padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {exp.cat}
                </span>
              </div>
              <div style={{ padding: '22px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#2A2015', marginBottom: '8px', lineHeight: 1.2 }}>{exp.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#6A5840', lineHeight: 1.6, marginBottom: '16px' }} className="line-clamp-2">{exp.desc}</p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: '#4A3A28', background: '#F5EFE0', padding: '4px 10px', borderRadius: '10px', fontWeight: 500 }}>⏱ {exp.duration}</span>
                  <span style={{ fontSize: '0.8rem', color: '#4A3A28', background: '#F5EFE0', padding: '4px 10px', borderRadius: '10px', fontWeight: 500 }}>👥 {exp.groupSize}</span>
                </div>

                {/* Accessibility badges */}
                <div style={{ marginBottom: '16px' }}>
                  {exp.accessibility.slice(0, 1).map(a => (
                    <span key={a} style={{ fontSize: '0.78rem', color: '#2B6A1A', background: '#E8F4E0', padding: '4px 10px', borderRadius: '20px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      ♿ {a}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#2B5219' }}>₹{exp.price}</span>
                    <span style={{ fontSize: '0.8rem', color: '#8A7860' }}> / person</span>
                  </div>
                  <span style={{ color: '#2B5219', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>View Details →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExperienceDetail({ exp, navigate, goBack, booking, setBooking }: {
  exp: typeof experiences[0]
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  booking: BookingState
  setBooking: (b: BookingState) => void
}) {
  const handleCheckAvailability = () => {
    setBooking({ ...booking, experience: { id: exp.id, name: exp.title } })
    navigate('booking-flow', { source: 'experience', experience: { id: exp.id, name: exp.title } })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      {/* Back */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px 0' }}>
        <button onClick={goBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2B5219', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0' }}>
          ← Back to Experiences
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
          {/* Left - Image & Highlights */}
          <div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', background: '#C8DEB0', marginBottom: '24px' }}>
              <img src={exp.img} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Highlights */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8DCC8', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', marginBottom: '16px' }}>Experience Highlights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: '⏱', label: 'Duration', val: exp.duration },
                  { icon: '👥', label: 'Group Size', val: exp.groupSize },
                  { icon: '📍', label: 'Location', val: exp.location },
                  { icon: '💰', label: 'Price', val: `₹${exp.price} per person` },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.2rem', width: '28px', textAlign: 'center' }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#8A7860', fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: '0.9rem', color: '#2A2015', fontWeight: 600 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {exp.tags.map(tag => (
                <span key={tag} style={{ padding: '6px 14px', background: '#E8F4E0', color: '#2B5219', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Right - Details */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ background: '#2B5219', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{exp.cat}</span>
              {exp.badge && <span style={{ background: '#C8902A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{exp.badge}</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#2B5219', marginBottom: '16px', lineHeight: 1.15 }}>
              {exp.title}
            </h1>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ color: '#C8902A', fontSize: '1.1rem' }}>★★★★★</span>
              <span style={{ fontSize: '0.9rem', color: '#6A5840' }}>4.8 (124 reviews)</span>
            </div>

            <p style={{ fontSize: '1rem', color: '#4A3A28', lineHeight: 1.8, marginBottom: '32px' }}>{exp.desc}</p>

            {/* Accessibility Section */}
            <div style={{ background: '#F0F7E8', borderRadius: '12px', padding: '20px', border: '1px solid #C8DEB0', marginBottom: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2B5219', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ♿ Accessibility Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exp.accessibility.map(a => (
                  <div key={a} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#2B5219', fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: '0.9rem', color: '#3A3025' }}>{a}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#2B5219', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: '#3A3025' }}>Captions available for guided tours</span>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', marginBottom: '12px' }}>What's Included</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['Expert guide', 'All equipment', 'Refreshments', 'Take-home produce', 'Safety briefing', 'Certificate of participation'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.88rem', color: '#4A3A28' }}>
                    <span style={{ color: '#5A7A3A' }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleCheckAvailability}
                style={{ flex: 1, minWidth: '200px', padding: '16px 24px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700, transition: 'all 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = '#3A6B26'}
                onMouseLeave={e => e.currentTarget.style.background = '#2B5219'}
              >
                🗓️ Check Availability
              </button>
              <button
                onClick={() => navigate('ai-planner', { includeExperience: exp.id })}
                style={{ padding: '16px 24px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600 }}
              >
                ✨ Add to Trip Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
