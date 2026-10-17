const fs = require('fs')
let code = fs.readFileSync('src/speech.ts', 'utf8')

code = code.replace(
  `const [status, setStatus] = useState<'idle' | 'listening' | 'error' | 'unsupported'>('idle')`,
  `const [status, setStatus] = useState<'idle' | 'listening' | 'error' | 'unsupported'>('idle')
  const [errorReason, setErrorReason] = useState<string>('')`
)

code = code.replace(
  `    instance.onerror = (event) => { console.error('Speech recognition error:', event.error); setStatus('error') }`,
  `    instance.onerror = (event) => { 
      console.error('Speech recognition error:', event.error)
      setErrorReason(event.error)
      setStatus('error') 
    }`
)

code = code.replace(
  `  return { status, start, stop, retry: start }`,
  `  return { status, errorReason, start, stop, retry: start }`
)

fs.writeFileSync('src/speech.ts', code)
