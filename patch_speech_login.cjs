const fs = require('fs')
let code = fs.readFileSync('src/speech.ts', 'utf8')
code = code.replace(
  `    logout: 'Log out of your account.',`,
  `    logout: 'Log out of your account.',
    login: 'Log in to your account.',`
)
fs.writeFileSync('src/speech.ts', code)
