const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Add showLogoutSuccess state
code = code.replace(
  `  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)`,
  `  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false)`
)

// Update handleLogout
code = code.replace(
  `  const handleLogout = () => {
    setUser(null)
    setShowLogoutConfirm(false)
    navigate('home')
  }`,
  `  const handleLogout = () => {
    setUser(null)
    setShowLogoutConfirm(false)
    setShowLogoutSuccess(true)
    setTimeout(() => setShowLogoutSuccess(false), 3000)
    navigate('home')
  }`
)

// Add the success toast
code = code.replace(
  `      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (`,
  `      {/* Logout success toast */}
      {showLogoutSuccess && (
        <div className="language-toast" role="status" style={{ bottom: '20px', top: 'auto' }}>
          <strong>✓ Logged out</strong>
          <span>You have been successfully logged out.</span>
        </div>
      )}

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (`
)

// Update onLogout to call handleLogout directly
code = code.replace(
  `          onLogout={() => setShowLogoutConfirm(true)}`,
  `          onLogout={handleLogout}`
)

// Update onLogout in Account case to also call handleLogout directly to be consistent
code = code.replace(
  `          ? <Account navigate={navigate} goBack={goBack} user={user} onLogout={() => setShowLogoutConfirm(true)} a11y={a11y} onOpenA11y={() => setShowA11yPanel(true)} />`,
  `          ? <Account navigate={navigate} goBack={goBack} user={user} onLogout={handleLogout} a11y={a11y} onOpenA11y={() => setShowA11yPanel(true)} />`
)

fs.writeFileSync('src/App.tsx', code)
