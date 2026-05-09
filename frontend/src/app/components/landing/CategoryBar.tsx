interface CategoryBarProps {
  label: string
  amount: string
  percentage: number
  color: string
}

export function CategoryBar({ label, amount, percentage, color }: CategoryBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8rem',
      }}
    >
      <span
        style={{
          width: '64px',
          color: 'var(--text-secondary)',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: '6px',
          borderRadius: '3px',
          backgroundColor: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: '3px',
            backgroundColor: color,
          }}
        />
      </div>
      <span
        style={{
          width: '52px',
          textAlign: 'right',
          color: 'var(--text-secondary)',
          flexShrink: 0,
          fontSize: '0.78rem',
        }}
      >
        {amount}
      </span>
    </div>
  )
}
