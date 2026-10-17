import { useState } from 'react'
import type { BookingState, ConfirmedBooking, Page, UserProfile } from '../types'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  user: UserProfile
  booking: BookingState
  confirmedBooking: ConfirmedBooking | null
}

const formatDate = (value: string | null) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export default function MyBookings({ navigate, goBack, user, confirmedBooking }: Props) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  return (
    <div className="page-shell bookings-page">
      <button className="back-link" onClick={goBack}>← Back to profile</button>
      <header className="page-hero page-hero--compact"><p className="eyebrow">Your stays</p><h1>My Bookings</h1><p>Upcoming and past GaonGetaway visits for {user.name}.</p></header>
      <div className="booking-tabs" role="tablist" aria-label="Booking history"><button role="tab" aria-selected={tab === 'upcoming'} className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>Upcoming</button><button role="tab" aria-selected={tab === 'past'} className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>Past</button></div>
      <section className="bookings-list">
        {tab === 'past' ? (
          <div className="empty-bookings"><h2>No past bookings yet.</h2><p>Completed stays will appear here.</p><button className="button button--primary" onClick={() => setTab('upcoming')}>View Upcoming Bookings</button></div>
        ) : confirmedBooking ? (
          <article className="booking-record">
            <div className="booking-record__top"><div><p className="eyebrow">Confirmed</p><h2>{confirmedBooking.booking.accommodation?.name || 'Private Farm Cottage'}</h2><span>Booking ID: {confirmedBooking.id}</span></div><strong className="status-pill">Upcoming</strong></div>
            <div className="booking-record__details">
              <Detail label="Check-in" value={formatDate(confirmedBooking.booking.checkIn)} />
              <Detail label="Check-out" value={formatDate(confirmedBooking.booking.checkOut)} />
              <Detail label="Nights" value={String(confirmedBooking.booking.nights)} />
              <Detail label="Guests" value={String(confirmedBooking.booking.adults + confirmedBooking.booking.children)} />
              <Detail label="Payment" value={confirmedBooking.paymentMethod.replace('-', ' ')} />
              <Detail label="Paid" value={`₹${confirmedBooking.amountPaid.toLocaleString()}`} />
            </div>
            <div className="booking-record__actions"><button className="button button--primary" onClick={() => navigate('my-itinerary')}>View Itinerary</button><button className="button button--secondary" onClick={() => alert(`Booking ${confirmedBooking.id} is confirmed.`)}>View Booking</button></div>
          </article>
        ) : (
          <div className="empty-bookings"><h2>No upcoming bookings yet.</h2><p>Your confirmed stay will appear here immediately after checkout.</p><button className="button button--primary" onClick={() => navigate('booking-flow')}>Book a Stay</button></div>
        )}
      </section>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>
}
