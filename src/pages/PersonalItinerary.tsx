import { useMemo, useState } from 'react'
import type { AccessibilityConfig, BookingState, GeneratedDay } from '../types'
import { useSpeechToText } from '../speech'
import { formatActivityDuration, getActivityLibrary } from '../activityLibrary'

interface Props {
  booking: BookingState
  setBooking: (booking: BookingState) => void
  onBack: () => void
  onSaved: (itinerary: GeneratedDay[], interests: string[]) => void
  onContinue: () => void
  language: AccessibilityConfig['language']
}

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

const displayTime = (minutes: number) => {
  const safe = ((minutes % 1440) + 1440) % 1440
  const hours = Math.floor(safe / 60)
  const mins = safe % 60
  return `${hours % 12 || 12}:${String(mins).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
}

export default function PersonalItinerary({ booking, setBooking, onBack, onSaved, onContinue, language }: Props) {
  const library = getActivityLibrary()
  const [wake, setWake] = useState('07:00')
  const [sleep, setSleep] = useState('22:30')
  const [breakfast, setBreakfast] = useState('08:00')
  const [lunch, setLunch] = useState('12:30')
  const [dinner, setDinner] = useState('19:30')
  const [rest, setRest] = useState('14:00')
  const [activityCount, setActivityCount] = useState(3)
  const [selected, setSelected] = useState<string[]>(['Organic Farming Workshop', 'Nature Walk', 'Bird Watching'])
  const [otherInterest, setOtherInterest] = useState('')
  const [itineraryNotes, setItineraryNotes] = useState('')
  const [customTimes, setCustomTimes] = useState<Record<string, string>>({})
  const [removed, setRemoved] = useState<{ name: string; index: number } | null>(null)
  const [checkIn, setCheckIn] = useState(booking.checkIn?.slice(0, 10) || '')
  const [checkOut, setCheckOut] = useState(booking.checkOut?.slice(0, 10) || '')
  const [saved, setSaved] = useState(false)
  const interestSpeech = useSpeechToText(language, text => setOtherInterest(current => current ? `${current} ${text}` : text))
  const notesSpeech = useSpeechToText(language, text => setItineraryNotes(current => current ? `${current} ${text}` : text))

  const selectedActivities = selected.map(name => library.find(item => item.name === name)).filter((item): item is NonNullable<typeof item> => !!item)
  const availableMinutes = Math.max(0, toMinutes(sleep) - toMinutes(wake) - 240)
  const activityMinutes = selectedActivities.reduce((total, item) => total + item.minutes, 0)
  const timeOrderValid = toMinutes(wake) < toMinutes(breakfast) && toMinutes(breakfast) < toMinutes(lunch) && toMinutes(lunch) < toMinutes(dinner) && toMinutes(dinner) < toMinutes(sleep)
  const timeline = useMemo(() => {
    const mealEnd = (start: string, duration: number) => toMinutes(start) + duration
    const slots = [
      { start: mealEnd(breakfast, 60), end: toMinutes(lunch) },
      { start: mealEnd(lunch, 60), end: toMinutes(rest) },
      { start: mealEnd(rest, 60), end: toMinutes(dinner) },
    ].filter(slot => slot.end > slot.start)
    let slotIndex = 0
    let cursor = slots[0]?.start || toMinutes(breakfast) + 60
    const scheduled: Array<(typeof selectedActivities)[number] & { time: string }> = []

    selectedActivities.forEach(activity => {
      while (slotIndex < slots.length && cursor + activity.minutes > slots[slotIndex].end) {
        slotIndex += 1
        cursor = slots[slotIndex]?.start || cursor
      }
      if (slotIndex >= slots.length) return
      scheduled.push({ ...activity, time: customTimes[activity.name] ? displayTime(toMinutes(customTimes[activity.name])) : displayTime(cursor) })
      cursor += activity.minutes + 15
    })
    return scheduled
  }, [selectedActivities, breakfast, lunch, dinner, rest, customTimes])

  const manualTimeConflict = timeline.find(item => {
    const manual = customTimes[item.name]
    if (!manual) return false
    const start = toMinutes(manual)
    const end = start + item.minutes
    const blocked = [
      [toMinutes(breakfast), toMinutes(breakfast) + 60],
      [toMinutes(lunch), toMinutes(lunch) + 60],
      [toMinutes(rest), toMinutes(rest) + 60],
      [toMinutes(dinner), toMinutes(dinner) + 90],
    ]
    return start < toMinutes(wake) || end > toMinutes(sleep) || blocked.some(([blockedStart, blockedEnd]) => start < blockedEnd && end > blockedStart)
  })

  const error = !timeOrderValid
    ? 'Meal and sleep times must follow the order of your day.'
    : !booking.checkIn && (!checkIn || !checkOut)
      ? 'Please select your check-in and check-out dates.'
      : !booking.checkIn && new Date(checkOut).getTime() <= new Date(checkIn).getTime()
        ? 'Check-out must be after check-in. Choose another date.'
    : selected.length > activityCount
      ? `Choose no more than ${activityCount} activities for this day.`
      : activityMinutes > availableMinutes
        ? 'These activities do not fit in the selected time. Remove an activity or extend your day.'
        : timeline.length < selectedActivities.length
          ? 'One or more activities do not fit between your meals and rest time. Choose a shorter activity or change your schedule.'
          : manualTimeConflict
            ? `${manualTimeConflict.name} does not fit at the selected time. Choose another time, choose a shorter activity, or remove it.`
        : ''

  const toggle = (name: string) => setSelected(items => items.includes(name) ? items.filter(item => item !== name) : [...items, name])
  const removeActivity = (name: string) => {
    const index = selected.indexOf(name)
    setSelected(items => items.filter(item => item !== name))
    setRemoved({ name, index })
  }
  const undoRemove = () => {
    if (!removed) return
    setSelected(items => {
      const next = [...items]
      next.splice(removed.index, 0, removed.name)
      return next
    })
    setRemoved(null)
  }
  const moveActivity = (name: string, direction: -1 | 1) => {
    setSelected(items => {
      const index = items.indexOf(name)
      const destination = index + direction
      if (index < 0 || destination < 0 || destination >= items.length) return items
      const next = [...items]
      ;[next[index], next[destination]] = [next[destination], next[index]]
      return next
    })
  }

  const save = () => {
    if (error || selected.length === 0) return
    const activities: GeneratedDay['activities'] = [
      { time: displayTime(toMinutes(wake)), name: 'Wake Up', duration: 'Start of day', description: 'Begin the day at your preferred pace.', icon: '☀', accessibility: [] },
      { time: displayTime(toMinutes(breakfast)), name: 'Breakfast', duration: '1 hour', description: 'A fresh farm breakfast.', icon: '◒', accessibility: ['Accessible dining'] },
      ...timeline.map(item => ({ time: item.time, name: item.name, duration: formatActivityDuration(item.minutes), description: itineraryNotes.trim() || item.description, icon: item.icon, accessibility: [] })),
      { time: displayTime(toMinutes(lunch)), name: 'Lunch', duration: '1 hour', description: 'Farm-to-table lunch.', icon: '◒', accessibility: ['Accessible dining'] },
      { time: displayTime(toMinutes(rest)), name: 'Rest / Nap', duration: '1 hour', description: 'Unhurried time to recharge.', icon: '—', accessibility: [] },
      { time: displayTime(toMinutes(dinner)), name: 'Dinner', duration: '1.5 hours', description: 'Traditional farm dinner.', icon: '◒', accessibility: ['Accessible dining'] },
      { time: displayTime(toMinutes(sleep)), name: 'Retire for the Night', duration: 'End of day', description: 'Return to your accommodation.', icon: '☾', accessibility: [] },
    ].sort((a, b) => {
      const parseDisplay = (time: string) => {
        const [clock, period] = time.split(' ')
        let [hour, minute] = clock.split(':').map(Number)
        if (period === 'PM' && hour !== 12) hour += 12
        if (period === 'AM' && hour === 12) hour = 0
        return hour * 60 + minute
      }
      return parseDisplay(a.time) - parseDisplay(b.time)
    })
    const nights = checkIn && checkOut ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : booking.nights || 1
    const itinerary: GeneratedDay[] = Array.from({ length: nights }, (_, index) => ({
      day: index + 1,
      title: `My Farm Day ${index + 1}`,
      theme: 'Planned by you',
      activities: activities.map(activity => ({ ...activity })),
    }))
    setBooking({ ...booking, checkIn: checkIn ? new Date(`${checkIn}T12:00:00`).toISOString() : booking.checkIn, checkOut: checkOut ? new Date(`${checkOut}T12:00:00`).toISOString() : booking.checkOut, nights, itinerary, plannerPrefs: { people: booking.adults + booking.children, days: nights, travelType: 'personal', interests: selected, accessibility: booking.accessibilityNeeds } })
    onSaved(itinerary, selected)
    setSaved(true)
  }

  return (
    <div className="personal-planner">
      <div className="personal-planner__inner">
        <button className="back-link" onClick={onBack}>← Back to planner</button>
        <header><p className="eyebrow">You set the pace</p><h1>Create My Own Itinerary</h1><p>Choose your daily rhythm, meals, rest, and activities. We’ll prevent schedules that cannot fit.</p></header>

        <section className="routine-card"><h2>1. Your daily rhythm</h2>{booking.checkIn && booking.checkOut ? <p className="capacity-note">Stay dates: {new Date(booking.checkIn).toLocaleDateString('en-IN')} – {new Date(booking.checkOut).toLocaleDateString('en-IN')}. Your booking dates are already applied.</p> : <div className="time-grid"><label><span>Check-in date</span><input type="date" value={checkIn} onChange={event => setCheckIn(event.target.value)} /></label><label><span>Check-out date</span><input type="date" min={checkIn} value={checkOut} onChange={event => setCheckOut(event.target.value)} /></label></div>}<div className="time-grid">
          <TimeField label="Wake up" value={wake} onChange={setWake} />
          <TimeField label="Breakfast" value={breakfast} onChange={setBreakfast} />
          <TimeField label="Lunch" value={lunch} onChange={setLunch} />
          <TimeField label="Rest / nap" value={rest} onChange={setRest} />
          <TimeField label="Dinner" value={dinner} onChange={setDinner} />
          <TimeField label="Retire for the night" value={sleep} onChange={setSleep} />
        </div></section>

        <section className="routine-card"><h2>2. How many activities?</h2><div className="segmented-control">{[1, 2, 3, 4, 5].map(count => <button className={activityCount === count ? 'active' : ''} onClick={() => setActivityCount(count)} key={count}>{count === 5 ? '5+' : count}</button>)}</div><p className="capacity-note">{Math.floor(availableMinutes / 60)}h {availableMinutes % 60}m available around meals and rest · {Math.floor(activityMinutes / 60)}h {activityMinutes % 60}m selected</p></section>

        <section className="routine-card"><h2>3. Activity library</h2><div className="activity-library">{library.map(item => <button key={item.name} className={selected.includes(item.name) ? 'selected' : ''} aria-pressed={selected.includes(item.name)} onClick={() => toggle(item.name)}><span aria-hidden="true">{item.icon}</span><strong>{item.name}</strong><small>~{item.minutes < 60 ? `${item.minutes} minutes` : `${item.minutes / 60} hour${item.minutes > 60 ? 's' : ''}`}</small><i>{selected.includes(item.name) ? '✓ Added' : '+ Add'}</i></button>)}</div>
          <label className="voice-field"><span>Other interests</span><div><input value={otherInterest} onChange={event => setOtherInterest(event.target.value)} placeholder="Type another interest..." /><button type="button" data-speech="microphone" aria-label={interestSpeech.status === 'listening' ? 'Stop listening' : 'Enter other interests using your voice'} onClick={interestSpeech.status === 'listening' ? interestSpeech.stop : interestSpeech.start}>{interestSpeech.status === 'listening' ? 'Stop listening' : 'Microphone'}</button></div></label>
          {interestSpeech.status === 'listening' && <p className="speech-status" role="status">Listening… Speak clearly, then pause.</p>}
          {interestSpeech.status === 'error' && <p className="speech-error" role="alert">{interestSpeech.errorReason === 'not-allowed' ? 'Microphone access denied by browser.' : "We couldn't hear that. Please try again."} <button type="button" onClick={interestSpeech.retry}>Retry</button></p>}
          {interestSpeech.status === 'unsupported' && <p className="speech-error" role="alert">Voice input is not supported in this browser. You can still type your interest.</p>}
        </section>

        <section className="routine-card"><h2>4. Schedule preview</h2>{error && <div className="schedule-error" role="alert">{error}<span>Edit your times or remove an activity to continue.</span></div>}<div className="personal-timeline">
          <TimelineRow time={displayTime(toMinutes(wake))} name="Wake Up" duration="" />
          <TimelineRow time={displayTime(toMinutes(breakfast))} name="Breakfast" duration="1 hour" />
          {timeline.map((item, index) => <EditableTimelineRow key={item.name} time={customTimes[item.name] || ''} displayTime={item.time} name={item.name} duration={formatActivityDuration(item.minutes)} onTime={value => setCustomTimes(times => ({ ...times, [item.name]: value }))} onRemove={() => removeActivity(item.name)} onMoveUp={() => moveActivity(item.name, -1)} onMoveDown={() => moveActivity(item.name, 1)} disableUp={index === 0} disableDown={index === timeline.length - 1} />)}
          <TimelineRow time={displayTime(toMinutes(lunch))} name="Lunch" duration="1 hour" />
          <TimelineRow time={displayTime(toMinutes(rest))} name="Rest / Nap" duration="1 hour" />
          <TimelineRow time={displayTime(toMinutes(dinner))} name="Dinner" duration="1.5 hours" />
          <TimelineRow time={displayTime(toMinutes(sleep))} name="Retire for the Night" duration="" />
        </div>{removed && <div className="itinerary-undo" role="status"><span>{removed.name} removed from your itinerary.</span><button onClick={undoRemove}>Undo</button></div>}<label className="itinerary-notes"><span>Itinerary notes</span><div className="speech-textarea"><textarea value={itineraryNotes} onChange={event => setItineraryNotes(event.target.value)} placeholder="Add preferences, reminders, or requests…" /><button type="button" data-speech="microphone" onClick={notesSpeech.status === 'listening' ? notesSpeech.stop : notesSpeech.start}>{notesSpeech.status === 'listening' ? 'Stop listening' : 'Microphone'}</button></div></label>{notesSpeech.status === 'error' && <p className="speech-error" role="alert">{notesSpeech.errorReason === 'not-allowed' ? 'Microphone access denied by browser.' : "We couldn't hear that. Please try again."} <button type="button" onClick={notesSpeech.retry}>Retry</button></p>}</section>

        <button className="button button--primary save-personal-plan" disabled={!!error || selected.length === 0} onClick={save}>Save My Itinerary</button>
      </div>
      {saved && <div className="saved-dialog-backdrop"><div className="saved-dialog" role="dialog" aria-modal="true" aria-labelledby="saved-title"><div className="confirmation-mark">✓</div><p className="eyebrow">Itinerary saved</p><h2 id="saved-title">Your day is ready.</h2><p>Your personal itinerary has been added to this booking and will appear in My Bookings after confirmation.</p><div><button className="button button--secondary" onClick={() => setSaved(false)}>View itinerary</button><button className="button button--primary" onClick={onContinue}>Continue</button></div></div></div>}
    </div>
  )
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span>{label}</span><input type="time" value={value} onChange={event => onChange(event.target.value)} /></label>
}

function TimelineRow({ time, name, duration, onRemove }: { time: string; name: string; duration: string; onRemove?: () => void }) {
  return <div><time>{time}</time><p><strong>{name}</strong>{duration && <span>{duration}</span>}</p>{onRemove && <button onClick={onRemove}>Remove</button>}</div>
}

function EditableTimelineRow({ time, displayTime: shownTime, name, duration, onTime, onRemove, onMoveUp, onMoveDown, disableUp, disableDown }: {
  time: string
  displayTime: string
  name: string
  duration: string
  onTime: (time: string) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  disableUp: boolean
  disableDown: boolean
}) {
  return <div className="editable-personal-row"><label><span className="sr-only">Start time for {name}</span><input type="time" value={time} onChange={event => onTime(event.target.value)} /><small>{shownTime}</small></label><p><strong>{name}</strong><span>{duration}</span></p><div><button onClick={onMoveUp} disabled={disableUp} aria-label={`Move ${name} earlier`}>↑</button><button onClick={onMoveDown} disabled={disableDown} aria-label={`Move ${name} later`}>↓</button><button onClick={onRemove}>Remove</button></div></div>
}
