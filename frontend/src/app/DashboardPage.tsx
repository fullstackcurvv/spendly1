import React, { useEffect, useState } from 'react'
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

type Category = 'FOOD' | 'TRANSPORT' | 'BILLS' | 'HEALTH' | 'ENTERTAINMENT' | 'SHOPPING' | 'OTHER'

interface ExpenseResponse {
  id: string
  userId: string
  amount: number
  category: Category
  date: string
  description: string
  createdAt: string
}

interface CategorySummary {
  category: string
  total: number
}

const CAT: Record<Category, { label: string; pillBg: string; pillColor: string; line: string }> = {
  FOOD:          { label: 'Food',          pillBg: '#dcfce7', pillColor: '#166534', line: '#22c55e' },
  TRANSPORT:     { label: 'Transport',     pillBg: '#1f2937', pillColor: '#ffffff', line: '#eab308' },
  BILLS:         { label: 'Bills',         pillBg: '#dbeafe', pillColor: '#1e40af', line: '#3b82f6' },
  HEALTH:        { label: 'Health',        pillBg: '#ffedd5', pillColor: '#c2410c', line: '#f97316' },
  ENTERTAINMENT: { label: 'Entertainment', pillBg: '#ede9fe', pillColor: '#7c3aed', line: '#8b5cf6' },
  SHOPPING:      { label: 'Shopping',      pillBg: '#fed7aa', pillColor: '#9a3412', line: '#ea580c' },
  OTHER:         { label: 'Other',         pillBg: '',        pillColor: '#888888', line: '#9ca3af' },
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${parseInt(day)} ${MONTHS[parseInt(month) - 1]} ${year}`
}

function formatMemberSince(createdAt: string): string {
  const d = new Date(createdAt)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatRupee(n: number): string {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).join('').slice(0, 2)
}

const card: React.CSSProperties = {
  backgroundColor: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '24px',
}

const statLabel: React.CSSProperties = {
  margin: '0 0 6px',
  fontSize: '0.65rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const statValue: React.CSSProperties = {
  margin: 0,
  fontWeight: 700,
  fontSize: '1.6rem',
  color: 'var(--text-primary)',
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([])
  const [summary, setSummary] = useState<CategorySummary[]>([])

  useEffect(() => {
    const onAuthError = (err: unknown) => {
      if (axios.isAxiosError(err)) {
        const s = err.response?.status
        if (s === 401 || s === 403) navigate('/login')
      }
    }

    api.get('/users/me').then(r => setProfile(r.data)).catch(onAuthError)
    api.get('/expenses').then(r => setExpenses(r.data)).catch(onAuthError)
    api.get('/expenses/summary').then(r => setSummary(
      [...r.data].sort((a: CategorySummary, b: CategorySummary) => b.total - a.total)
    )).catch(onAuthError)
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
  const topCategory = summary[0]?.category as Category | undefined

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--page-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header style={{
        backgroundColor: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <SpendlyLogo />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {profile?.name.split(' ')[0]}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 500,
              padding: 0,
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main style={{
        flex: 1,
        padding: '28px 32px',
        maxWidth: '980px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {/* Profile card */}
        <div style={{
          ...card,
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          marginBottom: '20px',
          padding: '20px 24px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#166534',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}>
              {profile ? getInitials(profile.name) : ''}
            </span>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              {profile?.name}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {profile?.email}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Member since {profile ? formatMemberSince(profile.createdAt) : ''}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ ...card, padding: '20px 24px' }}>
            <p style={statLabel}>TOTAL SPENT</p>
            <p style={statValue}>{formatRupee(totalSpent)}</p>
          </div>
          <div style={{ ...card, padding: '20px 24px' }}>
            <p style={statLabel}>TRANSACTIONS</p>
            <p style={statValue}>{expenses.length}</p>
          </div>
          <div style={{ ...card, padding: '20px 24px' }}>
            <p style={statLabel}>TOP CATEGORY</p>
            <p style={statValue}>{topCategory ? CAT[topCategory]?.label ?? topCategory : '—'}</p>
          </div>
        </div>

        {/* Two-column section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', alignItems: 'start' }}>
          {/* Recent Transactions */}
          <div style={card}>
            <h2 style={{ margin: '0 0 18px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Transactions
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {(['DATE', 'DESCRIPTION', 'CATEGORY', 'AMOUNT'] as const).map((h) => (
                    <th key={h} style={{
                      textAlign: h === 'AMOUNT' ? 'right' : 'left',
                      paddingBottom: '10px',
                      paddingRight: h !== 'AMOUNT' ? '16px' : '0',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, i) => {
                  const cat = CAT[expense.category]
                  const isLast = i === expenses.length - 1
                  const rowBorder = isLast ? undefined : '1px solid var(--border)'
                  return (
                    <tr key={expense.id}>
                      <td style={{ padding: '11px 16px 11px 0', fontSize: '0.8rem', color: 'var(--text-secondary)', borderBottom: rowBorder, whiteSpace: 'nowrap' }}>
                        {formatDate(expense.date)}
                      </td>
                      <td style={{ padding: '11px 16px 11px 0', fontSize: '0.875rem', color: 'var(--text-primary)', borderBottom: rowBorder }}>
                        {expense.description}
                      </td>
                      <td style={{ padding: '11px 16px 11px 0', borderBottom: rowBorder }}>
                        {expense.category === 'OTHER' ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Other</span>
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '100px',
                            backgroundColor: cat.pillBg,
                            color: cat.pillColor,
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}>
                            {cat.label}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '11px 0', fontSize: '0.875rem', color: 'var(--text-primary)', borderBottom: rowBorder, textAlign: 'right', fontWeight: 500 }}>
                        {formatRupee(expense.amount)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* By Category */}
          <div style={card}>
            <h2 style={{ margin: '0 0 18px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              By Category
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {summary.map(({ category, total }) => {
                const cat = CAT[category as Category]
                const label = cat?.label ?? category
                const line = cat?.line ?? '#9ca3af'
                return (
                  <div key={category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{label}</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{formatRupee(total)}</span>
                    </div>
                    <div style={{ height: '3px', backgroundColor: line, borderRadius: '2px' }} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
