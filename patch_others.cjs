const fs = require('fs')

function patchFile(path, hookNames) {
  let code = fs.readFileSync(path, 'utf8')
  hookNames.forEach(hookName => {
    code = code.replace(
      new RegExp(`\\{${hookName}\\.status === 'error' && <p className="speech-error"( role="alert")?>We couldn't hear that. Please try again. <button( type="button")? onClick=\\{${hookName}\\.retry\\}>Retry<\\/button><\\/p>}`),
      `{${hookName}.status === 'error' && <p className="speech-error" role="alert">{${hookName}.errorReason === 'not-allowed' ? 'Microphone access denied by browser.' : "We couldn't hear that. Please try again."} <button type="button" onClick={${hookName}.retry}>Retry</button></p>}`
    )
  })
  fs.writeFileSync(path, code)
}

patchFile('src/pages/PersonalItinerary.tsx', ['interestSpeech', 'notesSpeech'])
patchFile('src/pages/Reviews.tsx', ['reviewSpeech'])
