import { Link } from 'react-router'

export function CTASection() {
  return (
    <section
      style={{
        backgroundColor: 'var(--page-bg)',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            color: 'var(--text-primary)',
          }}
        >
          Ready to take control?
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            marginBottom: '36px',
          }}
        >
          Join thousands of people who track their expenses with Spendly.
        </p>
        <Link
          to="/register"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            borderRadius: '8px',
            backgroundColor: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          Create free account
        </Link>
      </div>
    </section>
  )
}
