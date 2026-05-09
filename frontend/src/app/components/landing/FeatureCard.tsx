import type { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '28px 24px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          marginBottom: '16px',
          color: 'var(--text-secondary)',
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          marginBottom: '10px',
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  )
}
