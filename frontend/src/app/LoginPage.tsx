import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import api from '../lib/api'
import { SpendlyLogo } from './components/landing/SpendlyLogo'

interface FormState {
  email: string
  password: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const data = err.response?.data
        if (status === 401) {
          setError(data?.error ?? 'Invalid email or password.')
        } else if (status === 400 && data?.errors) {
          const firstError = Object.values(data.errors as Record<string, string>)[0]
          setError(firstError ?? 'Please check your input.')
        } else {
          setError('Something went wrong. Please try again.')
        }
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--page-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-block' }}>
            <SpendlyLogo />
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px 32px',
          }}
        >
          <h1
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 6px',
            }}
          >
            Sign in to Spendly
          </h1>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: '0 0 28px',
            }}
          >
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '6px',
                }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--page-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--page-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Inline error */}
            {error && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--destructive)',
                  margin: '0 0 16px',
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--btn-primary-text)',
                backgroundColor: loading ? 'var(--text-muted)' : 'var(--btn-primary-bg)',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Sign-up link */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--brand-green)', fontWeight: 500 }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
