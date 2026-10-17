const fs = require('fs')

let code = fs.readFileSync('src/components/AccessibilityPanel.tsx', 'utf8')

code = code.replace(
  /\{\(\['normal', 'large', 'xlarge'\] as const\)\.map\(\(size, i\) => \([\s\S]*?\}\)\)}/,
  `<select
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
            </select>`
)

code = code.replace(
  /<p style=\{\{ fontSize: '0\.75rem'[\s\S]*?<\/p>/,
  ''
)

fs.writeFileSync('src/components/AccessibilityPanel.tsx', code)
