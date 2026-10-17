import { useEffect, useRef, useState } from 'react'
import type { AccessibilityConfig } from '../types'

interface Props {
  language: AccessibilityConfig['language']
  onClose: () => void
}

const languageCodes = { english: 'en-IN', hindi: 'hi-IN', marathi: 'mr-IN' } as const

export default function ReadAloudBar({ language, onClose }: Props) {
  const [status, setStatus] = useState<'ready' | 'playing' | 'paused'>('ready')
  const [rate, setRate] = useState(1)
  const utterance = useRef<SpeechSynthesisUtterance | null>(null)

  const stop = () => {
    window.speechSynthesis?.cancel()
    setStatus('ready')
  }

  const play = () => {
    if (status === 'paused') {
      window.speechSynthesis?.resume()
      setStatus('playing')
      return
    }
    window.speechSynthesis?.cancel()
    const content = document.querySelector('main')?.textContent?.replace(/\s+/g, ' ').trim()
    if (!content) return
    const speech = new SpeechSynthesisUtterance(content)
    speech.lang = languageCodes[language]
    speech.rate = rate
    speech.onend = () => setStatus('ready')
    utterance.current = speech
    window.speechSynthesis?.speak(speech)
    setStatus('playing')
  }

  const pause = () => {
    window.speechSynthesis?.pause()
    setStatus('paused')
  }

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  return (
    <aside className="read-aloud-bar" aria-label="Read aloud controls" role="region">
      <div><span className={status === 'playing' ? 'speech-pulse' : ''} aria-hidden="true">◖</span><p><strong>{status === 'playing' ? 'Reading this page' : status === 'paused' ? 'Reading paused' : 'Read aloud'}</strong><small>Page language: {language}</small></p></div>
      <div className="read-aloud-actions">
        <button onClick={play} aria-label={status === 'paused' ? 'Resume reading' : 'Play reading'}>{status === 'paused' ? 'Resume' : 'Play'}</button>
        <button onClick={pause} disabled={status !== 'playing'}>Pause</button>
        <button onClick={stop}>Stop</button>
        <select aria-label="Reading speed" value={rate} onChange={event => { stop(); setRate(Number(event.target.value)) }}>
          <option value=".75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option>
        </select>
        <button className="read-aloud-close" onClick={() => { stop(); onClose() }} aria-label="Close read aloud">×</button>
      </div>
    </aside>
  )
}
