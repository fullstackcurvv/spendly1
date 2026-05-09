import { useState } from 'react'
import { Link } from 'react-router'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { SpendlyLogo } from './SpendlyLogo'

interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--page-bg-white)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <nav
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/" aria-label="Spendly home">
          <SpendlyLogo />
        </Link>

        {/* Desktop nav */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          className="hidden sm:flex"
        >
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/login"
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--btn-ghost-border)',
            }}
          >
            Sign in
          </Link>

          <Link
            to="/register"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--btn-primary-text)',
              backgroundColor: 'var(--btn-primary-bg)',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
            }}
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex sm:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '4px',
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: 'var(--page-bg-white)',
            borderTop: '1px solid var(--border)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
          className="sm:hidden"
        >
          <button
            onClick={onToggleTheme}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              padding: '0',
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--btn-ghost-border)',
              textAlign: 'center',
            }}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--btn-primary-text)',
              backgroundColor: 'var(--btn-primary-bg)',
              padding: '10px 18px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  )
}
