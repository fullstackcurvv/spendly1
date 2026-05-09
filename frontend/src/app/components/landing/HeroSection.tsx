import { Link } from 'react-router'
import { ExpensePreviewCard } from './ExpensePreviewCard'

export function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: 'var(--page-bg-white)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '80px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '48px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: copy */}
        <div style={{ flex: '1 1 340px', minWidth: 0 }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--badge-text)',
              backgroundColor: 'var(--badge-bg)',
              border: '1px solid var(--brand-green)',
              borderRadius: '4px',
              padding: '4px 10px',
              marginBottom: '24px',
            }}
          >
            Personal Finance Tracker
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}
          >
            Know where your
            <br />
            <em
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 800,
                color: 'var(--brand-green)',
              }}
            >
              money goes
            </em>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '420px',
              marginBottom: '36px',
            }}
          >
            Log expenses, understand your spending patterns, and take control of
            your financial life — one transaction at a time.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Start tracking free
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid var(--btn-ghost-border)',
                color: 'var(--text-primary)',
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Right: preview card */}
        <div
          style={{
            flex: '0 1 360px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ExpensePreviewCard />
        </div>
      </div>
    </section>
  )
}
