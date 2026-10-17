const fs = require('fs')

let code = fs.readFileSync('src/components/AccessibilityPanel.tsx', 'utf8')

const target = `            {(['normal', 'large', 'xlarge'] as const).map((size, i) => (
              <button
                key={size}
                onClick={() => update('textSize', size)}
                aria-pressed={local.textSize === size}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  border: \`2px solid \${local.textSize === size ? '#2B5219' : '#D4C4A0'}\`,
                  borderRadius: '8px',
                  background: local.textSize === size ? 'rgba(43,82,25,0.08)' : 'white',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: size === 'normal' ? '0.9rem' : size === 'large' ? '1.05rem' : '1.25rem',
                  fontWeight: 600,
                  color: local.textSize === size ? '#2B5219' : '#6A5840',
                  transition: 'all 0.15s ease',
                }}
              >
                {['A−', 'A', 'A+'][i]}
              </button>
            ))}`

const replacement = `<select
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

code = code.replace(target, replacement)
fs.writeFileSync('src/components/AccessibilityPanel.tsx', code)
