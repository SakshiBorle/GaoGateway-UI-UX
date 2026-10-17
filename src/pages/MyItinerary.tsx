import type { Page, UserProfile, BookingState } from '../types'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  user: UserProfile
  booking: BookingState
}

const sampleItinerary = [
  {
    day: 1, title: 'Discover the Farm',
    activities: [
      { time: '10:00 AM', name: 'Check-in & Welcome Tour', duration: '1 hr', icon: '🏡', a11y: 'Accessible pathways · Seated option' },
      { time: '11:30 AM', name: 'Guided Farm Tour', duration: '1.5 hrs', icon: '🌾', a11y: 'Easy walking pace' },
      { time: '1:00 PM', name: 'Farm-to-Table Lunch', duration: '1 hr', icon: '🍽️', a11y: 'Accessible dining hall' },
      { time: '3:00 PM', name: 'Organic Farming Workshop', duration: '2 hrs', icon: '🌱', a11y: 'Seated options available' },
      { time: '6:00 PM', name: 'Sunset at the Viewpoint', duration: '45 min', icon: '🌅', a11y: 'Accessible viewpoint' },
      { time: '8:00 PM', name: 'Traditional Dinner', duration: '1.5 hrs', icon: '🌙', a11y: 'Accessible dining area' },
    ],
  },
  {
    day: 2, title: 'Experience Rural Life',
    activities: [
      { time: '8:00 AM', name: 'Farm Breakfast', duration: '45 min', icon: '🌄', a11y: 'Accessible breakfast area' },
      { time: '9:00 AM', name: 'Crop Harvesting Experience', duration: '2 hrs', icon: '🌽', a11y: 'Accessible fields' },
      { time: '11:30 AM', name: 'Traditional Food Preparation', duration: '2 hrs', icon: '🫕', a11y: 'Seated cooking class' },
      { time: '1:30 PM', name: 'Farm Lunch', duration: '1 hr', icon: '🥘', a11y: 'Accessible dining' },
      { time: '3:00 PM', name: 'Village Life Experience', duration: '2.5 hrs', icon: '🏘️', a11y: 'Gentle pace' },
      { time: '8:00 PM', name: 'Campfire Dinner & Storytelling', duration: '2 hrs', icon: '🔥', a11y: 'Seating at campfire' },
    ],
  },
  {
    day: 3, title: 'Culture & Departure',
    activities: [
      { time: '7:30 AM', name: 'Early Morning Farm Walk', duration: '1 hr', icon: '🌅', a11y: 'Easy walking' },
      { time: '9:00 AM', name: 'Traditional Breakfast', duration: '45 min', icon: '☕', a11y: 'Accessible dining' },
      { time: '10:00 AM', name: 'Local Craft Activity', duration: '1.5 hrs', icon: '🎨', a11y: 'Seated workshop' },
      { time: '12:00 PM', name: 'Farewell Farm Lunch', duration: '1.5 hrs', icon: '🍛', a11y: 'Accessible dining' },
      { time: '2:30 PM', name: 'Farm Store Visit', duration: '45 min', icon: '🛍️', a11y: 'Fully accessible' },
      { time: '3:30 PM', name: 'Check-out', duration: '', icon: '🚗', a11y: 'Assistance available' },
    ],
  },
]

export default function MyItinerary({ navigate, goBack, user, booking }: Props) {
  const itinerary = booking.itinerary && booking.itinerary.length > 0 ? booking.itinerary : sampleItinerary
  const nights = booking.nights || itinerary.length
  const acc = booking.accommodation

  const dayColors = ['#2B5219', '#5A7A3A', '#7A4828']

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '60px' }}>
      <div style={{ background: '#2B5219', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={goBack} aria-label="Go back"
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '8px 14px', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}>
          ← Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>My Itinerary</h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Your Personalized AI Itinerary</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3.5vw,2rem)', color: 'white', marginBottom: '8px' }}>
                Hi {user.name}! 🌾
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                {acc?.name || 'Private Farm Cottage'} · {nights} night{nights !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('my-bookings')}
                style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600 }}>
                📋 View Booking
              </button>
              <button onClick={() => navigate('ai-planner', { aiStep: 'customize' })}
                style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700 }}>
                ✏️ Customize Itinerary
              </button>
            </div>
          </div>
        </div>

        {/* Days */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {itinerary.map((day, dayIdx) => {
            const activities = 'activities' in day ? day.activities : sampleItinerary[dayIdx]?.activities || []
            const title = 'title' in day ? day.title : sampleItinerary[dayIdx]?.title || `Day ${dayIdx + 1}`
            const dayNum = 'day' in day ? day.day : dayIdx + 1
            const color = dayColors[dayIdx % dayColors.length]

            return (
              <div key={dayIdx} style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8DCC8', overflow: 'hidden' }}>
                {/* Day header */}
                <div style={{ background: color, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: '1.1rem', flexShrink: 0 }}>
                    {dayNum}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', fontWeight: 700 }}>
                    Day {dayNum} — {String(title)}
                  </h3>
                </div>

                {/* Activities */}
                <div style={{ padding: '16px 22px' }}>
                  {activities.map((act: any, actIdx: number) => (
                    <div key={actIdx} style={{ display: 'flex', gap: '16px', paddingBottom: actIdx < activities.length - 1 ? '16px' : '0', marginBottom: actIdx < activities.length - 1 ? '16px' : '0', borderBottom: actIdx < activities.length - 1 ? '1px solid #F5EFE0' : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F5EFE0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          {act.icon || '📌'}
                        </div>
                        {actIdx < activities.length - 1 && (
                          <div style={{ width: '2px', flex: 1, minHeight: '20px', background: '#E8DCC8' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 700, color: color }}>
                            {act.time || ''}
                          </span>
                          {act.duration && (
                            <span style={{ fontSize: '0.75rem', color: '#9A8870' }}>· {act.duration}</span>
                          )}
                        </div>
                        <div style={{ fontWeight: 700, color: '#2A2015', fontSize: '0.92rem', marginBottom: '3px' }}>
                          {act.name || (act as any).name || ''}
                        </div>
                        {(act.a11y || (act.accessibility && (act.accessibility as string[]).length > 0)) && (
                          <div style={{ fontSize: '0.78rem', color: '#6A5840', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                            <span style={{ color: '#2B6A1A' }}>♿</span>
                            <span>{act.a11y || (act.accessibility as string[]).join(' · ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('home')}
            style={{ flex: 1, minWidth: '140px', padding: '13px', background: 'transparent', color: '#2B5219', border: '2px solid #D4C4A0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}>
            ← Back to Home
          </button>
          <button onClick={() => navigate('my-bookings')}
            style={{ flex: 1, minWidth: '140px', padding: '13px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 700 }}>
            📋 My Bookings
          </button>
        </div>
      </div>
    </div>
  )
}
