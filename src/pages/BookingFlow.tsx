import { useState } from 'react'
import type { Page, BookingState, CartItem, AccessibilityConfig, ConfirmedBooking } from '../types'
import { useSpeechToText } from '../speech'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  pageData: Record<string, any>
  booking: BookingState
  setBooking: (b: BookingState) => void
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
  a11y: AccessibilityConfig
  confirmedBooking?: ConfirmedBooking | null
}

type FlowStep = 'calendar' | 'guests' | 'accessibility'

// ── Availability data ──────────────────────────────────────────────────────
// true = AVAILABLE (green), false = NOT AVAILABLE (red)
const AVAILABILITY: Record<string, boolean[]> = {
  // October 2026 — index 0 unused, index 1–31 = day of month
  '2026-10': [
    false, // placeholder index 0
    true,  // 1
    true,  // 2
    false, // 3  RED
    true,  // 4
    true,  // 5
    true,  // 6
    false, // 7  RED
    true,  // 8
    true,  // 9
    false, // 10 RED
    true,  // 11
    true,  // 12
    true,  // 13
    false, // 14 RED
    true,  // 15
    true,  // 16
    true,  // 17
    false, // 18 RED
    true,  // 19
    true,  // 20
    true,  // 21
    false, // 22 RED
    true,  // 23
    true,  // 24
    false, // 25 RED
    true,  // 26
    true,  // 27
    true,  // 28
    false, // 29 RED
    true,  // 30
    true,  // 31
  ],
}

function getDayAvailability(year: number, month: number, day: number): boolean {
  const key = `${year}-${String(month + 1).padStart(2, '0')}`
  const arr = AVAILABILITY[key]
  if (!arr) return true // Default to available for months without data
  return arr[day] !== undefined ? arr[day] : true
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1 // Monday = 0
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${month}-${day}`
}

function formatDisplayDate(year: number, month: number, day: number): string {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return `${day} ${months[month]} ${year}`
}

// Checks if ALL dates in the range [start, end] (inclusive) are available
function isRangeFullyAvailable(
  year: number, month: number,
  startDay: number, endDay: number
): { valid: boolean; blockedDay?: number } {
  for (let d = startDay; d <= endDay; d++) {
    if (!getDayAvailability(year, month, d)) {
      return { valid: false, blockedDay: d }
    }
  }
  return { valid: true }
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const accommodations = [
  { id: '1', name: 'Farmhouse Room', type: 'Farm Stay Room', price: 3500 },
  { id: '2', name: 'Heritage Farmhouse Room', type: 'Farm Stay Room', price: 4200 },
  { id: '3', name: 'Private Farm Cottage', type: 'Private Cottage', price: 5800 },
  { id: '4', name: 'Deluxe Valley Cottage', type: 'Private Cottage', price: 7500 },
]

export default function BookingFlow({ navigate, goBack, pageData, booking, setBooking, confirmedBooking, a11y }: Props) {
  const [step, setStep] = useState<FlowStep>('calendar')

  // Calendar state
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(9) // October = index 9
  const [checkIn, setCheckIn] = useState<number | null>(null)
  const [checkOut, setCheckOut] = useState<number | null>(null)
  const [hoverDay, setHoverDay] = useState<number | null>(null)
  const [unavailableFeedback, setUnavailableFeedback] = useState<string>('')
  const [rangeError, setRangeError] = useState<string>('')
  const [selectedAccId, setSelectedAccId] = useState<string>(
    booking.accommodation?.id || pageData?.accommodation?.id || '3'
  )

  // Guest state
  const [adults, setAdults] = useState(booking.adults || 2)
  const [children, setChildren] = useState(booking.children || 0)

  // Accessibility state
  const [a11yNeeds, setA11yNeeds] = useState<string[]>(booking.accessibilityNeeds || [])
  const [additionalNeeds, setAdditionalNeeds] = useState('')
  const needsSpeech = useSpeechToText(a11y.language, text => {
    setAdditionalNeeds(current => current ? `${current} ${text}` : text)
  })

  const selectedAcc = accommodations.find(a => a.id === selectedAccId)

  const isDayAvailable = (selectedYear: number, selectedMonth: number, day: number) => {
    if (!getDayAvailability(selectedYear, selectedMonth, day)) return false
    const current = new Date(selectedYear, selectedMonth, day, 12).getTime()
    if (confirmedBooking?.booking.accommodation?.id === selectedAccId) {
      const start = confirmedBooking.booking.checkIn ? new Date(confirmedBooking.booking.checkIn).getTime() : 0
      const end = confirmedBooking.booking.checkOut ? new Date(confirmedBooking.booking.checkOut).getTime() : 0
      if (current >= start && current < end) return false
    }
    try {
      const hold = JSON.parse(localStorage.getItem('gaongetaway-booking-hold') || 'null') as {
        accommodationId: string; checkIn: string; checkOut: string; expiresAt: number
      } | null
      if (!hold) return true
      if (hold.expiresAt <= Date.now()) {
        localStorage.removeItem('gaongetaway-booking-hold')
        return true
      }
      if (hold.accommodationId !== selectedAccId) return true
      return !(current >= new Date(hold.checkIn).getTime() && current < new Date(hold.checkOut).getTime())
    } catch {
      return true
    }
  }

  const isDayTemporarilyHeld = (selectedYear: number, selectedMonth: number, day: number) => {
    try {
      const hold = JSON.parse(localStorage.getItem('gaongetaway-booking-hold') || 'null') as {
        accommodationId: string; checkIn: string; checkOut: string; expiresAt: number
      } | null
      if (!hold || hold.expiresAt <= Date.now() || hold.accommodationId !== selectedAccId) return false
      const current = new Date(selectedYear, selectedMonth, day, 12).getTime()
      return current >= new Date(hold.checkIn).getTime() && current < new Date(hold.checkOut).getTime()
    } catch {
      return false
    }
  }

  // Derive nights
  const nights = checkIn !== null && checkOut !== null
    ? Math.abs(checkOut - checkIn)
    : 0

  // Low/high day from selection
  const selStart = checkIn !== null && checkOut !== null ? Math.min(checkIn, checkOut) : checkIn
  const selEnd   = checkIn !== null && checkOut !== null ? Math.max(checkIn, checkOut) : checkIn

  // ── Calendar helpers ──────────────────────────────────────────────────────

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    resetSelection()
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    resetSelection()
  }

  const resetSelection = () => {
    setCheckIn(null)
    setCheckOut(null)
    setUnavailableFeedback('')
    setRangeError('')
  }

  const handleDayClick = (day: number) => {
    const available = isDayAvailable(year, month, day)

    if (!available) {
      // Red date — show feedback, do not select
      setUnavailableFeedback(isDayTemporarilyHeld(year, month, day)
        ? `${formatDisplayDate(year, month, day)} is temporarily held while another booking is being completed. Please choose another date or try again later.`
        : `${formatDisplayDate(year, month, day)} is booked and unavailable. Please select another date.`)
      setRangeError('')
      return
    }

    setUnavailableFeedback('')
    setRangeError('')

    if (checkIn === null || (checkIn !== null && checkOut !== null)) {
      // Start new selection
      setCheckIn(day)
      setCheckOut(null)
    } else {
      // We have a start; set end
      if (day === checkIn) {
        // Clicking same day deselects
        setCheckIn(null)
        return
      }

      const start = Math.min(checkIn, day)
      const end   = Math.max(checkIn, day)

      // Validate range
      let blockedDay: number | undefined
      for (let rangeDay = start; rangeDay <= end; rangeDay++) {
        if (!isDayAvailable(year, month, rangeDay)) { blockedDay = rangeDay; break }
      }
      const valid = blockedDay === undefined
      if (!valid && blockedDay !== undefined) {
        setRangeError(
          `⚠️ These dates are not continuously available. ${formatDisplayDate(year, month, blockedDay)} is unavailable. Please choose another date range.`
        )
        setCheckOut(null)
        return
      }

      setCheckOut(day)
      setRangeError('')
    }
  }

  // Is a day in the hover preview range?
  const isHoverRange = (day: number): boolean => {
    if (checkIn === null || checkOut !== null || hoverDay === null) return false
    const lo = Math.min(checkIn, hoverDay)
    const hi = Math.max(checkIn, hoverDay)
    return day > lo && day < hi
  }

  const isInSelectedRange = (day: number): boolean => {
    if (selStart === null || selEnd === null) return false
    return day > selStart && day < selEnd
  }

  const isSelected = (day: number): boolean => {
    return day === selStart || day === selEnd
  }

  const hasValidSelection = checkIn !== null && checkOut !== null && rangeError === ''

  // ── Step: Calendar ─────────────────────────────────────────────────────────

  const CalendarScreen = () => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay    = getFirstDayOfMonth(year, month)
    const today       = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '60px' }}>
        {/* ── Top bar ── */}
        <div style={{ background: '#2B5219', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={goBack}
            aria-label="Go back"
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '8px 14px', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}
          >
            ← Back
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>
            Check Stay Availability
          </h1>
        </div>

        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 20px' }}>
          {/* ── Page title ── */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: '#2B5219', marginBottom: '6px' }}>
              Check Stay Availability
            </h2>
            <p style={{ color: '#6A5840', fontSize: '1rem' }}>
              Select your preferred stay dates from the calendar below.
            </p>
          </div>

          {/* ── Accommodation selector ── */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E8DCC8', padding: '20px 22px', marginBottom: '20px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7A4828', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Checking availability for
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {accommodations.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccId(acc.id)}
                  aria-pressed={selectedAccId === acc.id}
                  style={{
                    padding: '11px 14px',
                    border: `2px solid ${selectedAccId === acc.id ? '#2B5219' : '#D4C4A0'}`,
                    borderRadius: '10px',
                    background: selectedAccId === acc.id ? 'rgba(43,82,25,0.08)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: selectedAccId === acc.id ? '#2B5219' : '#2A2015', fontSize: '0.88rem', lineHeight: 1.2 }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#8A7860', marginTop: '3px' }}>
                    ₹{acc.price.toLocaleString()}/night
                  </div>
                  {selectedAccId === acc.id && (
                    <div style={{ fontSize: '0.72rem', color: '#2B5219', fontWeight: 700, marginTop: '4px' }}>✓ Selected</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── CALENDAR ── */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #E8DCC8',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(43,82,25,0.08)',
              marginBottom: '20px',
            }}
          >
            {/* Month navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px 16px',
                borderBottom: '1px solid #F0E8D8',
              }}
            >
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                style={{
                  background: '#F5EFE0',
                  border: '1.5px solid #D4C4A0',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  color: '#2B5219',
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E8DCC8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#F5EFE0')}
              >
                ← Prev
              </button>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#2B5219' }}>
                  {MONTHS[month]} {year}
                </div>
                {isCurrentMonth && (
                  <button
                    onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); resetSelection() }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#C8902A', fontFamily: 'var(--font-body)', fontWeight: 600, marginTop: '2px' }}
                  >
                    Today
                  </button>
                )}
              </div>

              <button
                onClick={nextMonth}
                aria-label="Next month"
                style={{
                  background: '#F5EFE0',
                  border: '1.5px solid #D4C4A0',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  color: '#2B5219',
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E8DCC8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#F5EFE0')}
              >
                Next →
              </button>
            </div>

            {/* Legend */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                padding: '12px 24px',
                background: '#FAFAF5',
                borderBottom: '1px solid #F0E8D8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    background: '#2B6A1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: 'white',
                    fontWeight: 800,
                  }}
                  aria-hidden="true"
                >
                  ✓
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#2A2015' }}>
                  Available for Stay
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    background: '#C0281A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: 'white',
                    fontWeight: 800,
                  }}
                  aria-hidden="true"
                >
                  ×
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#2A2015' }}>
                  Not Available
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#B8720A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'white', fontWeight: 800 }} aria-hidden="true">H</div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#2A2015' }}>Temporarily Held</span>
              </div>
            </div>

            {/* Day-of-week header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                padding: '12px 16px 0',
              }}
            >
              {DAY_LABELS.map(d => (
                <div
                  key={d}
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#9A8870',
                    letterSpacing: '0.05em',
                    paddingBottom: '8px',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div
              role="grid"
              aria-label={`${MONTHS[month]} ${year} availability calendar`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
                padding: '4px 16px 20px',
              }}
            >
              {/* Empty cells for offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} role="gridcell" aria-label="" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const isAvailable = isDayAvailable(year, month, day)
                const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                const isSel = isSelected(day)
                const inRange = isInSelectedRange(day)
                const inHover = isHoverRange(day)
                const isToday = isCurrentMonth && day === today.getDate()

                // Compute cell background
                let cellBg: string
                let cellColor: string
                let cellBorder: string
                let cursor: string

                if (isPast) {
                  cellBg = '#F5F2EE'
                  cellColor = '#C8B8A8'
                  cellBorder = 'transparent'
                  cursor = 'not-allowed'
                } else if (isSel) {
                  cellBg = '#1E4010'
                  cellColor = 'white'
                  cellBorder = '#1E4010'
                  cursor = 'pointer'
                } else if (inRange || inHover) {
                  cellBg = isAvailable ? '#D4EDBE' : '#F5D5D0'
                  cellColor = '#2B5219'
                  cellBorder = 'transparent'
                  cursor = 'pointer'
                } else if (!isAvailable) {
                  const held = isDayTemporarilyHeld(year, month, day)
                  cellBg = held ? '#FFF3D0' : '#FFF0EE'
                  cellColor = held ? '#8A5200' : '#C0281A'
                  cellBorder = held ? '#E8C070' : '#F0B8B0'
                  cursor = 'not-allowed'
                } else {
                  cellBg = '#EDF7E3'
                  cellColor = '#1A5210'
                  cellBorder = '#B8DFA0'
                  cursor = 'pointer'
                }

                const isHeld = isDayTemporarilyHeld(year, month, day)
                return (
                  <button
                    key={day}
                    role="gridcell"
                    aria-label={`${formatDisplayDate(year, month, day)}, ${isPast ? 'past date' : isAvailable ? 'available for stay' : isHeld ? 'temporarily held' : 'booked and unavailable'}`}
                    aria-selected={isSel}
                    aria-disabled={!isAvailable || isPast}
                    disabled={isPast}
                    onClick={() => !isPast && handleDayClick(day)}
                    onMouseEnter={() => { if (!isPast && checkIn !== null && checkOut === null) setHoverDay(day) }}
                    onMouseLeave={() => setHoverDay(null)}
                    style={{
                      position: 'relative',
                      padding: '0',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      borderRadius: '10px',
                      border: `2px solid ${isToday && !isSel ? '#C8902A' : cellBorder}`,
                      background: cellBg,
                      color: cellColor,
                      cursor,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      fontWeight: isSel ? 800 : isToday ? 700 : 500,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      transition: 'all 0.12s ease',
                      outline: 'none',
                    }}
                    onFocus={e => { if (isAvailable && !isPast) e.currentTarget.style.outline = '3px solid #C8902A' }}
                    onBlur={e => { e.currentTarget.style.outline = 'none' }}
                  >
                    <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{day}</span>
                    {/* Status indicator */}
                    {!isPast && (
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: '0.55rem',
                          fontWeight: 900,
                          lineHeight: 1,
                          opacity: isSel ? 0.9 : 0.75,
                        }}
                      >
                        {isAvailable ? '✓' : isHeld ? 'H' : '×'}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Feedback messages ── */}

          {/* Red date feedback */}
          {unavailableFeedback && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                padding: '14px 18px',
                background: '#FFF0EE',
                border: '2px solid #F0B8B0',
                borderRadius: '10px',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '1.2rem', flexShrink: 0, color: '#C0281A' }}>×</span>
              <div>
                <div style={{ fontWeight: 700, color: '#8B1A1A', fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginBottom: '2px' }}>
                  Stay unavailable
                </div>
                <div style={{ color: '#8B1A1A', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {unavailableFeedback}
                </div>
              </div>
            </div>
          )}

          {/* Range error */}
          {rangeError && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                padding: '14px 18px',
                background: '#FFF8E0',
                border: '2px solid #E8C070',
                borderRadius: '10px',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 700, color: '#7A4800', fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginBottom: '2px' }}>
                  Dates not continuously available
                </div>
                <div style={{ color: '#7A4800', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {rangeError.replace('⚠️ ', '')}
                </div>
              </div>
            </div>
          )}

          {/* ── Selection summary ── */}
          {checkIn !== null && (
            <div
              aria-live="polite"
              style={{
                background: 'white',
                borderRadius: '14px',
                border: `2px solid ${hasValidSelection ? '#A8D490' : '#E8DCC8'}`,
                padding: '20px 22px',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', marginBottom: '14px' }}>
                Your Selection
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: checkOut ? '14px' : '0' }}>
                <div style={{ padding: '12px 14px', background: '#F5EFE0', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#8A7860', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Check-in</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#2B5219', fontSize: '0.95rem' }}>
                    {formatDisplayDate(year, month, checkIn)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2B6A1A', fontWeight: 700, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#2B6A1A' }}>✓</span> Available
                  </div>
                </div>

                <div style={{ padding: '12px 14px', background: '#F5EFE0', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#8A7860', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Check-out</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: checkOut ? '#2B5219' : '#B0A090', fontSize: '0.95rem' }}>
                    {checkOut ? formatDisplayDate(year, month, checkOut) : '— select date'}
                  </div>
                  {checkOut && (
                    <div style={{ fontSize: '0.75rem', color: '#2B6A1A', fontWeight: 700, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>✓</span> Available
                    </div>
                  )}
                </div>
              </div>

              {hasValidSelection && selStart !== null && selEnd !== null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#E8F4E0',
                    borderRadius: '10px',
                    border: '1px solid #A8D490',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#2B6A1A', fontSize: '1.1rem', fontWeight: 900 }}>✓</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#2B5219', fontSize: '0.9rem' }}>
                        Stay available for these dates
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#3A5A2A' }}>
                        {formatDisplayDate(year, month, selStart)} – {formatDisplayDate(year, month, selEnd)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#2B5219', fontSize: '1rem' }}>
                      🌙 {nights} night{nights !== 1 ? 's' : ''}
                    </div>
                    {selectedAcc && (
                      <div style={{ fontSize: '0.8rem', color: '#3A5A2A', fontWeight: 600 }}>
                        ₹{(selectedAcc.price * nights).toLocaleString()} est.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hint when only check-in selected */}
              {checkIn !== null && checkOut === null && !rangeError && (
                <p style={{ fontSize: '0.83rem', color: '#8A7860', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#C8902A' }}>→</span>
                  Now select your check-out date on the calendar.
                </p>
              )}
            </div>
          )}

          {/* ── Availability info ── */}
          {hasValidSelection && (
            <div
              style={{
                background: '#E8F4E0',
                border: '1px solid #A8D490',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>🏡</span>
              <div>
                <div style={{ fontWeight: 700, color: '#2B5219', fontSize: '0.9rem' }}>
                  {selectedAcc?.name || 'Selected accommodation'}
                </div>
                <div style={{ fontSize: '0.83rem', color: '#3A5A2A', marginTop: '2px' }}>
                  3 accommodations available · All selected dates are open
                </div>
              </div>
            </div>
          )}

          {/* ── Continue button ── */}
          <button
            onClick={() => {
              if (!hasValidSelection) return
              const acc = selectedAcc ?? { id: '3', name: 'Private Farm Cottage', type: 'Private Cottage', price: 5800 }
              setBooking({
                ...booking,
                accommodation: acc,
                checkIn: new Date(year, month, selStart!).toISOString(),
                checkOut: new Date(year, month, selEnd!).toISOString(),
                nights,
              })
              setStep('guests')
            }}
            disabled={!hasValidSelection}
            aria-disabled={!hasValidSelection}
            style={{
              width: '100%',
              padding: '17px',
              background: hasValidSelection ? '#2B5219' : '#C8C0B0',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: hasValidSelection ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              fontWeight: 700,
              transition: 'background 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
            onMouseEnter={e => { if (hasValidSelection) e.currentTarget.style.background = '#3A6B26' }}
            onMouseLeave={e => { if (hasValidSelection) e.currentTarget.style.background = '#2B5219' }}
          >
            {hasValidSelection
              ? `Continue Booking → (${nights} night${nights !== 1 ? 's' : ''})`
              : 'Select available dates to continue'}
          </button>

          {!hasValidSelection && (
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#9A8870', marginTop: '10px' }}>
              Select a check-in date, then a check-out date on the calendar above.
            </p>
          )}
        </div>
      </div>
    )
  }

  // ── Step: Guests ───────────────────────────────────────────────────────────

  const GuestScreen = () => (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '60px' }}>
      <div style={{ background: '#2B5219', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => setStep('calendar')}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '8px 14px', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}
        >
          ← Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>Your Stay</h1>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '36px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: '#2B5219', marginBottom: '8px' }}>
          Your Stay
        </h2>
        <p style={{ color: '#6A5840', marginBottom: '28px' }}>Confirm your dates and tell us how many guests.</p>

        {/* Booking summary */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E8DCC8', padding: '20px 22px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#2A2015', marginBottom: '14px' }}>Booking Details</h3>
          {[
            { icon: '🏡', label: 'Accommodation', val: selectedAcc?.name || 'Private Farm Cottage' },
            {
              icon: '📅', label: 'Check-in',
              val: selStart ? formatDisplayDate(year, month, selStart) : '—',
            },
            {
              icon: '📅', label: 'Check-out',
              val: selEnd ? formatDisplayDate(year, month, selEnd) : '—',
            },
            { icon: '🌙', label: 'Duration', val: `${nights} night${nights !== 1 ? 's' : ''}` },
            { icon: '💰', label: 'Rate', val: selectedAcc ? `₹${selectedAcc.price.toLocaleString()}/night` : '—' },
          ].map(({ icon, label, val }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F5EFE0', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: '#6A5840', display: 'flex', gap: '8px' }}><span>{icon}</span>{label}</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2A2015' }}>{val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#2A2015', fontWeight: 700 }}>Estimated Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#2B5219' }}>
              {selectedAcc ? `₹${(selectedAcc.price * nights).toLocaleString()}` : '—'}
            </span>
          </div>
        </div>

        {/* Guest counter */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E8DCC8', padding: '24px 22px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2A2015', marginBottom: '20px' }}>
            Number of Guests
          </h3>

          {/* Adults */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #F5EFE0' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#2A2015', fontSize: '0.95rem' }}>Adults</div>
              <div style={{ fontSize: '0.82rem', color: '#8A7860' }}>Age 13 and above</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <button
                onClick={() => setAdults(a => Math.max(1, a - 1))}
                aria-label="Remove one adult"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #D4C4A0', background: 'white', cursor: adults > 1 ? 'pointer' : 'not-allowed', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B5219', opacity: adults > 1 ? 1 : 0.4, fontWeight: 700 }}
              >
                −
              </button>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: '#2B5219', minWidth: '28px', textAlign: 'center' }} aria-live="polite" aria-label={`${adults} adults`}>
                {adults}
              </span>
              <button
                onClick={() => setAdults(a => Math.min(10, a + 1))}
                aria-label="Add one adult"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#2B5219', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}
              >
                +
              </button>
            </div>
          </div>

          {/* Children */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#2A2015', fontSize: '0.95rem' }}>Children</div>
              <div style={{ fontSize: '0.82rem', color: '#8A7860' }}>Age 2–12</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <button
                onClick={() => setChildren(c => Math.max(0, c - 1))}
                aria-label="Remove one child"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #D4C4A0', background: 'white', cursor: children > 0 ? 'pointer' : 'not-allowed', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B5219', opacity: children > 0 ? 1 : 0.4, fontWeight: 700 }}
              >
                −
              </button>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: '#2B5219', minWidth: '28px', textAlign: 'center' }} aria-live="polite" aria-label={`${children} children`}>
                {children}
              </span>
              <button
                onClick={() => setChildren(c => Math.min(8, c + 1))}
                aria-label="Add one child"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#2B5219', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}
              >
                +
              </button>
            </div>
          </div>

          {/* Guest total */}
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#F5EFE0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#3C2815', fontSize: '0.9rem' }}>👥 Total guests</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#2B5219', fontSize: '1.1rem' }}>
              {adults + children}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setBooking({ ...booking, adults, children })
            setStep('accessibility')
          }}
          style={{ width: '100%', padding: '17px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 700 }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3A6B26')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2B5219')}
        >
          Continue →
        </button>
      </div>
    </div>
  )

  // ── Step: Accessibility requirements ──────────────────────────────────────

  const toggleA11y = (id: string) => setA11yNeeds(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id])

  const AccessibilityScreen = () => (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '60px' }}>
      <div style={{ background: '#2B5219', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => setStep('guests')}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '8px 14px', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}
        >
          ← Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>Accessibility Requirements</h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '36px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: '#2B5219', marginBottom: '8px' }}>
          Accessibility Requirements
        </h2>
        <p style={{ color: '#6A5840', marginBottom: '28px', lineHeight: 1.6 }}>
          Do you have any accessibility requirements? We'll make sure everything is arranged for your arrival.
        </p>

        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E8DCC8', padding: '24px 22px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} role="group" aria-label="Accessibility requirements">
            {[
              { id: 'wheelchair-grounds', label: 'Wheelchair-accessible grounds', icon: '♿' },
              { id: 'wheelchair', label: 'Wheelchair-accessible accommodation', icon: '🏠' },
              { id: 'accessible-restroom', label: 'Accessible restroom with grab bars', icon: '🚿' },
              { id: 'audio-assistance', label: 'Audio assistance', icon: '🔊' },
              { id: 'other', label: 'Other requirements', icon: '📝' },
            ].map(({ id, label, icon }) => (
              <label
                key={id}
                htmlFor={`a11y-req-${id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  border: `2px solid ${a11yNeeds.includes(id) ? '#2B5219' : '#D4C4A0'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: a11yNeeds.includes(id) ? 'rgba(43,82,25,0.06)' : 'white',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  id={`a11y-req-${id}`}
                  checked={a11yNeeds.includes(id)}
                  onChange={() => toggleA11y(id)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2B5219', flexShrink: 0 }}
                />
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#2A2015', fontWeight: a11yNeeds.includes(id) ? 600 : 400 }}>
                  {label}
                </span>
              </label>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <label htmlFor="additional-a11y-needs" style={{ display: 'block', fontWeight: 600, color: '#2A2015', marginBottom: '8px', fontSize: '0.9rem' }}>
              Additional accessibility needs
            </label>
            <div className="speech-textarea">
              <textarea
                id="additional-a11y-needs"
                value={additionalNeeds}
                onChange={e => setAdditionalNeeds(e.target.value)}
                placeholder="Tell us about any other accessibility requirements or special needs..."
                rows={3}
                className="rural-input"
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
              <button type="button" data-speech="microphone" title="Enter text using your voice" aria-label={needsSpeech.status === 'listening' ? 'Stop listening' : 'Enter accessibility requirements using your voice'} onClick={needsSpeech.status === 'listening' ? needsSpeech.stop : needsSpeech.start}>{needsSpeech.status === 'listening' ? 'Stop listening' : 'Microphone'}</button>
            </div>
            {needsSpeech.status === 'listening' && <p className="speech-status" role="status">Listening… Speak clearly, then pause.</p>}
            {needsSpeech.status === 'error' && <p className="speech-error" role="alert">{needsSpeech.errorReason === 'not-allowed' ? 'Microphone access denied by browser.' : "We couldn't hear that. Please try again."} <button type="button" onClick={needsSpeech.retry}>Retry</button></p>}
            {needsSpeech.status === 'unsupported' && <p className="speech-error" role="alert">Voice input is not supported in this browser. You can still type your request.</p>}
          </div>
        </div>

        <div style={{ background: '#F0F7E8', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', border: '1px solid #C8DEB0', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ flexShrink: 0 }}>🌾</span>
          <p style={{ fontSize: '0.85rem', color: '#3A3025', lineHeight: 1.6 }}>
            Our team will confirm your accessibility arrangements within 24 hours of booking. For urgent needs, call us at <strong>+91 98765 43210</strong>.
          </p>
        </div>

        <button
          onClick={() => {
            setBooking({ ...booking, accessibilityNeeds: additionalNeeds.trim() ? [...a11yNeeds, additionalNeeds.trim()] : a11yNeeds })
            navigate('ai-planner', {
              fromBooking: true,
              booking: {
                ...booking,
                adults,
                children,
                checkIn: selStart ? new Date(year, month, selStart).toISOString() : null,
                checkOut: selEnd ? new Date(year, month, selEnd).toISOString() : null,
                nights,
                accessibilityNeeds: a11yNeeds,
              },
            })
          }}
          style={{
            width: '100%',
            padding: '17px',
            background: '#C8902A',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 16px rgba(200,144,42,0.35)',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B07A20')}
          onMouseLeave={e => (e.currentTarget.style.background = '#C8902A')}
        >
          ✨ Continue to AI Smart Stay Planner
        </button>
        <p style={{ textAlign: 'center', color: '#9A8870', fontSize: '0.82rem', marginTop: '8px' }}>
          Our AI will create a personalised day-by-day itinerary for your group.
        </p>
      </div>
    </div>
  )

  // ── Render current step ────────────────────────────────────────────────────
  if (step === 'calendar') return <CalendarScreen />
  if (step === 'guests')   return <GuestScreen />
  return <AccessibilityScreen />
}
