import { useMemo, useState } from 'react'
import type { AccessibilityConfig, Page, UserProfile } from '../types'
import { useSpeechToText } from '../speech'

interface Props {
  navigate: (page: Page, data?: any) => void
  user: UserProfile | null
  language: AccessibilityConfig['language']
}

interface Review { id: string; name: string; trip: string; text: string; rating: number; date: string }

const guestReviews: Review[] = [
  { id: '1', name: 'Meera Kulkarni', trip: 'Family stay', text: 'A rare place where our children could be curious, muddy, and completely happy. The farm team made every activity feel personal.', rating: 5, date: '12 September 2026' },
  { id: '2', name: 'Rajesh Patil', trip: 'Accessible cottage', text: 'The accessible room and thoughtful staff meant I could enjoy the trip without having to plan around barriers.', rating: 5, date: '28 August 2026' },
  { id: '3', name: 'Anita & Suresh', trip: 'Weekend escape', text: 'The food tasted of the season, the mornings were quiet, and the hosts made us feel like old friends.', rating: 5, date: '16 August 2026' },
  { id: '4', name: 'Neha Shah', trip: 'Couples stay', text: 'A beautifully unhurried weekend. Bird watching at sunrise was the highlight of our trip.', rating: 4, date: '3 August 2026' },
]

export default function Reviews({ navigate, user, language }: Props) {
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [reviews, setReviews] = useState<Review[]>(() => {
    try { return JSON.parse(localStorage.getItem('gaongetaway-reviews') || '[]') } catch { return [] }
  })
  const reviewSpeech = useSpeechToText(language, text => setFeedback(current => current ? `${current} ${text}` : text))
  const hiddenReviews: string[] = (() => {
    try { return JSON.parse(localStorage.getItem('gaongetaway-hidden-reviews') || '[]') } catch { return [] }
  })()
  const visibleUserReviews = reviews.filter(review => !hiddenReviews.includes(review.id))
  const allReviews = [...visibleUserReviews, ...guestReviews].filter(review => !hiddenReviews.includes(review.id))
  const summary = useMemo(() => {
    const baseTotal = 120
    const baseRating = 4.6
    const count = baseTotal + visibleUserReviews.length
    const average = ((baseRating * baseTotal) + visibleUserReviews.reduce((total, review) => total + review.rating, 0)) / count
    return { count, average: average.toFixed(1) }
  }, [visibleUserReviews])

  const submitReview = () => {
    if (!user || !feedback.trim()) return
    const next: Review = {
      id: crypto.randomUUID(),
      name: user.name,
      trip: 'Verified guest',
      text: feedback.trim(),
      rating,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
    const updated = [next, ...reviews]
    setReviews(updated)
    localStorage.setItem('gaongetaway-reviews', JSON.stringify(updated))
    setSubmitted(true)
  }

  return (
    <div className="page-shell reviews-page">
      <header className="page-hero page-hero--compact">
        <p className="eyebrow">The guest book</p><h1>Stories from the farm.</h1>
        <p>Real notes from families, couples, friends, and solo travellers who came to slow down.</p>
      </header>
      <section className="rating-summary">
        <div><strong>{summary.average}</strong><span>★★★★★</span><p>Based on {summary.count} reviews</p></div>
        <div className="rating-bars">{[5, 4, 3, 2, 1].map((star, index) => <div key={star}><span>{star} star</span><i><b style={{ width: `${[92, 6, 2, 0, 0][index]}%` }} /></i><small>{[92, 6, 2, 0, 0][index]}%</small></div>)}</div>
      </section>
      <section className="all-reviews">
        {allReviews.map(review => <blockquote id={`review-${review.id}`} key={review.id}><div aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div><p>“{review.text}”</p><footer><strong>{review.name}</strong><span>{review.trip} · {review.date}</span></footer></blockquote>)}
      </section>
      <section className="write-review">
        <div><p className="eyebrow">Share your stay</p><h2>Write a review</h2><p>Your feedback helps future guests plan with confidence.</p></div>
        {user ? (
          submitted ? <div className="review-thanks" role="status"><strong>Review Added</strong><p>Your review has been added successfully.</p><button className="button button--secondary" onClick={() => document.getElementById(`review-${reviews[0]?.id}`)?.scrollIntoView({ behavior: 'smooth' })}>View My Review</button></div> :
          <form onSubmit={event => { event.preventDefault(); submitReview() }}>
            <label><span>Your rating</span><div className="star-picker">{[1, 2, 3, 4, 5].map(star => <button type="button" key={star} onClick={() => setRating(star)} aria-label={`${star} stars`}>{star <= rating ? '★' : '☆'}</button>)}</div></label>
            <label><span>Your feedback</span><div className="speech-textarea"><textarea value={feedback} onChange={event => setFeedback(event.target.value)} required placeholder="Tell us about your GaonGetaway..." /><button type="button" data-speech="microphone" title="Enter text using your voice" aria-label={reviewSpeech.status === 'listening' ? 'Stop listening' : 'Enter review using your voice'} onClick={reviewSpeech.status === 'listening' ? reviewSpeech.stop : reviewSpeech.start}>{reviewSpeech.status === 'listening' ? 'Stop listening' : 'Microphone'}</button></div></label>
            {reviewSpeech.status === 'listening' && <p className="speech-status" role="status">Listening… Speak clearly, then pause.</p>}
            {reviewSpeech.status === 'error' && <p className="speech-error" role="alert">{reviewSpeech.errorReason === 'not-allowed' ? 'Microphone access denied by browser.' : "We couldn't hear that. Please try again."} <button type="button" onClick={reviewSpeech.retry}>Retry</button></p>}
            {reviewSpeech.status === 'unsupported' && <p className="speech-error" role="alert">Voice input is not supported in this browser. You can still type your review.</p>}
            <button className="button button--primary" type="submit">Submit Review</button>
          </form>
        ) : <div className="review-thanks"><p>Log in to share a review from your stay.</p><button className="button button--primary" onClick={() => navigate('auth', { returnTo: 'reviews' })}>Log in to review</button></div>}
      </section>
    </div>
  )
}
