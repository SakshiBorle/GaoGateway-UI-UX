const fs = require('fs')
let file = 'src/pages/Appearance.tsx'
let code = fs.readFileSync(file, 'utf8')

code = code.replace(
  `const textSizes = ['normal', 'large', 'xlarge'] as const`,
  `const textSizes = ['16px', '18px', '20px', '22px', '24px', '26px'] as const`
)

code = code.replace(
  `<fieldset><legend>Font size</legend><label className="range-setting"><span>A−</span><input type="range" min="0" max="2" value={textSizes.indexOf(a11y.textSize)} onChange={event => update('textSize', textSizes[Number(event.target.value)])} /><span>A+</span></label></fieldset>`,
  `<fieldset><legend>Font size</legend><label className="range-setting"><span>A−</span><input type="range" min="0" max="5" value={textSizes.indexOf(a11y.textSize)} onChange={event => update('textSize', textSizes[Number(event.target.value)])} /><span>A+</span><span style={{marginLeft:'10px',fontSize:'14px',fontWeight:'bold'}}>{a11y.textSize}</span></label></fieldset>`
)

code = code.replace(
  `{(['small', 'medium', 'large'] as const).map(size => <button className={a11y.iconSize === size ? 'active' : ''} onClick={() => update('iconSize', size)} key={size}>{size[0].toUpperCase() + size.slice(1)}</button>)}`,
  `{(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map(size => <button className={a11y.iconSize === size ? 'active' : ''} onClick={() => update('iconSize', size)} key={size}>{size === 'xsmall' ? 'XS' : size === 'small' ? 'S' : size === 'medium' ? 'M' : size === 'large' ? 'L' : 'XL'}</button>)}`
)

fs.writeFileSync(file, code)
