const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

code = code.replace(
  `    body.classList.remove(
      'text-size-large', 'text-size-xlarge', 'high-contrast', 'reduce-animation',
      'theme-farm', 'theme-dark', 'font-atkinson', 'font-serif',
      'tracking-wide', 'tracking-wider', 'leading-relaxed', 'leading-loose',
      'icons-small', 'icons-large',
    )`,
  `    body.classList.remove(
      'text-size-16px', 'text-size-18px', 'text-size-20px', 'text-size-22px', 'text-size-24px', 'text-size-26px',
      'high-contrast', 'reduce-animation',
      'theme-farm', 'theme-dark', 'font-atkinson', 'font-serif',
      'tracking-wide', 'tracking-wider', 'leading-relaxed', 'leading-loose',
      'icons-xsmall', 'icons-small', 'icons-large', 'icons-xlarge',
      'text-size-large', 'text-size-xlarge' // keep for cleanup
    )`
)

code = code.replace(
  `    if (a11y.textSize === 'large') body.classList.add('text-size-large')
    if (a11y.textSize === 'xlarge') body.classList.add('text-size-xlarge')`,
  `    if (a11y.textSize) body.classList.add(\`text-size-\${a11y.textSize}\`)`
)

code = code.replace(
  `    if (a11y.iconSize === 'small') body.classList.add('icons-small')
    if (a11y.iconSize === 'large') body.classList.add('icons-large')`,
  `    if (a11y.iconSize !== 'medium') body.classList.add(\`icons-\${a11y.iconSize}\`)`
)

fs.writeFileSync('src/App.tsx', code)
