const bars = [
  { label: 'Food',   pct: 75, color: 'var(--cat-food)' },
  { label: 'Travel', pct: 55, color: '#4a90d9' },
  { label: 'Bills',  pct: 45, color: 'var(--cat-transport)' },
]

function StatCard({
  label,
  value,
  sub,
  subColor,
}: {
  label: string
  value: string
  sub: string
  subColor: string
}) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: 'var(--page-bg-white)',
        borderRadius: '10px',
        padding: '14px 16px',
        border: '1px solid var(--border)',
        textAlign: 'left',
      }}
    >
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
        {label}
      </p>
      <p
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '4px',
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: '0.75rem', color: subColor, fontWeight: 500 }}>{sub}</p>
    </div>
  )
}

export function ExpensePreviewCard() {
  return (
    <div
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          backgroundColor: '#e8e5e2',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#febc2e', display: 'inline-block' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#28c840', display: 'inline-block' }} />
      </div>

      {/* Dashboard body */}
      <div style={{ backgroundColor: '#f2efec', padding: '20px' }}>

        {/* Stat cards row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <StatCard
            label="This month"
            value="₹18,240"
            sub="+12% vs last"
            subColor="#d4183d"
          />
          <StatCard
            label="Budget left"
            value="₹6,760"
            sub="43% remaining"
            subColor="var(--brand-green)"
          />
          <StatCard
            label="Transactions"
            value="34"
            sub="this month"
            subColor="var(--text-muted)"
          />
        </div>

        {/* Category bars */}
        <div
          style={{
            backgroundColor: 'var(--page-bg-white)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            border: '1px solid var(--border)',
          }}
        >
          {bars.map((b) => (
            <div
              key={b.label}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}
            >
              <span
                style={{
                  width: '44px',
                  color: 'var(--text-secondary)',
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {b.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor: 'rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${b.pct}%`,
                    height: '100%',
                    borderRadius: '5px',
                    backgroundColor: b.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
