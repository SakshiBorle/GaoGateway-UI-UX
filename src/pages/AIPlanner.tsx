import { useState, useEffect } from 'react'
import type { Page, BookingState, CartItem, AccessibilityConfig, GeneratedDay, PlannerPrefs, UserProfile } from '../types'
import PersonalItinerary from './PersonalItinerary'
import { formatActivityDuration, getActivityLibrary } from '../activityLibrary'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  pageData: Record<string, any>
  booking: BookingState
  setBooking: (b: BookingState) => void
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
  a11y: AccessibilityConfig
  user: UserProfile | null
}

type PlannerStep = 'form' | 'loading' | 'itinerary' | 'customize' | 'personal' | 'review' | 'confirmation'

const TRAVEL_TYPES = [
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', desc: 'Parents & children' },
  { id: 'couple', label: 'Couple', icon: '💑', desc: 'Romantic getaway' },
  { id: 'friends', label: 'Friends', icon: '🧑‍🤝‍🧑', desc: 'Group of friends' },
  { id: 'solo', label: 'Solo', icon: '🧘', desc: 'Solo traveller' },
  { id: 'seniors', label: 'Senior Citizens', icon: '👴👵', desc: 'Senior-friendly' },
]

const A11Y_OPTIONS = [
  { id: 'wheelchair', label: 'Wheelchair-friendly activities', icon: '♿' },
  { id: 'easy-walk', label: 'Easy walking activities', icon: '🚶' },
  { id: 'audio', label: 'Audio guidance', icon: '🔊' },
  { id: 'captions', label: 'Captions', icon: '💬' },
  { id: 'senior', label: 'Senior-friendly activities', icon: '👴' },
]

function generateItinerary(prefs: PlannerPrefs): GeneratedDay[] {
  const { days, travelType, interests, accessibility } = prefs
  const hasFarming = interests.includes('farming')
  const hasFood = interests.includes('food')
  const hasNature = interests.includes('nature')
  const hasCulture = interests.includes('culture')
  const hasRecreation = interests.includes('recreation')
  const isSenior = travelType === 'seniors' || accessibility.includes('senior')
  const isFamily = travelType === 'family'

  const allDays: GeneratedDay[] = []

  for (let d = 1; d <= Math.min(days, 3); d++) {
    const activities: GeneratedDay['activities'] = []

    if (d === 1) {
      activities.push({ time: '10:00 AM', name: 'Check-in & Welcome Tour', duration: '1 hour', description: 'Arrive at GaonGetaway, settle in, and enjoy a welcome orientation of the farm with fresh coconut water.', icon: '🏡', accessibility: ['Accessible pathways', 'Seated orientation available'] })
      if (hasFarming) activities.push({ time: '11:30 AM', name: 'Guided Farm Tour', duration: '1.5 hours', description: 'Walk through the organic farm with an expert host. Learn about crops, farming methods, and the local ecosystem.', icon: '🌾', accessibility: isSenior ? ['Easy walking pace', 'Rest stops included', 'Seated areas available'] : ['Accessible pathways'] })
      activities.push({ time: '1:00 PM', name: 'Traditional Farm-to-Table Lunch', duration: '1 hour', description: 'Enjoy a freshly prepared traditional Maharashtra thali made from farm-harvested vegetables and grains.', icon: '🍽️', accessibility: ['Fully accessible dining hall', 'Wheelchair accessible', 'All dietary needs accommodated'] })
      if (hasFarming) activities.push({ time: '3:00 PM', name: 'Organic Farming Workshop', duration: '2 hours', description: 'Get hands-on with organic farming — plant seeds, learn composting, and harvest fresh produce to take home.', icon: '🌱', accessibility: ['Accessible workshop area', 'Seated options available'] })
      else if (hasNature) activities.push({ time: '3:00 PM', name: 'Nature Walk & Bird Watching', duration: '2 hours', description: 'Explore the countryside trails and spot native birds with an expert naturalist guide.', icon: '🦋', accessibility: ['Easy walking path', 'Binoculars provided'] })
      activities.push({ time: '6:00 PM', name: 'Sunset at the Viewpoint', duration: '45 mins', description: 'Watch the golden sunset over the farm fields from our beautiful hilltop viewpoint.', icon: '🌅', accessibility: ['Accessible viewpoint', 'Seating available'] })
      activities.push({ time: '8:00 PM', name: 'Traditional Dinner', duration: '1.5 hours', description: 'A warm, traditional dinner around the courtyard. Seasonal local food, folklore music, and community gathering.', icon: '🌙', accessibility: ['Accessible dining area', 'Dietary needs accommodated'] })
    } else if (d === 2) {
      activities.push({ time: '8:00 AM', name: 'Farm Breakfast', duration: '45 mins', description: 'Start the day with a wholesome farm breakfast — fresh milk, homemade butter, traditional bread, and seasonal fruits.', icon: '🌄', accessibility: ['Accessible breakfast area'] })
      if (hasFarming) activities.push({ time: '9:00 AM', name: 'Crop Harvesting Experience', duration: '2 hours', description: 'Join local farmers in the fields for the morning harvest. Pick vegetables, fruits, and learn traditional harvesting techniques.', icon: '🌽', accessibility: isSenior ? ['Easy harvesting activities', 'Seated areas available', 'Light work only'] : ['Accessible fields'] })
      if (hasFood) activities.push({ time: '11:30 AM', name: 'Traditional Food Preparation Class', duration: '2 hours', description: 'Cook authentic Maharashtra dishes with local recipes — stone-ground spices, clay pots, and traditional techniques.', icon: '🫕', accessibility: ['Seated cooking class', 'Adapted tools available'] })
      activities.push({ time: '1:30 PM', name: 'Farm Lunch', duration: '1 hour', description: 'Enjoy the dishes you prepared in the cooking class for a satisfying and personal lunch experience.', icon: '🥘', accessibility: ['Accessible dining'] })
      if (hasCulture) activities.push({ time: '3:00 PM', name: 'Village Life Experience', duration: '2.5 hours', description: 'Visit the nearby village, meet local families, observe traditional crafts, and experience authentic rural daily life.', icon: '🏘️', accessibility: isSenior ? ['Gentle pace', 'Seated rest areas throughout', 'Light walking'] : ['Village paths accessible'] })
      else if (hasNature) activities.push({ time: '3:00 PM', name: 'Nature & Forest Trail', duration: '2 hours', description: 'Explore forested areas and open meadows with a naturalist. Learn about local plants, trees, and ecosystems.', icon: '🌳', accessibility: ['Flat paths available', 'Senior-friendly pacing'] })
      if (hasRecreation || isFamily) activities.push({ time: '6:30 PM', name: 'Traditional Indoor Games', duration: '1.5 hours', description: 'Evening games in the recreation hall — Carrom, Chess, Pallanguzhi, and other traditional rural games. Fun for all ages!', icon: '🎲', accessibility: ['Fully accessible indoors', 'Seated activities', 'All ages welcome'] })
      activities.push({ time: '8:00 PM', name: 'Campfire Dinner & Storytelling', duration: '2 hours', description: 'A magical campfire dinner under the stars with folk stories, local music, and traditional dishes from the farm.', icon: '🔥', accessibility: ['Seating provided at campfire', 'Audio captions available'] })
    } else if (d === 3) {
      activities.push({ time: '7:30 AM', name: 'Early Morning Farm Walk', duration: '1 hour', description: 'A peaceful early morning walk through the farm as the mist lifts. Watch animals, see early farming activities, and breathe fresh air.', icon: '🌅', accessibility: ['Easy walking', 'Guided walk', 'Senior-friendly'] })
      activities.push({ time: '9:00 AM', name: 'Traditional Breakfast', duration: '45 mins', description: 'Leisurely breakfast with traditional poha, upma, fresh fruits, and masala chai — before your final morning activity.', icon: '☕', accessibility: ['Accessible dining'] })
      if (hasCulture) activities.push({ time: '10:00 AM', name: 'Local Craft Workshop', duration: '2 hours', description: 'Learn traditional crafts — pottery, weaving, or natural dye techniques from master artisans. Take home your creation!', icon: '🏺', accessibility: ['Seated workshop', 'Adapted tools for all abilities'] })
      else if (hasFarming) activities.push({ time: '10:00 AM', name: 'Seed Saving & Organic Garden', duration: '1.5 hours', description: 'Learn the ancient practice of seed saving and understand the importance of seed diversity in organic agriculture.', icon: '🌰', accessibility: ['Accessible garden area', 'Seated areas available'] })
      if (hasFood) activities.push({ time: '12:00 PM', name: 'Farm Store & Farewell Lunch', duration: '2 hours', description: 'Browse our farm store for fresh organic products, then enjoy a special farewell lunch with all your favourite farm flavours.', icon: '🛒', accessibility: ['Fully accessible store', 'Accessible dining'] })
      else activities.push({ time: '12:30 PM', name: 'Farewell Farm Lunch', duration: '1.5 hours', description: 'A hearty farewell meal with all your favourite flavours from the past days at GaonGetaway.', icon: '🍛', accessibility: ['Accessible dining'] })
      activities.push({ time: '3:00 PM', name: 'Check-out & Fond Farewell', duration: '30 mins', description: 'Collect your bags, receive a farm gift from us, and carry home memories that will last a lifetime.', icon: '👋', accessibility: ['Accessible checkout', 'Luggage assistance available'] })
    }

    allDays.push({
      day: d,
      title: d === 1 ? 'Discover the Farm' : d === 2 ? 'Experience Rural Life' : 'Culture & Departure',
      theme: d === 1 ? '🌾 Arrival & Exploration' : d === 2 ? '🌿 Deep Immersion' : '🏺 Memories & Farewell',
      activities,
    })
  }

  return allDays
}

function generateDetailedItinerary(prefs: PlannerPrefs, variation = 0): GeneratedDay[] {
  const library = getActivityLibrary()
  const selected = prefs.interests
    .map(id => library.find(activity => activity.id === id))
    .filter((activity): activity is NonNullable<typeof activity> => !!activity)
  const pool = selected.length ? selected : library.slice(0, 5)
  const dayCount = Math.max(1, Math.min(prefs.days, 7))
  const timeSlots = ['9:00 AM', '10:30 AM', '3:00 PM', '4:45 PM', '6:15 PM']
  let cursor = variation % pool.length

  return Array.from({ length: dayCount }, (_, index) => {
    const activities: GeneratedDay['activities'] = [
      { time: '8:00 AM', name: 'Farm Breakfast', duration: '1 hour', description: 'Begin with a relaxed seasonal breakfast.', icon: '◒', accessibility: ['Accessible dining'] },
    ]
    const activitiesToday = Math.min(index === dayCount - 1 ? 2 : 3, pool.length)
    for (let slot = 0; slot < activitiesToday; slot += 1) {
      const activity = pool[cursor % pool.length]
      cursor += 1
      activities.push({
        time: timeSlots[slot < 2 ? slot : slot + 1],
        name: activity.name,
        duration: formatActivityDuration(activity.minutes),
        description: activity.description,
        icon: activity.icon,
        accessibility: prefs.accessibility.length ? ['Adapted to your saved accessibility preferences'] : ['Support available on request'],
      })
    }
    activities.push(
      { time: '1:00 PM', name: 'Farm-to-Table Lunch', duration: '1 hour', description: 'Enjoy a seasonal lunch prepared from farm produce.', icon: '🍽️', accessibility: ['Accessible dining'] },
      { time: '8:00 PM', name: 'Traditional Dinner', duration: '1.5 hours', description: 'Close the day with a relaxed traditional dinner.', icon: '◒', accessibility: ['Accessible dining'] },
    )
    return {
      day: index + 1,
      title: index === 0 ? 'Arrival and Discovery' : index === dayCount - 1 ? 'A Gentle Farewell' : 'Your Chosen Experiences',
      theme: 'Planned around your selected activities',
      activities: activities.sort((a, b) => {
        const parse = (value: string) => {
          const [clock, period] = value.split(' ')
          let [hour, minute] = clock.split(':').map(Number)
          if (period === 'PM' && hour !== 12) hour += 12
          return hour * 60 + minute
        }
        return parse(a.time) - parse(b.time)
      }),
    }
  })
}

export default function AIPlanner({ navigate, goBack, booking, setBooking, pageData, user, a11y }: Props) {
  const [step, setStep] = useState<PlannerStep>((pageData?.aiStep as PlannerStep) || 'form')
  const [formStep, setFormStep] = useState(0) // 0=people, 1=days, 2=travelType, 3=interests, 4=a11y
  const [people, setPeople] = useState(booking.adults + booking.children || 4)
  const [days] = useState(booking.nights || 3)
  const [travelType, setTravelType] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [a11yPrefs, setA11yPrefs] = useState<string[]>([])
  const [itinerary, setItinerary] = useState<GeneratedDay[]>(booking.itinerary || [])
  const [customizing, setCustomizing] = useState<{ dayIdx: number; actIdx: number } | null>(null)
  const [loadingDots, setLoadingDots] = useState(0)
  const [bookingId] = useState(`RR-${new Date().getFullYear()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`)
  const [regenerateCount, setRegenerateCount] = useState(0)
  const [removedActivities, setRemovedActivities] = useState<{ dayIdx: number; index: number; activity: GeneratedDay['activities'][number] }[]>([])
  const [interestOptions, setInterestOptions] = useState(() => getActivityLibrary().map(activity => ({ id: activity.id, label: activity.name, icon: activity.icon })))

  useEffect(() => {
    const refresh = () => setInterestOptions(getActivityLibrary().map(activity => ({ id: activity.id, label: activity.name, icon: activity.icon })))
    window.addEventListener('gaongetaway-activities-updated', refresh)
    return () => window.removeEventListener('gaongetaway-activities-updated', refresh)
  }, [])

  // Loading animation
  useEffect(() => {
    if (step !== 'loading') return
    const interval = setInterval(() => setLoadingDots(d => (d + 1) % 4), 500)
    const timeout = setTimeout(() => {
      const prefs: PlannerPrefs = { people, days, travelType, interests, accessibility: a11yPrefs }
      const generated = generateDetailedItinerary(prefs, regenerateCount)
      setItinerary(generated)
      setBooking({ ...booking, plannerPrefs: prefs, itinerary: generated, adults: people, nights: days })
      setStep('itinerary')
      clearInterval(interval)
    }, 2800)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [step, regenerateCount])

  const toggleInterest = (id: string) => setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const toggleA11y = (id: string) => setA11yPrefs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const handleGenerate = () => {
    if (!travelType || interests.length === 0) return
    setStep('loading')
  }

  const handleRegenerate = () => {
    setRegenerateCount(c => c + 1)
    setStep('loading')
  }

  const handleConfirmBooking = () => {
    setBooking({ ...booking, itinerary, plannerPrefs: { people, days, travelType, interests, accessibility: a11yPrefs } })
    setStep('review')
  }

  if (step === 'personal') {
    return <PersonalItinerary
      booking={booking}
      setBooking={setBooking}
      onBack={() => setStep(itinerary.length ? 'itinerary' : 'form')}
      onSaved={(plan, chosenInterests) => {
        setItinerary(plan)
        setTravelType('personal')
        setInterests(chosenInterests)
      }}
      onContinue={() => setStep('review')}
      language={a11y.language}
    />
  }

  // ── LOADING ──
  if (step === 'loading') {
    const loadingMessages = [
      'Analysing your preferences...',
      'Curating farm experiences...',
      'Planning your rural adventure...',
      'Creating your personalized retreat...',
    ]
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '32px', animation: 'leafFloat 2s ease-in-out infinite' }}>🌾</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'white', marginBottom: '20px' }}>
          Creating Your Personalized<br />Rural Experience{'.'.repeat(loadingDots)}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '40px' }}>
          {loadingMessages[Math.min(loadingDots, loadingMessages.length - 1)]}
        </p>

        {/* Animated loading bar */}
        <div style={{ width: '100%', maxWidth: '400px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden', marginBottom: '48px' }}>
          <div style={{ height: '100%', background: '#E8C070', borderRadius: '4px', animation: 'shimmer 1.5s ease-in-out infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }} />
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '🌿', label: `${days} Days Planned` },
            { icon: '👥', label: `${people} Guests` },
            { icon: '🎯', label: interests.length > 0 ? interests.map(i => interestOptions.find(x => x.id === i)?.label).join(' · ') : 'Mixed interests' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 20px', color: 'white', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── CONFIRMATION ──
  if (step === 'confirmation') {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #5A7A3A, #2B5219)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(43,82,25,0.3)' }}>
            ✓
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#2B5219', marginBottom: '16px' }}>
            Booking Confirmed! 🌾
          </h1>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E8DCC8', marginBottom: '28px', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', background: '#F5EFE0', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#8A7860', fontWeight: 500 }}>Booking ID</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#2B5219', fontSize: '1rem' }}>{bookingId}</div>
              </div>
              <div style={{ padding: '14px', background: '#F5EFE0', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#8A7860', fontWeight: 500 }}>Duration</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#2B5219' }}>{days} Days</div>
              </div>
            </div>
            <div style={{ padding: '14px', background: '#F5EFE0', borderRadius: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#8A7860', fontWeight: 500 }}>Accommodation</div>
              <div style={{ fontWeight: 600, color: '#2A2015' }}>{booking.accommodation?.name || 'Private Farm Cottage'}</div>
            </div>
            <div style={{ padding: '14px', background: '#F5EFE0', borderRadius: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#8A7860', fontWeight: 500 }}>Guests</div>
              <div style={{ fontWeight: 600, color: '#2A2015' }}>{people} guests · {TRAVEL_TYPES.find(t => t.id === travelType)?.label || 'Group'}</div>
            </div>
            <div style={{ padding: '14px', background: '#F5EFE0', borderRadius: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#8A7860', fontWeight: 500 }}>Activities</div>
              <div style={{ fontWeight: 600, color: '#2A2015' }}>{itinerary.reduce((a, d) => a + d.activities.length, 0)} planned activities across {days} days</div>
            </div>
            <div style={{ padding: '14px', background: '#E8F4E0', borderRadius: '10px', border: '1px solid #A8D490' }}>
              <div style={{ fontSize: '0.75rem', color: '#2B6A1A', fontWeight: 700 }}>✓ CONFIRMED</div>
              <div style={{ fontSize: '0.9rem', color: '#2A2015', marginTop: '2px' }}>Confirmation sent to your email</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('home')}
              aria-label="Back to Home"
              style={{ padding: '14px 24px', background: 'transparent', color: '#2B5219', border: '2px solid #2B5219', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600 }}>
              ← Back to Home
            </button>
            <button onClick={() => setStep('itinerary')}
              aria-label="View My Booking"
              style={{ padding: '14px 24px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700 }}>
              📋 View My Booking
            </button>
            <button onClick={() => navigate('experiences')}
              aria-label="Explore More Experiences"
              style={{ padding: '14px 24px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700 }}>
              Explore More Experiences →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── REVIEW ──
  if (step === 'review') {
    const totalActivities = itinerary.reduce((a, d) => a + d.activities.length, 0)
    const estimatedTotal = (booking.accommodation?.price || 5800) * days + 2000

    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '40px' }}>
        <div style={{ background: '#2B5219', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setStep('itinerary')} aria-label="Back to Itinerary"
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '8px 14px', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}>
            ← Back to Itinerary
          </button>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', color: 'white' }}>Booking Review</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', marginTop: '2px' }}>Review your GaonGetaway details before confirming.</p>
          </div>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>

          {[
            { label: 'Accommodation', icon: '🏡', value: booking.accommodation?.name || 'Private Farm Cottage' },
            { label: 'Dates', icon: '📅', value: booking.checkIn ? `${new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} → ${new Date(booking.checkOut!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : `${days} days` },
            { label: 'Nights', icon: '🌙', value: `${days} nights` },
            { label: 'Guests', icon: '👥', value: `${people} guests · ${TRAVEL_TYPES.find(t => t.id === travelType)?.label || 'Group'}` },
            { label: 'Activities', icon: '🌿', value: `${totalActivities} planned activities` },
            { label: 'Interests', icon: '🎯', value: interests.map(i => interestOptions.find(x => x.id === i)?.label).join(', ') || 'Mixed' },
            { label: 'Accessibility', icon: '♿', value: a11yPrefs.length > 0 ? `${a11yPrefs.length} requirements noted` : 'None specified' },
          ].map(({ label, icon, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'white', borderRadius: '10px', marginBottom: '8px', border: '1px solid #E8DCC8', gap: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: '#6A5840', display: 'flex', gap: '8px', alignItems: 'center' }}><span>{icon}</span>{label}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2A2015', textAlign: 'right' }}>{value}</span>
            </div>
          ))}

          <div style={{ background: '#2B5219', color: 'white', borderRadius: '12px', padding: '20px', marginTop: '16px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', opacity: 0.8 }}>Estimated Total</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Includes accommodation + activities</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>₹{estimatedTotal.toLocaleString()}</div>
          </div>

          <button
            onClick={() => {
              if (!user) {
                navigate('auth', { fromBooking: true, returnTo: 'payment', aiStep: 'review' })
              } else {
                navigate('payment')
              }
            }}
            aria-label="Confirm and Pay"
            style={{ width: '100%', padding: '18px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 4px 16px rgba(200,144,42,0.4)' }}>
            {user ? 'Confirm & Pay →' : 'Login to Confirm & Pay →'}
          </button>
        </div>
      </div>
    )
  }

  // ── CUSTOMIZE ──
  if (step === 'customize') {
    const recommendationTimes = ['9:00 AM', '10:30 AM', '3:00 PM', '4:45 PM', '6:15 PM']
    const recommendations: GeneratedDay['activities'] = getActivityLibrary().map((activity, index) => ({
      time: recommendationTimes[index % recommendationTimes.length],
      name: activity.name,
      duration: formatActivityDuration(activity.minutes),
      description: activity.description,
      icon: activity.icon,
      accessibility: ['Support available on request'],
    }))
    const updateDay = (dayIdx: number, activities: GeneratedDay['activities']) => setItinerary(current => current.map((day, index) => index === dayIdx ? { ...day, activities } : day))
    const removeActivity = (dayIdx: number, actIdx: number) => {
      const activity = itinerary[dayIdx].activities[actIdx]
      setRemovedActivities(items => [...items, { dayIdx, index: actIdx, activity }])
      updateDay(dayIdx, itinerary[dayIdx].activities.filter((_, index) => index !== actIdx))
    }
    const restoreActivity = (removedIndex: number) => {
      const removed = removedActivities[removedIndex]
      const activities = [...itinerary[removed.dayIdx].activities]
      activities.splice(Math.min(removed.index, activities.length), 0, removed.activity)
      updateDay(removed.dayIdx, activities)
      setRemovedActivities(items => items.filter((_, index) => index !== removedIndex))
    }
    const moveActivity = (dayIdx: number, actIdx: number, direction: -1 | 1) => {
      const activities = [...itinerary[dayIdx].activities]
      const target = actIdx + direction
      if (target < 0 || target >= activities.length) return
      ;[activities[actIdx], activities[target]] = [activities[target], activities[actIdx]]
      updateDay(dayIdx, activities)
    }
    const changeActivity = (dayIdx: number, actIdx: number) => {
      const current = itinerary[dayIdx].activities[actIdx]
      const replacement = recommendations.find(item => item.name !== current.name) || recommendations[0]
      updateDay(dayIdx, itinerary[dayIdx].activities.map((item, index) => index === actIdx ? { ...replacement, time: current.time } : item))
    }
    return (
      <div className="itinerary-editor">
        <div className="itinerary-editor__inner">
          <button className="back-link" onClick={() => setStep('itinerary')}>← Back to itinerary</button>
          <header><p className="eyebrow">You are in control</p><h1>Edit Activities</h1><p>Remove, restore, change, rearrange, or add recommendations. Your dates remain unchanged.</p></header>
          {itinerary.map((day, dayIdx) => <section key={day.day}><h2>Day {day.day}: {day.title}</h2>{day.activities.map((activity, actIdx) => <article className="editable-activity" key={`${activity.time}-${activity.name}`}><time>{activity.time}</time><div><strong>{activity.icon} {activity.name}</strong><span>{activity.duration}</span></div><div className="activity-actions"><button onClick={() => moveActivity(dayIdx, actIdx, -1)} disabled={actIdx === 0}>↑</button><button onClick={() => moveActivity(dayIdx, actIdx, 1)} disabled={actIdx === day.activities.length - 1}>↓</button><button onClick={() => changeActivity(dayIdx, actIdx)}>Change</button><button onClick={() => removeActivity(dayIdx, actIdx)}>Remove</button></div></article>)}
          <div className="add-activities"><span>Add Activity</span>{recommendations.filter(item => !day.activities.some(activity => activity.name === item.name)).slice(0, 4).map(item => <button key={item.name} onClick={() => updateDay(dayIdx, [...day.activities, item])}>+ {item.name}</button>)}</div></section>)}
          {removedActivities.length > 0 && <section className="removed-activities"><h2>Removed Activities</h2>{removedActivities.map((item, index) => <button key={`${item.activity.name}-${index}`} onClick={() => restoreActivity(index)}>Restore {item.activity.name}</button>)}</section>}
          <button className="button button--primary save-itinerary" onClick={() => { setBooking({ ...booking, itinerary }); setCustomizing(null); setStep('itinerary') }}>Save Changes</button>
        </div>
      </div>
    )
  }

  // ── ITINERARY ──
  if (step === 'itinerary') {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '60px' }}>
        {/* Hero banner */}
        <div style={{ background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
              {[
                `${days} Days`, `${people} Guests`,
                TRAVEL_TYPES.find(t => t.id === travelType)?.label || 'Group',
                interests.map(i => interestOptions.find(x => x.id === i)?.label).join(' + ') || 'Mixed',
              ].map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)' }}>{tag}</span>
              ))}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'white', marginBottom: '8px' }}>
              Your Personalized AI Itinerary
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>AI-curated day-by-day GaonGetaway itinerary based on your preferences</p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ background: 'white', borderBottom: '1px solid #E8DCC8', padding: '14px 24px', display: 'flex', gap: '10px', justifyContent: 'space-between', flexWrap: 'wrap', position: 'sticky', top: '72px', zIndex: 5, alignItems: 'center' }}>
          <button onClick={goBack}
            aria-label="Back to Smart Planner"
            style={{ padding: '10px 18px', background: '#F5EFE0', color: '#2B5219', border: '2px solid #D4C4A0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}>
            ← Back to Smart Planner
          </button>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleRegenerate}
              style={{ padding: '10px 18px', background: '#F5EFE0', color: '#2B5219', border: '2px solid #D4C4A0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600 }}>
              🔄 Regenerate Plan
            </button>
            <button onClick={() => { setStep('form') }}
              style={{ padding: '10px 18px', background: '#F5EFE0', color: '#7A4828', border: '2px solid #D4C4A0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600 }}>
              ✏️ Customize Itinerary
            </button>
            <button onClick={() => setStep('personal')}
              style={{ padding: '10px 18px', background: '#F5EFE0', color: '#2B5219', border: '2px solid #D4C4A0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600 }}>
              Create My Own
            </button>
            <button onClick={handleConfirmBooking}
              aria-label="Continue to Booking Review"
              style={{ padding: '10px 22px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 700 }}>
              Continue to Booking Review →
            </button>
          </div>
        </div>

        {/* Days */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
          {itinerary.map((day, dayIdx) => (
            <div key={day.day} style={{ marginBottom: '40px', animationDelay: `${dayIdx * 0.1}s` }} className="animate-fade-in-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2B5219', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                  {day.day}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#2B5219', fontWeight: 700 }}>
                    Day {day.day} — {day.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#8A7860' }}>{day.theme}</div>
                </div>
              </div>

              <div style={{ paddingLeft: '32px', borderLeft: '2px solid #C8DEB0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {day.activities.map((activity, actIdx) => (
                  <div key={actIdx} style={{ position: 'relative', paddingLeft: '24px', paddingBottom: '20px' }}>
                    {/* Timeline dot */}
                    <div style={{ position: 'absolute', left: '-7px', top: '14px', width: '12px', height: '12px', borderRadius: '50%', background: '#5A7A3A', border: '2px solid white', boxShadow: '0 0 0 2px #C8DEB0' }} />

                    <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E8DCC8', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(43,82,25,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, color: '#C8902A', fontSize: '0.85rem' }}>{activity.time}</span>
                            <span style={{ fontSize: '1rem' }}>{activity.icon}</span>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', fontWeight: 600 }}>{activity.name}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: '#6A5840', lineHeight: 1.6, marginBottom: '8px' }}>{activity.description}</p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: '#6A5840', background: '#F5EFE0', padding: '3px 8px', borderRadius: '10px' }}>⏱ {activity.duration}</span>
                            {activity.accessibility.slice(0, 1).map(a => (
                              <span key={a} style={{ fontSize: '0.75rem', color: '#2B6A1A', background: '#E8F4E0', padding: '3px 8px', borderRadius: '10px', fontWeight: 600 }}>♿ {a}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => { setCustomizing({ dayIdx, actIdx }); setStep('customize') }}
                          style={{ background: '#F5EFE0', border: '1px solid #D4C4A0', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#4A3A28', flexShrink: 0, transition: 'all 0.15s' }}
                          aria-label={`Edit ${activity.name}`}>
                          ✏️ Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Final CTA */}
          <div style={{ background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', borderRadius: '16px', padding: '32px', textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: '12px' }}>
              Ready for Your GaonGetaway?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: '0.95rem' }}>
              Confirm this itinerary and secure your booking at GaonGetaway.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setStep('customize')}
                style={{ padding: '12px 24px', background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                ✏️ Edit Activities
              </button>
              <button onClick={() => setStep('personal')}
                style={{ padding: '12px 24px', background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                Create My Own Itinerary
              </button>
              <button onClick={handleRegenerate}
                style={{ padding: '12px 24px', background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                🔄 Regenerate
              </button>
              <button onClick={handleConfirmBooking}
                style={{ padding: '12px 28px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700, boxShadow: '0 4px 16px rgba(200,144,42,0.4)' }}>
                ✅ Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM ──
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '60px' }}>
      {/* Back nav */}
      <div style={{ background: '#2B5219', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={goBack}
          aria-label="Go back to accessibility requirements"
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '8px 14px', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}
        >
          ← Back
        </button>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Accessibility Requirements → AI Smart Stay Planner</span>
      </div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2B5219, #5A7A3A)', padding: '36px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '20px', marginBottom: '16px' }}>
          <span>✨</span>
          <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>AI-Powered Planner</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'white', marginBottom: '12px' }}>
          Plan Your Perfect Getaway
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Tell us about your group and preferences. Our AI will create a personalized day-by-day GaonGetaway itinerary just for you.
        </p>
      </div>

      {/* Form steps progress */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8DCC8', padding: '16px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {['People', 'Group', 'Interests', 'Accessibility'].map((label, i) => {
            const actualStep = [0, 2, 3, 4][i]
            return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: actualStep < formStep ? '#5A7A3A' : actualStep === formStep ? '#2B5219' : '#E8DCC8', color: actualStep <= formStep ? 'white' : '#8A7860', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                {actualStep < formStep ? '✓' : i + 1}
              </div>
              {i < 3 && <div style={{ width: '16px', height: '2px', background: actualStep < formStep ? '#5A7A3A' : '#E8DCC8' }} />}
            </div>
          )})}
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="planner-choice">
          <div><strong>Prefer to plan it yourself?</strong><span>Build a daily schedule around your own routine.</span></div>
          <button onClick={() => setStep('personal')}>Create My Own Itinerary</button>
        </div>
        {/* Step 0: People */}
        {formStep === 0 && (
          <div className="animate-fade-in-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#2B5219', marginBottom: '8px', textAlign: 'center' }}>How many people?</h2>
            <p style={{ color: '#6A5840', textAlign: 'center', marginBottom: '40px' }}>Including adults and children.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '40px' }}>
              <button onClick={() => setPeople(p => Math.max(1, p - 1))} aria-label="Decrease people"
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #D4C4A0', background: 'white', cursor: 'pointer', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B5219' }}>
                −
              </button>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 700, color: '#2B5219' }} aria-live="polite" aria-label={`${people} people`}>{people}</span>
                <div style={{ color: '#8A7860', fontSize: '0.9rem' }}>people</div>
              </div>
              <button onClick={() => setPeople(p => Math.min(20, p + 1))} aria-label="Increase people"
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: '#2B5219', cursor: 'pointer', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                +
              </button>
            </div>
            <button onClick={() => setFormStep(2)}
              style={{ width: '100%', padding: '16px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 700 }}>
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Travel Type */}
        {formStep === 2 && (
          <div className="animate-fade-in-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#2B5219', marginBottom: '8px', textAlign: 'center' }}>Who are you travelling with?</h2>
            <p style={{ color: '#6A5840', textAlign: 'center', marginBottom: '32px' }}>This helps us tailor activities and pacing.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }} role="radiogroup" aria-label="Travel type">
              {TRAVEL_TYPES.map(type => (
                <button key={type.id} onClick={() => setTravelType(type.id)} role="radio" aria-checked={travelType === type.id}
                  style={{ padding: '20px 16px', border: `2px solid ${travelType === type.id ? '#2B5219' : '#D4C4A0'}`, borderRadius: '12px', background: travelType === type.id ? 'rgba(43,82,25,0.08)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s ease' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{type.icon}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: travelType === type.id ? '#2B5219' : '#2A2015', fontSize: '0.9rem' }}>{type.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8A7860', marginTop: '4px' }}>{type.desc}</div>
                  {travelType === type.id && <div style={{ color: '#2B5219', fontWeight: 700, marginTop: '8px', fontSize: '0.8rem' }}>✓ Selected</div>}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setFormStep(0)} style={{ flex: 1, padding: '14px', background: '#F5EFE0', color: '#2B5219', border: '2px solid #D4C4A0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>← Back</button>
              <button onClick={() => setFormStep(3)} disabled={!travelType} style={{ flex: 2, padding: '14px', background: travelType ? '#2B5219' : '#C0B8A8', color: 'white', border: 'none', borderRadius: '10px', cursor: travelType ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {formStep === 3 && (
          <div className="animate-fade-in-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#2B5219', marginBottom: '8px', textAlign: 'center' }}>What are you interested in?</h2>
            <p style={{ color: '#6A5840', textAlign: 'center', marginBottom: '32px' }}>Select all that interest your group.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }} role="group" aria-label="Interests">
              {interestOptions.map(interest => (
                <button key={interest.id} onClick={() => toggleInterest(interest.id)} aria-pressed={interests.includes(interest.id)}
                  style={{ padding: '20px 16px', border: `2px solid ${interests.includes(interest.id) ? '#2B5219' : '#D4C4A0'}`, borderRadius: '12px', background: interests.includes(interest.id) ? '#2B5219' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s ease' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{interest.icon}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: interests.includes(interest.id) ? 'white' : '#2A2015', fontSize: '0.9rem' }}>{interest.label}</div>
                </button>
              ))}
            </div>
            {interests.length > 0 && (
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#2B5219', fontWeight: 600, marginBottom: '16px' }}>
                ✓ {interests.length} interest{interests.length !== 1 ? 's' : ''} selected
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setFormStep(2)} style={{ flex: 1, padding: '14px', background: '#F5EFE0', color: '#2B5219', border: '2px solid #D4C4A0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>← Back</button>
              <button onClick={() => setFormStep(4)} disabled={interests.length === 0} style={{ flex: 2, padding: '14px', background: interests.length > 0 ? '#2B5219' : '#C0B8A8', color: 'white', border: 'none', borderRadius: '10px', cursor: interests.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 4: Accessibility */}
        {formStep === 4 && (
          <div className="animate-fade-in-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#2B5219', marginBottom: '8px', textAlign: 'center' }}>Accessibility Preferences</h2>
            <p style={{ color: '#6A5840', textAlign: 'center', marginBottom: '32px' }}>We'll ensure suitable activities for everyone.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }} role="group" aria-label="Accessibility preferences">
              {A11Y_OPTIONS.map(opt => (
                <label key={opt.id} htmlFor={`planner-a11y-${opt.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', border: `2px solid ${a11yPrefs.includes(opt.id) ? '#2B5219' : '#D4C4A0'}`, borderRadius: '10px', cursor: 'pointer', background: a11yPrefs.includes(opt.id) ? 'rgba(43,82,25,0.06)' : 'white', transition: 'all 0.15s ease' }}>
                  <input type="checkbox" id={`planner-a11y-${opt.id}`} checked={a11yPrefs.includes(opt.id)} onChange={() => toggleA11y(opt.id)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2B5219' }} />
                  <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#2A2015', fontWeight: a11yPrefs.includes(opt.id) ? 600 : 400 }}>{opt.label}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setFormStep(3)} style={{ flex: 1, padding: '14px', background: '#F5EFE0', color: '#2B5219', border: '2px solid #D4C4A0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>← Back</button>
              <button onClick={handleGenerate}
                style={{ flex: 2, padding: '14px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(200,144,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                ✨ Generate My AI Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
