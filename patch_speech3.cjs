const fs = require('fs')
let code = fs.readFileSync('src/speech.ts', 'utf8')

code = code.replace(
  `    recognition.current?.abort()`,
  `    window.speechSynthesis?.cancel()
    recognition.current?.abort()`
)

fs.writeFileSync('src/speech.ts', code)
