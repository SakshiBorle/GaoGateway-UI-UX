const fs = require('fs')

let code = fs.readFileSync('src/speech.ts', 'utf8')

code = code.replace(
  `    'book a stay': 'Book a stay.',
    'check availability': 'Check availability.',`,
  `    'book a stay': 'Start booking your stay.',
    'check availability': 'Check availability.',
    stay: 'Explore our stay options.',
    story: 'Learn about our story.',
    'our story': 'Learn about our story.',
    logout: 'Log out of your account.',`
)

fs.writeFileSync('src/speech.ts', code)
