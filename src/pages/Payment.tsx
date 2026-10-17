import { useEffect, useState } from 'react'
import type { AccessibilityConfig, BookingState, ConfirmedBooking, Page, PaymentMethod, UserProfile } from '../types'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  booking: BookingState
  user: UserProfile
  a11y: AccessibilityConfig
  onConfirm: (booking: ConfirmedBooking) => void
}

const methodLabels: Record<PaymentMethod, string> = {
  upi: 'UPI',
  property: 'Pay at Property',
  deposit: 'Booking Deposit',
  card: 'Card',
}

function formatDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
}

export default function Payment({ navigate, goBack, booking, user, a11y, onConfirm }: Props) {
  const payText = a11y.language === 'hindi'
    ? { title: 'भुगतान का तरीका चुनें', summary: 'बुकिंग सारांश', upi: 'यूपीआई से भुगतान', property: 'संपत्ति पर भुगतान', deposit: 'जमा राशि का भुगतान', card: 'कार्ड से भुगतान' }
    : a11y.language === 'marathi'
      ? { title: 'पेमेंट पद्धत निवडा', summary: 'बुकिंग सारांश', upi: 'यूपीआयने पैसे भरा', property: 'मालमत्तेवर पैसे भरा', deposit: 'ठेव भरा', card: 'कार्डने पैसे भरा' }
      : { title: 'Choose Payment Method', summary: 'Booking Summary', upi: 'Pay via UPI', property: 'Confirm Pay at Property', deposit: 'Pay Deposit', card: 'Pay by Card' }
  const [method, setMethod] = useState<PaymentMethod>('upi')
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [upi, setUpi] = useState('')
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })

  const total = booking.totalPrice || (booking.accommodation?.price || 5800) * Math.max(booking.nights, 1) + 2000
  const deposit = Math.min(2000, total)
  const refundable = Math.min(1500, deposit)
  const amountPaid = method === 'property' ? 0 : method === 'deposit' ? deposit : total
  const remaining = total - amountPaid
  const activities = booking.itinerary?.flatMap(day => day.activities.map(activity => activity.name)) || []

  useEffect(() => {
    if (!booking.accommodation || !booking.checkIn || !booking.checkOut) return
    const hold = {
      accommodationId: booking.accommodation.id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }
    localStorage.setItem('gaongetaway-booking-hold', JSON.stringify(hold))
    return () => {
      const current = localStorage.getItem('gaongetaway-booking-hold')
      if (current === JSON.stringify(hold)) localStorage.removeItem('gaongetaway-booking-hold')
    }
  }, [booking.accommodation, booking.checkIn, booking.checkOut])

  const validate = () => {
    const next: Record<string, string> = {}
    if (method === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(upi)) next.upi = 'Enter a valid UPI ID, for example name@upi.'
    if (method === 'card') {
      if (!card.name.trim()) next.name = 'Enter the cardholder name.'
      if (card.number.replace(/\s/g, '').length !== 16) next.number = 'Enter a valid 16-digit card number.'
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) next.expiry = 'Use MM/YY format.'
      if (!/^\d{3,4}$/.test(card.cvv)) next.cvv = 'Enter a valid CVV.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const completeBooking = () => {
    if (!validate()) return
    setProcessing(true)
    window.setTimeout(() => {
      const result: ConfirmedBooking = {
        id: `GG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        booking: { ...booking, totalPrice: total },
        paymentMethod: method,
        amountPaid,
        remainingAmount: remaining,
        refundableAmount: method === 'deposit' ? refundable : 0,
        confirmedAt: new Date().toISOString(),
      }
      onConfirm(result)
      localStorage.removeItem('gaongetaway-booking-hold')
      setConfirmed(result)
      setProcessing(false)
    }, 900)
  }

  if (confirmed) {
    return (
      <div className="payment-page confirmation-page">
        <section className="confirmation-card">
          <div className="confirmation-mark" aria-hidden="true">✓</div>
          <p className="eyebrow">Payment Successful</p>
          <h1>Booking Successful!</h1>
          <p>Your GaonGetaway stay has been confirmed.</p>
          <p>A confirmation has been prepared for {user.email}.</p>
          <div className="confirmation-details">
            <Detail label="Booking ID" value={confirmed.id} />
            <Detail label="Accommodation" value={booking.accommodation?.name || 'Private Farm Cottage'} />
            <Detail label="Check-in" value={formatDate(booking.checkIn)} />
            <Detail label="Check-out" value={formatDate(booking.checkOut)} />
            <Detail label="Guests" value={`${booking.adults} adults, ${booking.children} children`} />
            <Detail label="Activities" value={activities.join(', ') || 'Farm stay plan'} />
            <Detail label="Accessibility" value={booking.accessibilityNeeds.join(', ') || 'None specified'} />
            <Detail label="Payment method" value={methodLabels[method]} />
            <Detail label="Amount paid" value={`₹${amountPaid.toLocaleString()}`} />
            {remaining > 0 && <Detail label="Remaining amount" value={`₹${remaining.toLocaleString()}`} />}
          </div>
          <div className="confirmation-actions">
            <button className="button button--primary" onClick={() => navigate('my-bookings')}>View My Booking</button>
            <button className="button button--secondary" onClick={() => navigate('home')}>Back to Home</button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <button className="back-link" onClick={goBack}>← Back to booking summary</button>
      <header className="payment-heading"><p className="eyebrow">Secure checkout</p><h1>{payText.title}</h1><p>Select the option that works best for your stay.</p></header>
      <div className="booking-hold-notice" role="status"><strong>Temporarily Held</strong><span>Your selected dates are temporarily reserved while you complete your booking. This hold expires after 24 hours.</span></div>
      <div className="payment-layout">
        <section className="payment-methods">
          <div className="payment-tabs">
            {(Object.keys(methodLabels) as PaymentMethod[]).map(option => (
              <button className={method === option ? 'active' : ''} onClick={() => { setMethod(option); setErrors({}) }} key={option}>
                <span>{option === 'upi' ? '₹' : option === 'property' ? '🏡' : option === 'deposit' ? '◒' : '▣'}</span>{methodLabels[option]}
              </button>
            ))}
          </div>

          {method === 'upi' && <div className="method-panel"><h2>Pay with UPI</h2><p>Use any UPI app linked to your bank account.</p><Field label="UPI ID" value={upi} onChange={setUpi} placeholder="name@upi" error={errors.upi} /></div>}
          {method === 'property' && <div className="method-panel"><h2>Pay when you arrive</h2><p>No payment is required today. The full amount will be paid at the property during check-in.</p><MoneyRows total={total} paid={0} remaining={total} /></div>}
          {method === 'deposit' && <div className="method-panel"><h2>Secure your stay with a deposit</h2><p>The refundable portion will be returned according to the property’s cancellation and damage policy.</p><MoneyRows total={total} paid={deposit} refundable={refundable} remaining={remaining} /></div>}
          {method === 'card' && (
            <div className="method-panel"><h2>Pay by card</h2><p>Card details are only requested because card payment is selected.</p>
              <Field label="Cardholder Name" value={card.name} onChange={value => setCard({ ...card, name: value })} error={errors.name} />
              <Field label="Card Number" value={card.number} onChange={value => setCard({ ...card, number: value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() })} placeholder="1234 5678 9012 3456" error={errors.number} />
              <div className="field-row"><Field label="Expiry Date" value={card.expiry} onChange={value => setCard({ ...card, expiry: value.replace(/[^\d/]/g, '').slice(0, 5) })} placeholder="MM/YY" error={errors.expiry} /><Field label="CVV" value={card.cvv} onChange={value => setCard({ ...card, cvv: value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" error={errors.cvv} /></div>
            </div>
          )}

          <button className="button button--primary payment-submit" disabled={processing} onClick={completeBooking}>
            {processing ? 'Processing…' : method === 'upi' ? payText.upi : method === 'deposit' ? payText.deposit : method === 'property' ? payText.property : payText.card}
          </button>
          <p className="prototype-note">Prototype only. No real payment is processed.</p>
        </section>

        <aside className="payment-summary">
          <h2>{payText.summary}</h2>
          <Detail label="Accommodation" value={booking.accommodation?.name || 'Private Farm Cottage'} />
          <Detail label="Check-in" value={formatDate(booking.checkIn)} />
          <Detail label="Check-out" value={formatDate(booking.checkOut)} />
          <Detail label="Number of nights" value={`${booking.nights} night${booking.nights === 1 ? '' : 's'}`} />
          <Detail label="Guests" value={`${booking.adults + booking.children}`} />
          <Detail label="Accessibility" value={booking.accessibilityNeeds.join(', ') || 'None specified'} />
          <Detail label="Selected activities" value={activities.join(', ') || 'Farm stay plan'} />
          <Detail label="Payment method" value={methodLabels[method]} />
          <div className="summary-total"><span>Total price</span><strong>₹{total.toLocaleString()}</strong></div>
          {method === 'deposit' && <><Detail label="Deposit paid" value={`₹${deposit.toLocaleString()}`} /><Detail label="Refundable amount" value={`₹${refundable.toLocaleString()}`} /><Detail label="Remaining balance" value={`₹${remaining.toLocaleString()}`} /></>}
          {method === 'property' && <><Detail label="Amount due now" value="₹0" /><Detail label="Payable at property" value={`₹${total.toLocaleString()}`} /></>}
        </aside>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, error }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; error?: string }) {
  return <label className="payment-field"><span>{label}</span><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} aria-invalid={!!error} />{error && <small role="alert">{error}</small>}</label>
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="summary-row"><span>{label}</span><strong>{value}</strong></div>
}

function MoneyRows({ total, paid, refundable = 0, remaining }: { total: number; paid: number; refundable?: number; remaining: number }) {
  return <div className="money-box"><Detail label="Total booking amount" value={`₹${total.toLocaleString()}`} /><Detail label={paid ? 'Deposit required' : 'Amount due now'} value={`₹${paid.toLocaleString()}`} />{refundable > 0 && <Detail label="Refundable deposit" value={`₹${refundable.toLocaleString()}`} />}<Detail label="Balance payable at property" value={`₹${remaining.toLocaleString()}`} /></div>
}
