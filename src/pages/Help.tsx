import { useState } from 'react'
import type { Page } from '../types'

const questions = [
  ['How do I book a stay?', 'Choose Book a Stay, select an accommodation and available dates, add guests and access requirements, then create an itinerary. You only log in before payment.'],
  ['What payment options are available?', 'You can use UPI, pay at the property, pay a refundable booking deposit, or use a card. Card fields only appear when Card is selected.'],
  ['How does the deposit work?', 'The payment screen clearly shows the deposit, refundable portion, and remaining amount payable at the property.'],
  ['Can I edit my itinerary?', 'Yes. Remove, restore, replace, reorder, and add activities before saving. You can also create your own schedule instead of using AI.'],
  ['What accessibility arrangements are available?', 'Step-free grounds, accessible accommodation, grab-bar restrooms, audio assistance, and custom requirements can be requested. We confirm arrangements within 24 hours.'],
  ['How do I change the language?', 'Use the globe in the header and choose English, हिन्दी, or मराठी. Your choice remains active while you navigate.'],
  ['How do I change the website appearance?', 'Open the Aa shortcut in the header. You can change type size, spacing, font, icon size, theme, contrast, and motion without an account.'],
  ['How does the AI Stay Planner work?', 'It uses your booked dates, guests, travel group, interests, and accessibility preferences. It never asks for duration again after dates are chosen.'],
]

export default function Help({ navigate }: { navigate: (page: Page) => void }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="page-shell help-page">
      <header className="page-hero page-hero--compact"><p className="eyebrow">Support</p><h1>Help, without the guesswork.</h1><p>Clear answers for planning, booking, paying, and personalising your stay.</p></header>
      <div className="faq-list">
        {questions.map(([question, answer], index) => <section key={question}><button aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}><span>{question}</span><span aria-hidden="true">{open === index ? '−' : '+'}</span></button>{open === index && <p>{answer}</p>}</section>)}
      </div>
      <aside className="support-card"><div><p className="eyebrow">Still need help?</p><h2>Talk to a real person.</h2><p>Call +91 98765 43210 or write to hello@gaongetaway.in. Support is available daily, 8 AM–8 PM.</p></div><button className="button button--primary" onClick={() => navigate('contact')}>Contact support</button></aside>
    </div>
  )
}
