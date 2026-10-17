const fs = require('fs')
let code = fs.readFileSync('src/App.tsx', 'utf8')

// Add useSpeechToText import if not there, wait, it's not imported in App.tsx?
// App.tsx imports: import { installContextualSpeech } from './speech'
code = code.replace(
  `import { installContextualSpeech } from './speech'`,
  `import { installContextualSpeech, useSpeechToText } from './speech'`
)

// Update VoiceNavigationModal props in App.tsx
code = code.replace(
  `<VoiceNavigationModal
            command={voiceCommand}
            onCommand={handleVoiceCommand}
            onClose={() => setShowVoiceNav(false)}
          />`,
  `<VoiceNavigationModal
            command={voiceCommand}
            onCommand={handleVoiceCommand}
            onClose={() => setShowVoiceNav(false)}
            language={a11y.language}
          />`
)

// Update VoiceNavigationModal definition
code = code.replace(
  `function VoiceNavigationModal({ command, onCommand, onClose }: {
  command: string
  onCommand: (cmd: string) => void
  onClose: () => void
}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')`,
  `function VoiceNavigationModal({ command, onCommand, onClose, language }: {
  command: string
  onCommand: (cmd: string) => void
  onClose: () => void
  language: any
}) {
  const [transcript, setTranscript] = useState('')
  const speech = useSpeechToText(language, text => {
    simulateCommand(text)
  })
  const isListening = speech.status === 'listening'`
)

// Update button onClick
code = code.replace(
  `onClick={() => setIsListening(!isListening)}`,
  `onClick={() => isListening ? speech.stop() : speech.start()}`
)

// Update listening text
code = code.replace(
  `{isListening ? 'Listening...' : 'Tap to speak'}`,
  `{speech.status === 'unsupported' ? 'Voice unsupported' : speech.status === 'error' ? (speech.errorReason === 'not-allowed' ? 'Mic access denied' : 'Try again') : isListening ? 'Listening...' : 'Tap to speak'}`
)

fs.writeFileSync('src/App.tsx', code)
