import { useState } from 'react'
import type { ConfirmedBooking, Page } from '../types'
import { useMemo } from 'react'
import { formatActivityDuration, getCustomActivities, saveCustomActivities, type ActivityDefinition } from '../activityLibrary'

interface Props {
  navigate: (page: Page) => void
  confirmedBooking: ConfirmedBooking | null
  onBookingChange: (booking: ConfirmedBooking | null) => void
}

const sections = ['Overview', 'Bookings', 'Customers', 'Payments', 'Experiences', 'Activities', 'Images', 'Reviews'] as const

interface StoredReview { id: string; name: string; text: string; rating: number; date: string }

export default function AdminDashboard({ navigate, confirmedBooking, onBookingChange }: Props) {
  const [section, setSection] = useState<(typeof sections)[number]>('Overview')
  const [bookingStatus, setBookingStatus] = useState<'Confirmed' | 'Cancelled'>(confirmedBooking ? 'Confirmed' : 'Cancelled')
  const [activity, setActivity] = useState('Traditional Pottery Workshop')
  const [category, setCategory] = useState<ActivityDefinition['category']>('Culture')
  const [duration, setDuration] = useState(90)
  const [activities, setActivities] = useState<ActivityDefinition[]>(getCustomActivities)
  const [adminNotice, setAdminNotice] = useState('')
  const [imagePreview, setImagePreview] = useState(() => localStorage.getItem('gaongetaway-admin-image') || '')
  const [reviews] = useState<StoredReview[]>(() => {
    try { return JSON.parse(localStorage.getItem('gaongetaway-reviews') || '[]') } catch { return [] }
  })
  const [hiddenReviews, setHiddenReviews] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('gaongetaway-hidden-reviews') || '[]') } catch { return [] }
  })
  const [moderationReason, setModerationReason] = useState<Record<string, string>>({})
  const booking = confirmedBooking?.booking
  const updateActivities = (next: ActivityDefinition[], notice: string) => {
    setActivities(next)
    saveCustomActivities(next)
    setAdminNotice(notice)
  }
  const activityRows = useMemo(() => activities, [activities])

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button className="admin-brand" onClick={() => navigate('home')}><img src="/gaongetaway-logo.png" alt="" /><span>GaonGetaway<strong>Admin workspace</strong></span></button>
        <nav aria-label="Admin dashboard">
          {sections.map(item => <button key={item} className={section === item ? 'active' : ''} onClick={() => setSection(item)}>{item}</button>)}
        </nav>
        <button className="admin-customer-link" onClick={() => navigate('home')}>View customer website</button>
      </aside>
      <main className="admin-main">
        <header><p className="eyebrow">Property operations</p><h1>{section}</h1><p>Manage the stay experience without exposing sensitive payment details.</p></header>

        {section === 'Overview' && <><div className="admin-metrics">{[['Upcoming Arrivals', confirmedBooking ? '1' : '0'], ["Today's Check-ins", '0'], ["Today's Check-outs", '0'], ['Active Bookings', confirmedBooking ? '1' : '0'], ['Pending Payments', confirmedBooking?.remainingAmount ? '1' : '0'], ['Total Customers', confirmedBooking ? '121' : '120'], ['Recent Reviews', String(reviews.length + 4)]].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div><AdminBooking booking={confirmedBooking} status={bookingStatus} onStatus={status => { setBookingStatus(status); onBookingChange(status === 'Cancelled' ? null : confirmedBooking) }} /></>}
        {section === 'Bookings' && <AdminBooking booking={confirmedBooking} status={bookingStatus} onStatus={status => { setBookingStatus(status); onBookingChange(status === 'Cancelled' ? null : confirmedBooking) }} />}
        {section === 'Customers' && <section className="admin-panel"><h2>Customer details</h2>{confirmedBooking ? <div className="admin-table-row"><span>Guest</span><strong>Current signed-in customer</strong><span>{booking?.adults || 0} adults · {booking?.children || 0} children</span><span>{booking?.accessibilityNeeds.join(', ') || 'No accessibility requests'}</span></div> : <p>No customer records in this prototype session.</p>}</section>}
        {section === 'Payments' && <section className="admin-panel"><h2>Payment status</h2>{confirmedBooking ? <div className="admin-table-row"><strong>{confirmedBooking.id}</strong><span>{confirmedBooking.paymentMethod.toUpperCase()}</span><span>{confirmedBooking.remainingAmount ? 'Partially Paid / Pending' : 'Paid'}</span><span>₹{confirmedBooking.amountPaid.toLocaleString()} received</span></div> : <p>No payments yet.</p>}</section>}
        {(section === 'Experiences' || section === 'Activities') && <section className="admin-panel"><h2>Activity library</h2><form className="admin-activity-form" onSubmit={event => { event.preventDefault(); if (activity.trim()) { const next = [...activities, { id: `custom-${Date.now()}`, name: activity.trim(), category, minutes: duration, icon: '◇', description: `A ${category.toLowerCase()} experience added by the property team.`, active: true }]; updateActivities(next, `${activity.trim()} is now available to guests.`); setActivity('') } }}><label><span>Activity name</span><input value={activity} onChange={event => setActivity(event.target.value)} /></label><label><span>Category</span><select value={category} onChange={event => setCategory(event.target.value as ActivityDefinition['category'])}>{['Farming', 'Nature', 'Farm-to-Table', 'Culture', 'Farm Store', 'Leisure and Recreation'].map(item => <option key={item}>{item}</option>)}</select></label><label><span>Duration</span><select value={duration} onChange={event => setDuration(Number(event.target.value))}>{[30, 45, 60, 90, 120].map(value => <option value={value} key={value}>{formatActivityDuration(value)}</option>)}</select></label><button className="button button--primary" type="submit">Add Activity</button></form>{adminNotice && <p className="admin-success" role="status">{adminNotice}</p>}{activityRows.map(item => <div className="admin-table-row" key={item.id}><strong>{item.name}</strong><span>{item.category}</span><label className="admin-duration"><span className="sr-only">Duration for {item.name}</span><select value={item.minutes} onChange={event => updateActivities(activities.map(activityItem => activityItem.id === item.id ? { ...activityItem, minutes: Number(event.target.value) } : activityItem), `${item.name} duration updated.`)}>{[30, 45, 60, 90, 120].map(value => <option value={value} key={value}>{formatActivityDuration(value)}</option>)}</select></label><span>{item.active ? 'Available' : 'Inactive'}</span><button onClick={() => updateActivities(activities.map(activityItem => activityItem.id === item.id ? { ...activityItem, active: !activityItem.active } : activityItem), `${item.name} is now ${item.active ? 'inactive' : 'available'}.`)}>{item.active ? 'Deactivate' : 'Restore'}</button></div>)}</section>}
        {section === 'Images' && <section className="admin-panel"><h2>Image management</h2><p>Choose an image to preview and save it for the customer-facing experience image slot.</p><label className="admin-upload"><span>Experience image</span><input type="file" accept="image/*" onChange={event => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setImagePreview(String(reader.result)); reader.readAsDataURL(file) }} /></label>{imagePreview && <img className="admin-image-preview" src={imagePreview} alt="New customer-facing experience preview" />}<button className="button button--primary" disabled={!imagePreview} onClick={() => { localStorage.setItem('gaongetaway-admin-image', imagePreview); setAdminNotice('Customer-facing experience image updated.') }}>Save Image</button>{adminNotice && <p className="admin-success" role="status">{adminNotice}</p>}</section>}
        {section === 'Reviews' && <section className="admin-panel"><h2>Review moderation</h2><p className="admin-note">Reviews may only be hidden for spam, offensive content, duplicates, or irrelevant content.</p>{reviews.length === 0 ? <p>No guest-submitted reviews yet.</p> : reviews.map(review => { const hidden = hiddenReviews.includes(review.id); return <div className="admin-review-row" key={review.id}><div><strong>{review.name}</strong><span>{'★'.repeat(review.rating)} · {review.date}</span><p>{review.text}</p></div><label><span>Moderation reason</span><select value={moderationReason[review.id] || 'Spam'} onChange={event => setModerationReason(reasons => ({ ...reasons, [review.id]: event.target.value }))}><option>Spam</option><option>Offensive content</option><option>Duplicate</option><option>Irrelevant content</option></select></label><button onClick={() => { const next = hidden ? hiddenReviews.filter(id => id !== review.id) : [...hiddenReviews, review.id]; setHiddenReviews(next); localStorage.setItem('gaongetaway-hidden-reviews', JSON.stringify(next)); setAdminNotice(hidden ? 'Review restored.' : `Review hidden: ${moderationReason[review.id] || 'Spam'}.`) }}>{hidden ? 'Restore Review' : 'Hide Review'}</button></div> })}{adminNotice && <p className="admin-success" role="status">{adminNotice}</p>}</section>}
      </main>
    </div>
  )
}

function AdminBooking({ booking, status, onStatus }: { booking: ConfirmedBooking | null; status: 'Confirmed' | 'Cancelled'; onStatus: (status: 'Confirmed' | 'Cancelled') => void }) {
  return <section className="admin-panel"><h2>Booking management</h2>{booking ? <div className="admin-table-row"><strong>{booking.id}</strong><span>{booking.booking.accommodation?.name}</span><span>{booking.booking.adults + booking.booking.children} guests</span><span className={`admin-status admin-status--${status.toLowerCase()}`}>{status}</span><button onClick={() => onStatus(status === 'Confirmed' ? 'Cancelled' : 'Confirmed')}>{status === 'Confirmed' ? 'Cancel booking' : 'Confirm booking'}</button></div> : <p>No confirmed bookings in this prototype session.</p>}</section>
}
