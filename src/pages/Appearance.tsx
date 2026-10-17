import type { AccessibilityConfig, Page } from '../types'

interface Props {
  navigate: (page: Page) => void
  goBack: () => void
  a11y: AccessibilityConfig
  onUpdate: (config: AccessibilityConfig) => void
}

export default function Appearance({ goBack, a11y, onUpdate }: Props) {
  const update = <K extends keyof AccessibilityConfig>(key: K, value: AccessibilityConfig[K]) => onUpdate({ ...a11y, [key]: value })
  const textSizes = ['16px', '18px', '20px', '22px', '24px', '26px'] as const
  const letterSpaces = ['normal', 'wide', 'wider'] as const
  const lineSpaces = ['normal', 'relaxed', 'loose'] as const
  return (
    <div className="page-shell settings-page">
      <button className="back-link" onClick={goBack}>← Back to profile</button>
      <header className="page-hero page-hero--compact"><p className="eyebrow">Personalisation</p><h1>Appearance & Accessibility</h1><p>Adjust the experience so every visit feels comfortable to read and use.</p></header>
      <div className="settings-layout">
        <div className="settings-controls">
          <fieldset><legend>Theme</legend><div className="theme-options">{(['standard', 'farm', 'dark', 'high-contrast'] as const).map(theme => <label key={theme} className={a11y.theme === theme ? 'theme-option selected' : 'theme-option'}><input type="radio" name="theme" checked={a11y.theme === theme} onChange={() => update('theme', theme)} /><i className={`theme-swatch theme-swatch--${theme}`} /><strong>{theme === 'high-contrast' ? 'High Contrast' : theme[0].toUpperCase() + theme.slice(1)}</strong></label>)}</div></fieldset>
          <fieldset><legend>Font</legend><select value={a11y.font} onChange={event => update('font', event.target.value as AccessibilityConfig['font'])}><option value="source">Source Sans 3</option><option value="atkinson">Atkinson Hyperlegible</option><option value="serif">Readable Serif</option></select></fieldset>
          <fieldset><legend>Font size</legend><label className="range-setting"><span>A−</span><input type="range" min="0" max="5" value={textSizes.indexOf(a11y.textSize)} onChange={event => update('textSize', textSizes[Number(event.target.value)])} /><span>A+</span><span style={{marginLeft:'10px',fontSize:'14px',fontWeight:'bold'}}>{a11y.textSize}</span></label></fieldset>
          <fieldset><legend>Letter spacing</legend><label className="range-setting"><span>−</span><input type="range" min="0" max="2" value={letterSpaces.indexOf(a11y.letterSpacing)} onChange={event => update('letterSpacing', letterSpaces[Number(event.target.value)])} /><span>+</span></label></fieldset>
          <fieldset><legend>Line spacing</legend><label className="range-setting"><span>−</span><input type="range" min="0" max="2" value={lineSpaces.indexOf(a11y.lineSpacing)} onChange={event => update('lineSpacing', lineSpaces[Number(event.target.value)])} /><span>+</span></label></fieldset>
          <fieldset><legend>Icon size</legend><div className="segmented-control">{(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map(size => <button className={a11y.iconSize === size ? 'active' : ''} onClick={() => update('iconSize', size)} key={size}>{size === 'xsmall' ? 'XS' : size === 'small' ? 'S' : size === 'medium' ? 'M' : size === 'large' ? 'L' : 'XL'}</button>)}</div></fieldset>
        </div>
        <aside className="live-preview"><p className="eyebrow">Live preview</p><div className={`preview-copy preview-${a11y.font} preview-size-${a11y.textSize} preview-spacing-${a11y.letterSpacing} preview-leading-${a11y.lineSpacing}`}><h2>A gentler pace.</h2><p>Experience the farm at your own pace. GaonGetaway brings together nature, local food and traditional farm experiences.</p><button className="button button--primary" onClick={() => alert('This preview button uses your current appearance settings.')}>Sample Button</button></div></aside>
      </div>
    </div>
  )
}
