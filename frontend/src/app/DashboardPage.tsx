import { useNavigate } from 'react-router'

interface StoredUser {
  id: string
  name: string
  email: string
  createdAt: string
}

export function DashboardPage() {
  const navigate = useNavigate()
  const user: StoredUser = JSON.parse(localStorage.getItem('user') ?? '{}')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
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
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px 32px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 8px',
            }}
          >
            Welcome back, {user.name ?? 'there'}!
          </h1>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: '0 0 32px',
            }}
          >
            {user.email}
          </p>

          <button
            onClick={handleLogout}
            style={{
              padding: '10px 24px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--btn-primary-text)',
              backgroundColor: 'var(--btn-primary-bg)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
