import { IndianRupee, Target, Clock } from 'lucide-react'
import { FeatureCard } from './FeatureCard'

const features = [
  {
    icon: <IndianRupee size={22} />,
    title: 'Log expenses instantly',
    description:
      'Add any expense in seconds. Category, amount, date, description — all in one simple form.',
  },
  {
    icon: <Target size={22} />,
    title: 'Understand your patterns',
    description:
      'See exactly where your money goes with category breakdowns and monthly summaries.',
  },
  {
    icon: <Clock size={22} />,
    title: 'Filter by time period',
    description:
      'View your spending for any date range — last week, last month, or a custom period.',
  },
]

export function FeaturesSection() {
  return (
    <section
      style={{
        backgroundColor: 'var(--page-bg)',
        padding: '80px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}
      >
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  )
}
