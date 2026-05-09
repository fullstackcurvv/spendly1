import { Navbar } from './components/landing/Navbar'
import { HeroSection } from './components/landing/HeroSection'
import { FeaturesSection } from './components/landing/FeaturesSection'
import { CTASection } from './components/landing/CTASection'
import { Footer } from './components/landing/Footer'

interface LandingPageProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function LandingPage({ theme, onToggleTheme }: LandingPageProps) {
  return (
    <>
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
