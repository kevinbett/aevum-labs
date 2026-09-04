import { useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'support@zaamu.com'

const PROJECTS = [
  {
    id: 'zaamu',
    name: 'Zaamu',
    accent: '#F0A83C',
    accentSoft: 'rgba(240,168,60,0.14)',
    domain: 'zaamu.com',
    url: 'https://zaamu.com',
    category: 'Booking SaaS · East Africa',
    tagline: 'Your shop’s booking page.',
    description:
      'A booking platform for barbershops, salons and spas. Any shop can self-onboard, publish a booking page, and run staff, services and appointments — with receptionist roles, no-show protection and commission tracking built in. Multi-tenant from day one.',
    stack: ['React', 'Vite', 'Supabase', 'Postgres · RLS'],
    status: 'Live',
    metric: { value: 'Multi-tenant', label: 'any shop, self-serve' },
  },
  {
    id: 'pesascope',
    name: 'PesaScope',
    accent: '#34D399',
    accentSoft: 'rgba(52,211,153,0.13)',
    domain: 'pesascope.site',
    url: 'https://pesascope.site',
    category: 'Personal finance · Privacy-first',
    tagline: 'Your M-Pesa statement, decoded.',
    description:
      'Drop in Safaricom’s password-protected M-Pesa statement and get a spending dashboard: who you pay most, where your money goes, regular payments, fees, and a search that reconciles to the cent. Everything runs in your browser — nothing is ever uploaded.',
    stack: ['React', 'Vite', 'pdf.js', '100% client-side'],
    status: 'Live',
    metric: { value: 'Zero upload', label: 'your data never leaves the tab' },
  },
  {
    id: 'sampuli',
    name: 'Sampuli',
    accent: '#8B7FF5',
    accentSoft: 'rgba(139,127,245,0.15)',
    domain: 'sampuli.site',
    url: 'https://sampuli.site',
    category: 'Developer tools · QA',
    tagline: 'Synthetic test data, done right.',
    description:
      'Realistic, format-valid sample data for software testing — 27 country packs from Kenya to the US. Phone prefixes, ID shapes, tax PINs and Luhn-checked test cards follow real formats but belong to no real person. Export to CSV, JSON, SQL and more.',
    stack: ['React', 'Vite', 'Vitest', '27 country packs'],
    status: 'Live',
    metric: { value: '27 packs', label: 'Kenya to the US' },
  },
]

const PRINCIPLES = [
  {
    title: 'Built to last',
    body: 'We optimise for the long run — clean code, few dependencies, and products we can still ship confidently years from now. Longevity is a feature, not an afterthought.',
  },
  {
    title: 'Built for the real world',
    body: 'Every product ships against messy real-world data and unreliable networks. If it doesn’t hold up on a Nairobi 3G connection, it isn’t done.',
  },
  {
    title: 'Privacy by default',
    body: 'PesaScope never uploads your statement. Sampuli invents data that belongs to no one. Your data is yours — that’s a design constraint, not a policy page.',
  },
  {
    title: 'Small team, high craft',
    body: 'No committees, no slideware. Products are designed and built end-to-end by the people who care about the details.',
  },
]

const STATS = [
  { value: '3', label: 'products live' },
  { value: '3', label: 'domains in production' },
  { value: '27', label: 'country data packs' },
  { value: '100%', label: 'built in-house' },
]

/* ------------------------------------------------------------------ *
 * Reveal-on-scroll hook
 * ------------------------------------------------------------------ */

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ------------------------------------------------------------------ *
 * Small components
 * ------------------------------------------------------------------ */

function Logomark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logomark">
      <defs>
        <linearGradient id="lm-molten" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC24B" />
          <stop offset="0.5" stopColor="#FF7A2F" />
          <stop offset="1" stopColor="#D6402E" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="#141416" />
      <rect x="1" y="1" width="62" height="62" rx="14" fill="none" stroke="rgba(255,255,255,0.08)" />
      {/* concentric growth rings — age rings, a mark of longevity; centre slightly
          offset for an organic, tree-ring feel */}
      <circle cx="33.5" cy="33" r="18" fill="none" stroke="url(#lm-molten)" strokeWidth="3" opacity="0.9" />
      <circle cx="32.6" cy="32.4" r="12" fill="none" stroke="url(#lm-molten)" strokeWidth="3" opacity="0.62" />
      <circle cx="31.8" cy="31.8" r="6" fill="none" stroke="url(#lm-molten)" strokeWidth="3" opacity="0.85" />
      <circle cx="31.4" cy="31.6" r="2" fill="#FFC24B" />
    </svg>
  )
}

function Wordmark() {
  return (
    <a href="#top" className="wordmark" aria-label="Aevum Labs — home">
      <Logomark />
      <span className="wordmark__text">
        Aevum<span className="wordmark__labs">Labs</span>
      </span>
    </a>
  )
}

function ContourField() {
  // Decorative ambient strata (time-layer) lines behind the hero.
  const lines = Array.from({ length: 9 })
  return (
    <svg className="contours" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {lines.map((_, i) => {
        const y = 120 + i * 62
        const amp = 26 + i * 6
        return (
          <path
            key={i}
            d={`M-50 ${y} C 220 ${y - amp}, 420 ${y + amp}, 640 ${y - amp * 0.6} S 1040 ${y + amp}, 1260 ${y - amp * 0.4}`}
            fill="none"
            stroke="url(#contour-grad)"
            strokeWidth="1"
            opacity={0.5 - i * 0.03}
          />
        )
      })}
      <defs>
        <linearGradient id="contour-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,122,47,0)" />
          <stop offset="0.5" stopColor="rgba(255,150,80,0.55)" />
          <stop offset="1" stopColor="rgba(214,64,46,0)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Wordmark />
        <nav className="nav__links" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#contact" className="nav__cta">
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="arrow">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProjectCard({ project, index }) {
  const style = {
    '--accent': project.accent,
    '--accent-soft': project.accentSoft,
    transitionDelay: `${index * 90}ms`,
  }
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card"
      style={style}
      data-reveal
    >
      <div className="card__glow" aria-hidden="true" />
      <div className="card__top">
        <span className="card__category">{project.category}</span>
        <span className="card__status">
          <span className="dot" /> {project.status}
        </span>
      </div>

      <h3 className="card__name">{project.name}</h3>
      <p className="card__tagline">{project.tagline}</p>
      <p className="card__desc">{project.description}</p>

      <div className="card__metric">
        <span className="card__metric-value">{project.metric.value}</span>
        <span className="card__metric-label">{project.metric.label}</span>
      </div>

      <ul className="card__stack">
        {project.stack.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <div className="card__foot">
        <span className="card__domain">{project.domain}</span>
        <span className="card__visit">
          Visit <ArrowIcon />
        </span>
      </div>
    </a>
  )
}

/* ------------------------------------------------------------------ *
 * App
 * ------------------------------------------------------------------ */

export default function App() {
  const year = new Date().getFullYear()
  useReveal()

  return (
    <div id="top" className="page">
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <ContourField />
          <div className="hero__glow hero__glow--1" />
          <div className="hero__glow hero__glow--2" />
        </div>

        <div className="hero__inner">
          <p className="hero__eyebrow" data-reveal>
            <span className="ember-dot" /> Independent product studio · Nairobi, Kenya
          </p>
          <h1 className="hero__title" data-reveal>
            We build software{' '}
            <span className="molten">made to last</span>.
          </h1>
          <p className="hero__lede" data-reveal>
            Aevum Labs designs, builds and runs its own software products end-to-end — durable
            tools for real people and real businesses, engineered to endure, not just to launch.
          </p>
          <div className="hero__actions" data-reveal>
            <a href="#work" className="btn btn--primary">
              See the work <ArrowIcon />
            </a>
            <a href="#contact" className="btn btn--ghost">
              Work with us
            </a>
          </div>

          <div className="hero__stats" data-reveal>
            {STATS.map((s) => (
              <div key={s.label} className="stat">
                <span className="stat__value">{s.value}</span>
                <span className="stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="section">
        <div className="section__head" data-reveal>
          <span className="kicker">The work</span>
          <h2 className="section__title">Three products, live today.</h2>
          <p className="section__sub">
            Each solves a problem we cared enough about to build all the way. Every one runs at its
            own domain, on its own infrastructure.
          </p>
        </div>

        <div className="cards">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* STUDIO / ETHOS */}
      <section id="studio" className="section section--studio">
        <div className="studio__grid">
          <div className="studio__intro" data-reveal>
            <span className="kicker">The studio</span>
            <h2 className="section__title">
              A lab, not an agency.
            </h2>
            <p className="studio__body">
              Aevum Labs is an independent studio that builds and owns its products — from the first
              sketch to the servers they run on. We take small, sharp ideas and build them into tools
              people actually keep using.
            </p>
            <p className="studio__body">
              <em>Aevum</em> is Latin for a lifetime, an age. We build to that horizon: durable,
              dependable software, made to last rather than just to launch.
            </p>
          </div>

          <div className="principles">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="principle" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="principle__mark" aria-hidden="true" />
                <h3 className="principle__title">{p.title}</h3>
                <p className="principle__body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section section--contact">
        <div className="contact" data-reveal>
          <div className="contact__glow" aria-hidden="true" />
          <span className="kicker">Get in touch</span>
          <h2 className="contact__title">
            Building something — or want to back what we’re building?
          </h2>
          <p className="contact__sub">
            Whether you’re a founder, a partner, or an investor sizing up what’s next from the
            lab, the door is open.
          </p>
          <div className="contact__actions">
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--primary btn--lg">
              Say hello <ArrowIcon />
            </a>
            <a href="#work" className="btn btn--ghost btn--lg">
              Explore the products
            </a>
          </div>
          <p className="contact__email">{CONTACT_EMAIL}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <Logomark size={28} />
            <span>Aevum Labs</span>
          </div>
          <nav className="footer__links" aria-label="Products">
            {PROJECTS.map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                {p.name}
              </a>
            ))}
          </nav>
          <p className="footer__note">
            Software made to last · Nairobi, Kenya · © {year}
          </p>
        </div>
      </footer>
    </div>
  )
}
