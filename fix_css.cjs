const fs = require('fs')

let css = fs.readFileSync('src/index.css', 'utf8')

// Fix the malformed html:has
css = css.replace(/html:has\(body\nhtml:has\(body/g, '')

css += `
html:has(body.text-size-16px) { font-size: 16px; }
html:has(body.text-size-18px) { font-size: 18px; }
html:has(body.text-size-20px) { font-size: 20px; }
html:has(body.text-size-22px) { font-size: 22px; }
html:has(body.text-size-24px) { font-size: 24px; }
html:has(body.text-size-26px) { font-size: 26px; }
`
fs.writeFileSync('src/index.css', css)
