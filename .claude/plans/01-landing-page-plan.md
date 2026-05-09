# Implementation Plan: Landing Page (01-landing-page)

## Context

The Spendly landing page was built from scratch. The `frontend/` directory had `node_modules/` installed (all packages present) but no source files. The reference design is in `spendly-landing-page.jpeg` and the spec lives at `.claude/specs/01-landing-page.md`. The goal is a pixel-perfect implementation of the design with light/dark mode support.

---

## What was built

### Config files
| File | Purpose |
|------|---------|
| `frontend/package.json` | Project config |
| `frontend/vite.config.ts` | Vite + `@tailwindcss/vite` plugin + `@` alias |
| `frontend/tsconfig.json` | TypeScript strict config |
| `frontend/index.html` | HTML entry pointing to `src/main.tsx` |

### CSS / Theme
| File | Purpose |
|------|---------|
| `frontend/src/styles/index.css` | Imports fonts → tailwind → theme → globals |
| `frontend/src/styles/fonts.css` | Google Fonts: Inter + Fraunces (italic serif for hero) |
| `frontend/src/styles/tailwind.css` | `@import "tailwindcss"` + `@theme inline` tokens |
| `frontend/src/styles/theme.css` | All CSS custom properties; dark mode via `[data-theme="dark"]` |
| `frontend/src/styles/globals.css` | Box-sizing reset, body font/color/bg, base anchor/button reset |

### CSS Variables (theme.css)
```
--brand-green, --page-bg, --page-bg-white, --text-primary, --text-secondary,
--text-muted, --border, --footer-bg, --footer-text, --card-bg,
--badge-bg, --badge-text, --btn-primary-bg, --btn-primary-text,
--btn-ghost-border, --logo-icon,
--cat-bills, --cat-food, --cat-health, --cat-transport
```

### React source
| File | Purpose |
|------|---------|
| `frontend/src/main.tsx` | React 18 `createRoot` mount |
| `frontend/src/app/App.tsx` | Theme state, `data-theme` on `<html>`, BrowserRouter + routes |
| `frontend/src/app/LandingPage.tsx` | Page assembly: Navbar + main sections + Footer |

### Landing components (`frontend/src/app/components/landing/`)
| Component | Description |
|-----------|-------------|
| `SpendlyLogo.tsx` | Diamond SVG + "Spendly" wordmark; `variant` prop for dark/light/footer |
| `Navbar.tsx` | Sticky header; logo, Sign in ghost btn, Get started primary btn, theme toggle; mobile hamburger |
| `HeroSection.tsx` | Two-column layout: badge + h1 (Fraunces italic green "money goes") + body + CTAs / ExpensePreviewCard |
| `ExpensePreviewCard.tsx` | White card: "MARCH 2026" + ₹12,450 total + 4 CategoryBar rows |
| `CategoryBar.tsx` | Label + progress bar (CSS width%) + amount; color injected as CSS variable string |
| `FeaturesSection.tsx` | `--page-bg` bg; 3-col auto-fit grid of FeatureCard |
| `FeatureCard.tsx` | White card; icon (lucide-react) + title + description |
| `CTASection.tsx` | Centered "Ready to take control?" + "Create free account" primary btn |
| `Footer.tsx` | Dark bg; centered SpendlyLogo(footer) + tagline |

---

## Dark Mode

- `App.tsx` reads `localStorage('theme')` on mount, falls back to `prefers-color-scheme`
- Sets `document.documentElement.setAttribute('data-theme', theme)`
- Navbar has Sun/Moon toggle (lucide-react icons)
- All colors are CSS variables — zero hardcoded hex in components

---

## Verification

```powershell
cd frontend
node_modules\.bin\vite.cmd
# Open http://localhost:5173
```

Checklist:
- [ ] Screenshot visually matches `spendly-landing-page.jpeg` at desktop viewport
- [ ] Dark mode toggle switches all colors correctly (no hardcoded hex visible)
- [ ] Mobile (375px): sections stack, hero card below copy, nav becomes hamburger
- [ ] No horizontal overflow at any viewport
- [ ] All CTA buttons navigate (placeholder pages render)
