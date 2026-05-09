import { Navbar } from './components/landing/Navbar'
import { Footer } from './components/landing/Footer'

interface PrivacyPageProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const sections = [
  {
    title: 'Acceptance of Privacy Policy',
    body: `By using Spendly, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described herein. If you do not agree with this policy, please discontinue use of the service.`,
  },
  {
    title: 'Information We Collect',
    body: `We collect the minimum information necessary to operate Spendly. This includes your name, email address, and the expense data you voluntarily enter into the application. We do not collect payment information, location data, or any information beyond what is required to deliver the core features of the service.`,
  },
  {
    title: 'How We Use Your Data',
    body: `Your data is used exclusively to provide and improve Spendly's functionality. This includes displaying your expense history, generating spending summaries by category, and maintaining your account. We do not use your data for advertising, profiling, or any purpose unrelated to the service you have signed up for.`,
  },
  {
    title: 'Data Storage and Security',
    body: `Your data is stored on secure servers with industry-standard encryption in transit and at rest. Access to user data is strictly limited to what is required to operate the service. While we take reasonable precautions to protect your information, no system is completely immune to risk, and we cannot guarantee absolute security.`,
  },
  {
    title: 'Sharing of Information',
    body: `We do not sell, rent, or trade your personal information to third parties. We may share data only when required by law, to comply with a legal obligation, or to protect the rights and safety of our users. Any third-party services we rely on for infrastructure are bound by their own privacy commitments.`,
  },
  {
    title: 'Changes to Privacy Policy',
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. When we do, we will revise the date at the bottom of this page. We encourage you to review this page periodically. Continued use of Spendly after any changes constitutes your acceptance of the updated policy.`,
  },
]

export function PrivacyPage({ theme, onToggleTheme }: PrivacyPageProps) {
  return (
    <>
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main
        style={{
          backgroundColor: 'var(--page-bg)',
          minHeight: 'calc(100vh - 56px)',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              marginBottom: '48px',
            }}
          >
            Last updated: May 2025
          </p>

          {sections.map((s) => (
            <section key={s.title} style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.75',
                  color: 'var(--text-secondary)',
                }}
              >
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
