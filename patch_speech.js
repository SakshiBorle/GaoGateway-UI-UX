const fs = require('fs')
let code = fs.readFileSync('src/speech.ts', 'utf8')

code = code.replace(
  `    instance.onerror = () => setStatus('error')`,
  `    instance.onerror = (event) => { console.error('Speech recognition error:', event.error); setStatus('error') }`
)

fs.writeFileSync('src/speech.ts', code)
