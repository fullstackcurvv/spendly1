import { useState } from 'react'
import { Link } from 'react-router'
import { ExpensePreviewCard } from './ExpensePreviewCard'

const VIDEO_EMBED = 'https://www.youtube.com/embed/-Lt-ntUDj-g?list=PLKnIA16_RmvaYH3poI0oJvbDF4zEvpq8W&autoplay=1'

export function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section style={{ backgroundColor: 'var(--page-bg-white)', padding: '72px 24px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>

        {/* Badge pill */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--badge-text)',
            backgroundColor: 'var(--badge-bg)',
            border: '1px solid rgba(44,168,90,0.35)',
            borderRadius: '999px',
            padding: '6px 16px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-green)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          Free to use · No credit card needed
        </span>

        {/* Heading */}
        <h1
          style={{
            fontSize: 'clamp(2.6rem, 6vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
            color: 'var(--text-primary)',
          }}
        >
          Track every rupee.
          <br />
          <span style={{ color: 'var(--brand-green)' }}>Know where it goes.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            maxWidth: '520px',
            margin: '0 auto 40px',
          }}
        >
          Spendly helps you log expenses, spot patterns, and stay on budget — without the spreadsheet headache.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '64px',
          }}
        >
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              borderRadius: '10px',
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            Create free account
          </Link>
          <button
            onClick={() => setVideoOpen(true)}
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              borderRadius: '10px',
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            See how it works
          </button>
        </div>

        {/* Dashboard mockup */}
        <ExpensePreviewCard />
      </div>

      {/* Video modal — iframe only rendered while open so video stops on close */}
      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', width: '90%', maxWidth: '820px' }}
          >
            <button
              onClick={() => setVideoOpen(false)}
              aria-label="Close video"
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.6rem',
                lineHeight: 1,
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              ✕
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
              <iframe
                src={VIDEO_EMBED}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
