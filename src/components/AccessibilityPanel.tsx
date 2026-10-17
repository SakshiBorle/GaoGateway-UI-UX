import { useState } from 'react'
import type { AccessibilityConfig } from '../types'

interface Props {
  a11y: AccessibilityConfig
  onUpdate: (a: AccessibilityConfig) => void
  onClose: () => void
}

export default function AccessibilityPanel({ a11y, onUpdate, onClose }: Props) {
  const [local, setLocal] = useState<AccessibilityConfig>({ ...a11y })
  const [saved, setSaved] = useState(false)

  const update = (key: keyof AccessibilityConfig, val: any) => {
    setLocal(prev => ({ ...prev, [key]: val }))
  }

  const handleSave = () => {
    onUpdate(local)
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 1200)
  }

  const Toggle = ({ label, checked, onChange, id }: { label: string; checked: boolean; onChange: (v: boolean) => void; id: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F0E8D8' }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#2A2015', cursor: 'pointer', fontWeight: 500 }}>
        {label}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: '48px',
          height: '26px',
          borderRadius: '13px',
          background: checked ? '#2B5219' : '#D4C4A0',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '25px' : '3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'white',
            transition: 'left 0.2s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Accessibility Settings"
      className="animate-slide-in-right"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '360px',
        maxWidth: '100vw',
        background: 'white',
        zIndex: 50,
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid #E8DCC8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#2B5219', color: 'white' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'white' }}>
          ♿ Accessibility Settings
        </h2>
        <button
          onClick={onClose}
          aria-label="Close accessibility settings"
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'white', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '24px', flex: 1 }}>
        {/* Text Size */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: '#3C2815', marginBottom: '12px' }}>
            Text Size
          </h3>
          <div style={{ display: 'flex', gap: '8px' }} role="group" aria-label="Choose text size">
<select
              value={local.textSize}
              onChange={e => update('textSize', e.target.value as any)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #D4C4A0',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#6A5840',
              }}
            >
              {(['16px', '18px', '20px', '22px', '24px', '26px']).map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
        </div>

        {/* Toggles */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: '#3C2815', marginBottom: '4px' }}>
            Display Options
          </h3>
          <Toggle label="High Contrast" checked={local.highContrast} onChange={v => update('highContrast', v)} id="toggle-contrast" />
          <Toggle label="Reduce Animation" checked={local.reduceAnimation} onChange={v => update('reduceAnimation', v)} id="toggle-anim" />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: '#3C2815', marginBottom: '4px' }}>
            Assistive Features
          </h3>
          <Toggle label="Voice Navigation" checked={local.voiceNavigation} onChange={v => update('voiceNavigation', v)} id="toggle-voice" />
          <Toggle label="Screen Reader Support" checked={local.screenReader} onChange={v => update('screenReader', v)} id="toggle-sr" />
          <Toggle label="Captions" checked={local.captions} onChange={v => update('captions', v)} id="toggle-captions" />
        </div>

        {/* Language */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: '#3C2815', marginBottom: '12px' }}>
            Language / भाषा
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} role="radiogroup" aria-label="Choose language">
            {[
              { val: 'english', label: '🇮🇳 English' },
              { val: 'marathi', label: '🇮🇳 मराठी (Marathi)' },
              { val: 'hindi', label: '🇮🇳 हिन्दी (Hindi)' },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => update('language', val)}
                role="radio"
                aria-checked={local.language === val}
                style={{
                  padding: '12px 16px',
                  border: `2px solid ${local.language === val ? '#2B5219' : '#D4C4A0'}`,
                  borderRadius: '8px',
                  background: local.language === val ? 'rgba(43,82,25,0.08)' : 'white',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  fontWeight: local.language === val ? 700 : 500,
                  color: local.language === val ? '#2B5219' : '#2A2015',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {local.language === val && <span style={{ color: '#5A7A3A' }}>✓</span>}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div style={{ padding: '16px', background: '#F0F7E8', borderRadius: '8px', border: '1px solid #C8DEB0', marginBottom: '8px' }}>
          <p style={{ fontSize: '0.85rem', color: '#3C2815', lineHeight: 1.6 }}>
            <strong>🌾 GaonGetaway</strong> is designed for everyone — including elderly visitors, families, and people with disabilities. Contact us anytime if you need extra help.
          </p>
        </div>
      </div>

      {/* Save button */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid #E8DCC8', background: '#FAF6EE' }}>
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '14px',
            background: saved ? '#5A7A3A' : '#2B5219',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 700,
            transition: 'background 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          aria-live="polite"
        >
          {saved ? '✓ Settings Saved!' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  )
}
