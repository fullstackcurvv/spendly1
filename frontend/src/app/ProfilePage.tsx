import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import api from '../lib/api'
import { SpendlyLogo } from './components/landing/SpendlyLogo'

interface ProfileData {
  id: string
  name: string
  email: string
  createdAt: string
}

export function ProfilePage() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [nameForm, setNameForm] = useState({ name: '' })
  const [nameLoading, setNameLoading] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameSuccess, setNameSuccess] = useState<string | null>(null)

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState<string | null>(null)

  useEffect(() => {
    api.get('/users/me')
      .then((res) => {
        setProfile(res.data)
        setNameForm({ name: res.data.name })
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          if (status === 401 || status === 403) navigate('/login')
        }
      })
  }, [navigate])

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNameForm({ name: e.target.value })
  }

  function handlePwChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNameLoading(true)
    setNameError(null)
    setNameSuccess(null)

    try {
      const res = await api.patch('/users/me', { name: nameForm.name })
      const updated: ProfileData = res.data
      setProfile(updated)
      setNameForm({ name: updated.name })
      localStorage.setItem('user', JSON.stringify(updated))
      setNameSuccess('Name updated successfully')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const data = err.response?.data
        if (status === 400 && data?.errors) {
          const firstError = Object.values(data.errors as Record<string, string>)[0]
          setNameError(firstError ?? 'Please check your input.')
        } else {
          setNameError('Something went wrong. Please try again.')
        }
      } else {
        setNameError('Something went wrong. Please try again.')
      }
    } finally {
      setNameLoading(false)
    }
  }

  async function handlePwSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPwError(null)
    setPwSuccess(null)

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Passwords do not match')
      return
    }

    setPwLoading(true)

    try {
      await api.patch('/users/me/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPwSuccess('Password changed successfully')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const data = err.response?.data
        if (status === 401) {
          setPwError('Current password is incorrect')
        } else if (status === 400 && data?.errors) {
          const firstError = Object.values(data.errors as Record<string, string>)[0]
          setPwError(firstError ?? 'Please check your input.')
        } else {
          setPwError('Something went wrong. Please try again.')
        }
      } else {
        setPwError('Something went wrong. Please try again.')
      }
    } finally {
      setPwLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--page-bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '6px',
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
      <div style={{ width: '100%', maxWidth: '480px' }}>
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
            Profile
          </h1>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: '0 0 28px',
            }}
          >
            {profile?.email ?? ''}
          </p>

          {/* Section 1: Display name */}
          <form onSubmit={handleNameSubmit} noValidate>
            <p
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 16px',
              }}
            >
              Display name
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="name" style={labelStyle}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={nameForm.name}
                onChange={handleNameChange}
                placeholder="Your name"
                style={inputStyle}
              />
            </div>

            {nameError && (
              <p style={{ fontSize: '0.875rem', color: 'var(--destructive)', margin: '0 0 12px' }}>
                {nameError}
              </p>
            )}
            {nameSuccess && (
              <p style={{ fontSize: '0.875rem', color: 'var(--brand-green)', margin: '0 0 12px' }}>
                {nameSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={nameLoading}
              style={{
                padding: '10px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--btn-primary-text)',
                backgroundColor: nameLoading ? 'var(--text-muted)' : 'var(--btn-primary-bg)',
                border: 'none',
                borderRadius: '8px',
                cursor: nameLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {nameLoading ? 'Saving…' : 'Save'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border)', margin: '28px 0' }} />

          {/* Section 2: Change password */}
          <form onSubmit={handlePwSubmit} noValidate>
            <p
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 16px',
              }}
            >
              Change password
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="currentPassword" style={labelStyle}>
                Current password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                placeholder="Your current password"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="newPassword" style={labelStyle}>
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                placeholder="At least 8 characters"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="confirmPassword" style={labelStyle}>
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={pwForm.confirmPassword}
                onChange={handlePwChange}
                placeholder="Repeat new password"
                style={inputStyle}
              />
            </div>

            {pwError && (
              <p style={{ fontSize: '0.875rem', color: 'var(--destructive)', margin: '0 0 12px' }}>
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p style={{ fontSize: '0.875rem', color: 'var(--brand-green)', margin: '0 0 12px' }}>
                {pwSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={pwLoading}
              style={{
                padding: '10px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--btn-primary-text)',
                backgroundColor: pwLoading ? 'var(--text-muted)' : 'var(--btn-primary-bg)',
                border: 'none',
                borderRadius: '8px',
                cursor: pwLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {pwLoading ? 'Changing…' : 'Change password'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem' }}>
          <Link to="/dashboard" style={{ color: 'var(--brand-green)', fontWeight: 500 }}>
            ← Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
