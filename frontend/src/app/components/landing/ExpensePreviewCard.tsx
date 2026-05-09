import { CategoryBar } from './CategoryBar'

const categories = [
  { label: 'Bills',     amount: '₹4,500', percentage: 100, color: 'var(--cat-bills)' },
  { label: 'Food',      amount: '₹3,200', percentage: 71,  color: 'var(--cat-food)' },
  { label: 'Health',    amount: '₹2,050', percentage: 46,  color: 'var(--cat-health)' },
  { label: 'Transport', amount: '₹1,800', percentage: 40,  color: 'var(--cat-transport)' },
]

export function ExpensePreviewCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '340px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          March 2026
        </span>
        <span
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          ₹12,450
        </span>
      </div>

      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--border)',
          marginBottom: '18px',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {categories.map((cat) => (
          <CategoryBar key={cat.label} {...cat} />
        ))}
      </div>
    </div>
  )
}
