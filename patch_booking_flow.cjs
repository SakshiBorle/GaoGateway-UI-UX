const fs = require('fs')
let code = fs.readFileSync('src/pages/BookingFlow.tsx', 'utf8')

code = code.replace(
  `{needsSpeech.status === 'error' && <p className="speech-error" role="alert">We couldn't hear that. Please try again. <button type="button" onClick={needsSpeech.retry}>Retry</button></p>}`,
  `{needsSpeech.status === 'error' && <p className="speech-error" role="alert">{needsSpeech.errorReason === 'not-allowed' ? 'Microphone access denied by browser.' : "We couldn't hear that. Please try again."} <button type="button" onClick={needsSpeech.retry}>Retry</button></p>}`
)

fs.writeFileSync('src/pages/BookingFlow.tsx', code)
