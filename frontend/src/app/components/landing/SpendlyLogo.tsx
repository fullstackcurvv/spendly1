interface SpendlyLogoProps {
  variant?: 'dark' | 'light' | 'footer'
}

export function SpendlyLogo({ variant = 'dark' }: SpendlyLogoProps) {
  const textColor =
    variant === 'footer' ? '#ffffff' : 'var(--text-primary)'
  const iconColor =
    variant === 'footer' ? '#c8580a' : 'var(--logo-icon)'

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 1L19 7.5L10 19L1 7.5L10 1Z"
          fill={iconColor}
          stroke={iconColor}
          strokeWidth="0.5"
        />
      </svg>
      <span
        style={{
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '-0.02em',
          color: textColor,
        }}
      >
        Spendly
      </span>
    </span>
  )
}
