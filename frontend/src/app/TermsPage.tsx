import { Navbar } from './components/landing/Navbar'
import { Footer } from './components/landing/Footer'

interface TermsPageProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const sections = [
  {
    title: 'Acceptance of Terms',
    body: `By accessing or using Spendly, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use the service. These terms apply to all visitors, users, and others who access Spendly.`,
  },
  {
    title: 'Use of Service',
    body: `Spendly is a personal expense-tracking tool intended for individual, non-commercial use. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.`,
  },
  {
    title: 'User Data',
    body: `You retain ownership of the expense data you enter into Spendly. We collect only the information necessary to provide the service, including your name, email address, and the expense records you create. We do not sell your personal data to third parties. Your data may be stored on secure servers and is processed solely to deliver the features of the application.`,
  },
  {
    title: 'Limitations of Liability',
    body: `Spendly is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, error-free, or completely secure. To the fullest extent permitted by law, Spendly and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.`,
  },
  {
    title: 'Changes to Terms',
    body: `We reserve the right to update or modify these Terms and Conditions at any time. When we do, we will revise the date at the bottom of this page. Continued use of Spendly after any changes constitutes your acceptance of the new terms. We encourage you to review this page periodically.`,
  },
]

export function TermsPage({ theme, onToggleTheme }: TermsPageProps) {
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
            Terms and Conditions
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
