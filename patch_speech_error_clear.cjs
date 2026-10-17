const fs = require('fs')
let code = fs.readFileSync('src/speech.ts', 'utf8')

code = code.replace(
  `  const start = () => {`,
  `  const start = () => {
    setErrorReason('')`
)

fs.writeFileSync('src/speech.ts', code)
