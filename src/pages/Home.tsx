import { useState } from 'react'
import type { AccessibilityConfig, BookingState, Page } from '../types'
import { translate } from '../i18n'

interface Props {
  navigate: (page: Page, data?: any) => void
  booking: BookingState
  setBooking: (booking: BookingState) => void
  a11y: AccessibilityConfig
}

const images = {
  hero: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&auto=format',
  story: 'https://images.unsplash.com/photo-1694532635472-00eb7bfb720f?w=1000&h=900&fit=crop&auto=format',
  farming: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&auto=format',
  dining: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop&auto=format',
  trails: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format',
  birds: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&h=600&fit=crop&auto=format',
  room: 'https://images.unsplash.com/photo-1694532635472-00eb7bfb720f?w=900&h=700&fit=crop&auto=format',
  cottage: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=900&h=700&fit=crop&auto=format',
  produce: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&h=700&fit=crop&auto=format',
}

const experiences = [
  { title: 'Organic Farming', description: 'Sow, harvest, and learn alongside the farmers who know this land best.', image: images.farming },
  { title: 'Farm-to-Table Dining', description: 'Seasonal Maharashtrian meals made with ingredients grown steps away.', image: images.dining },
  { title: 'Nature Trails', description: 'Walk gentle green paths through fields, orchards, and the foothills.', image: images.trails },
  { title: 'Bird Watching', description: 'Meet the resident birds of rural Maharashtra in the quiet morning hours.', image: images.birds },
]

const reviews = [
  { quote: 'A rare place where our children could be curious, muddy, and completely happy.', name: 'Meera Kulkarni' },
  { quote: 'Thoughtful accessibility and warm hosts made the whole farm feel welcoming.', name: 'Rajesh Patil' },
  { quote: 'The food tasted of the season and the pace was exactly what we needed.', name: 'Anita & Suresh' },
]

export default function Home({ navigate, booking, setBooking, a11y }: Props) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const checkAvailability = () => {
    setBooking({ ...booking, checkIn: checkIn || null, checkOut: checkOut || null, adults: guests })
    navigate('booking-flow')
  }

  return (
    <div className="home-page">
      <section className="home-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(18,38,25,.78), rgba(18,38,25,.2)), url(${images.hero})` }}>
        <div className="home-hero__content">
          <p className="eyebrow eyebrow--light">A farm stay near Pune</p>
          <h1>{a11y.language === 'hindi' ? <>जहाँ शहर<br />खेत से मिलता है।</> : a11y.language === 'marathi' ? <>जिथे शहर<br />शेताला भेटते.</> : <>Where the city<br />meets the farm.</>}</h1>
          <p>{a11y.language === 'hindi' ? 'धीमे चलें, प्रकृति से फिर जुड़ें और ग्रामीण महाराष्ट्र की सरल खुशियों का अनुभव करें।' : a11y.language === 'marathi' ? 'थोडे थांबा, निसर्गाशी पुन्हा नाते जोडा आणि ग्रामीण महाराष्ट्राचा साधा आनंद अनुभवा.' : 'Slow down, reconnect with nature, and experience the simple pleasures of rural Maharashtra.'}</p>
          <div className="hero-actions">
            <button className="button button--light" onClick={() => navigate('about')}>Explore GaonGetaway</button>
            <button className="button button--outline-light" onClick={() => navigate('booking-flow')}>{translate(a11y.language, 'book')}</button>
          </div>
        </div>
        <p className="hero-caption">Mulshi · Maharashtra</p>
      </section>

      <section className="availability-strip" aria-label="Check stay availability">
        <label><span>Check-in</span><input type="date" value={checkIn} onChange={event => setCheckIn(event.target.value)} /></label>
        <label><span>Check-out</span><input type="date" value={checkOut} min={checkIn} onChange={event => setCheckOut(event.target.value)} /></label>
        <label><span>Guests</span><select value={guests} onChange={event => setGuests(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map(value => <option key={value}>{value}</option>)}</select></label>
        <button className="button button--primary" onClick={checkAvailability}>{translate(a11y.language, 'availability')}</button>
      </section>

      <section className="editorial-section intro-section">
        <div className="intro-copy">
          <p className="eyebrow">The GaonGetaway way</p>
          <h2>A little closer to the land.</h2>
          <p className="lead">We created GaonGetaway as a gentle bridge between city life and the rhythms of a working Maharashtrian farm.</p>
          <p>Come for unhurried mornings, food with a story, and the kind of hospitality that makes every generation feel at home.</p>
          <button className="text-link" onClick={() => navigate('about')}>Read our story <span>→</span></button>
        </div>
        <div className="editorial-image">
          <img src={images.story} alt="Green fields in the Maharashtrian countryside" />
          <span>Rooted in local life</span>
        </div>
      </section>

      <section className="feature-line" aria-label="What makes GaonGetaway special">
        {[
          ['01', 'Experience the Farm', 'Real, hands-on rural experiences for every age.'],
          ['02', 'Farm-to-Table Dining', 'Local recipes shaped by what is growing today.'],
          ['03', 'Reconnect with Nature', 'Open skies, birdsong, and room to breathe.'],
        ].map(([number, title, copy]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
      </section>

      <section className="section-shell experiences-section">
        <div className="section-heading-row">
          <div><p className="eyebrow">Things to do</p><h2>Experiences at GaonGetaway</h2></div>
          <button className="text-link desktop-only" onClick={() => navigate('experiences')}>Explore all experiences <span>→</span></button>
        </div>
        <div className="experience-grid">
          {experiences.map((experience, index) => (
            <article className={index === 0 ? 'experience-card experience-card--featured' : 'experience-card'} key={experience.title}>
              <div className="experience-card__image"><img src={experience.image} alt="" /></div>
              <div className="experience-card__copy"><h3>{experience.title}</h3><p>{experience.description}</p><button onClick={() => navigate('experiences')}>View experience <span>→</span></button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="stay-section">
        <div className="section-shell">
          <div className="section-heading-row">
            <div><p className="eyebrow">Rest well</p><h2>Stay with us.</h2><p className="section-intro">Simple comforts, farm views, and quiet nights.</p></div>
            <button className="button button--secondary desktop-only" onClick={() => navigate('booking-flow')}>Check Availability</button>
          </div>
          <div className="stay-grid">
            {[
              { name: 'Farmhouse Room', price: '₹3,500', image: images.room, copy: 'A warm, rustic room close to the heart of the farm.' },
              { name: 'Private Farm Cottage', price: '₹5,800', image: images.cottage, copy: 'A peaceful private cottage for families and longer stays.' },
            ].map(stay => (
              <article className="stay-card" key={stay.name}>
                <img src={stay.image} alt={stay.name} />
                <div><p className="stay-card__price">From {stay.price} / night</p><h3>{stay.name}</h3><p>{stay.copy}</p><button className="text-link" onClick={() => navigate('stay')}>View details <span>→</span></button></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="farm-table">
        <div className="farm-table__image"><img src={images.produce} alt="Fresh seasonal produce from the farm" /></div>
        <div className="farm-table__copy">
          <p className="eyebrow">Bring the farm home</p>
          <h2>From our farm<br />to your table.</h2>
          <p>Organic honey, heritage rice, fresh vegetables, and seasonal produce—grown thoughtfully and packed with care.</p>
          <div className="product-list"><span>Organic Honey</span><span>Heritage Rice</span><span>Fresh Vegetables</span><span>Seasonal Produce</span></div>
          <button className="button button--secondary" onClick={() => navigate('farm-store')}>Explore Farm Store</button>
        </div>
      </section>

      <section className="offer-banner">
        <div><p className="eyebrow eyebrow--light">Seasonal offer</p><h2>Harvest Season Escape</h2><p>Stay three nights and experience the farm at its best.</p></div>
        <button className="button button--light" onClick={() => navigate('stay')}>View Offer</button>
      </section>

      <section className="section-shell review-section">
        <div className="section-heading-row"><div><p className="eyebrow">Guest book</p><h2>What our guests say</h2></div><button className="text-link desktop-only" onClick={() => navigate('reviews')}>Read all reviews <span>→</span></button></div>
        <div className="review-grid">
          {reviews.map(review => <blockquote key={review.name}><div aria-label="5 out of 5 stars">★★★★★</div><p>“{review.quote}”</p><cite>{review.name}</cite></blockquote>)}
        </div>
      </section>

      <section className="final-cta">
        <p className="eyebrow">Your countryside pause</p>
        <h2>Ready to slow down?</h2>
        <p>Plan your GaonGetaway.</p>
        <button className="button button--primary" onClick={() => navigate('booking-flow')}>Book a Stay</button>
      </section>
    </div>
  )
}
