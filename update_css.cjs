const fs = require('fs')

let css = fs.readFileSync('src/index.css', 'utf8')

// Remove old explicit text sizes
css = css.replace(/\.text-size-large[^{]*{[^}]*}/g, '')
css = css.replace(/\.text-size-xlarge[^{]*{[^}]*}/g, '')

// Replace the html:has rules
css = css.replace(
  `html:has(body.text-size-large) { font-size: 18px; }
html:has(body.text-size-xlarge) { font-size: 20px; }`,
  `html:has(body.text-size-16px) { font-size: 16px; }
html:has(body.text-size-18px) { font-size: 18px; }
html:has(body.text-size-20px) { font-size: 20px; }
html:has(body.text-size-22px) { font-size: 22px; }
html:has(body.text-size-24px) { font-size: 24px; }
html:has(body.text-size-26px) { font-size: 26px; }`
)

// Replace the icons rules
css = css.replace(
  `.icons-small [aria-hidden="true"] { font-size: .85em; }
.icons-large [aria-hidden="true"] { font-size: 1.25em; }`,
  `.icons-xsmall [aria-hidden="true"] { font-size: .7em; }
.icons-small [aria-hidden="true"] { font-size: .85em; }
.icons-large [aria-hidden="true"] { font-size: 1.25em; }
.icons-xlarge [aria-hidden="true"] { font-size: 1.5em; }`
)

// Replace icon button scaling
css = css.replace(
  `.icons-small .icon-button { transform: scale(.9); }
.icons-large .icon-button { transform: scale(1.13); }`,
  `.icons-xsmall .icon-button { transform: scale(.75); }
.icons-small .icon-button { transform: scale(.9); }
.icons-large .icon-button { transform: scale(1.13); }
.icons-xlarge .icon-button { transform: scale(1.3); }`
)

fs.writeFileSync('src/index.css', css)
