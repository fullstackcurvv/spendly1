import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { LandingPage } from './LandingPage'
import { TermsPage } from './TermsPage'
import { PrivacyPage } from './PrivacyPage'
import { RegisterPage } from './RegisterPage'
import { LoginPage } from './LoginPage'
import { DashboardPage } from './DashboardPage'
import { GuestRoute } from './GuestRoute'
import { PrivateRoute } from './PrivateRoute'

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage theme={theme} onToggleTheme={toggleTheme} />}
        />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/terms" element={<TermsPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/policy" element={<PrivacyPage theme={theme} onToggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  )
}
