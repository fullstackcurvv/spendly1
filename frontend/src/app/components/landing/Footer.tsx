import { SpendlyLogo } from './SpendlyLogo'

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--footer-bg)',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '12px',
        }}
      >
        <SpendlyLogo variant="footer" />
      </div>
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--footer-text)',
          marginTop: '8px',
        }}
      >
        Track every rupee. Own your finances.
      </p>
      <p style={{ marginTop: '12px', fontSize: '0.8rem' }}>
        <a href="/terms" style={{ color: 'var(--footer-text)' }}>Terms and Conditions</a>
        {' · '}
        <a href="/policy" style={{ color: 'var(--footer-text)' }}>Privacy Policy</a>
      </p>
    </footer>
  )
}
