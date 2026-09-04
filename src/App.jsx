import { useEffect, useState } from 'react'

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'support@zaamu.com'

const PRODUCTS = [
  {
    id: 'zaamu',
    name: 'Zaamu',
    domain: 'zaamu.com',
    url: 'https://zaamu.com',
    tone: 'light',
    c1: '#F5A524',
    c2: '#FF6A3D',
    glow: 'rgba(255, 122, 61, 0.28)',
    eyebrow: 'Booking for barbershops, salons & spas',
    headline: ['Your shop’s booking page.', 'Your link, your customers.'],
    sub: 'Any shop sets up in ten minutes on the phone it already has, shares one link on WhatsApp, and the book fills itself. Customers see your shop — nobody else’s.',
    shots: { desktop: '/shots/zaamu-desktop.jpg', mobile: '/shots/zaamu-mobile.jpg' },
    tiles: [
      { big: '10 min', title: 'Set up on the phone you have', body: 'No laptop, no onboarding call. Add services, staff and hours, and your booking page is live.' },
      { big: 'One link', title: 'Your link is the only door', body: 'zaamu.com/book/your-shop — share it on WhatsApp. No app for customers to install, ever.' },
      { big: 'One book', title: 'Walk-ins and online together', body: 'Receptionist roles, staff schedules, reschedules and no-show protection in a single calendar.' },
      { big: 'Self-serve', title: 'Multi-tenant from day one', body: 'Every shop onboards itself — priced in KES, built for how Kenyan shops actually run.' },
    ],
  },
  {
    id: 'pesascope',
    name: 'PesaScope',
    domain: 'pesascope.site',
    url: 'https://pesascope.site',
    tone: 'dark',
    c1: '#34D399',
    c2: '#0EA5A5',
    glow: 'rgba(52, 211, 153, 0.26)',
    eyebrow: 'Personal finance · privacy-first',
    headline: ['Your M‑Pesa statement,', 'decoded.'],
    sub: 'Drop in Safaricom’s password-protected statement and see who you pay most, where the money goes, what the fees really cost — every figure reconciled to the cent.',
    shots: { desktop: '/shots/pesascope-desktop.jpg', mobile: '/shots/pesascope-mobile.jpg' },
    tiles: [
      { big: '0 uploads', title: 'Nothing leaves your browser', body: 'The PDF is unlocked and parsed on your device with pdf.js. Close the tab and it’s gone.' },
      { big: 'To the cent', title: 'Reconciled against the statement', body: 'Totals match the statement’s own SUMMARY page. If a shilling is off, the parser says so.' },
      { big: 'Ranked', title: 'People, merchants, PayBills', body: 'Who you send to, who sends to you, and the fee attached to every transaction.' },
      { big: 'Search', title: 'A name, a till, a receipt', body: 'Type anything and get that counterparty’s full history — then export what you’re looking at as CSV.' },
    ],
  },
  {
    id: 'sampuli',
    name: 'Sampuli',
    domain: 'sampuli.site',
    url: 'https://sampuli.site',
    tone: 'light',
    c1: '#6366F1',
    c2: '#D946EF',
    glow: 'rgba(99, 102, 241, 0.26)',
    eyebrow: 'Test data for software teams',
    headline: ['Synthetic data that', 'passes every check.'],
    sub: 'Realistic, format-valid sample data for QA — phone prefixes, national IDs, KRA PINs and Luhn-checked test cards that follow real formats and belong to no real person.',
    shots: { desktop: '/shots/sampuli-desktop.jpg', mobile: '/shots/sampuli-mobile.jpg' },
    tiles: [
      { big: '27', title: 'Country packs, Kenya first', body: 'Africa’s fifteen largest economies plus Rwanda, and eleven major-currency markets from the US to Japan.' },
      { big: 'Valid', title: 'Real formats, no real people', body: 'Every value is generated in the browser and format-checked. No personal data is used or stored.' },
      { big: '1 click', title: 'One value, one click', body: 'A quick strip for the field you need right now — phone, ID, SWIFT/BIC, PayBill — re-rolled on tap.' },
      { big: 'CSV · SQL', title: 'Export anywhere', body: 'CSV, JSON, NDJSON and SQL, plus linked datasets with customer → transaction foreign keys.' },
    ],
  },
]

const PRINCIPLES = [
  { title: 'Built to last', body: 'Clean code, few dependencies, and products we can still ship confidently years from now. Longevity is a feature, not an afterthought.' },
  { title: 'Built for the real world', body: 'Messy statements, flaky networks, phones that aren’t new. If it doesn’t hold up on a Nairobi 3G connection, it isn’t done.' },
  { title: 'Privacy by default', body: 'PesaScope never uploads your statement. Sampuli invents data that belongs to no one. That’s a design constraint, not a policy page.' },
  { title: 'Small team, high craft', body: 'No committees, no slideware. Each product is designed and built end-to-end by the people who care about the details.' },
]

/* ------------------------------------------------------------------ *
 * Reveal-on-scroll
 * ------------------------------------------------------------------ */

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!('IntersectionObserver' in window) || reduce) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ------------------------------------------------------------------ *
 * Pieces
 * ------------------------------------------------------------------ */

function Logomark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logomark">
      <defs>
        <linearGradient id="lm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5A524" />
          <stop offset="0.5" stopColor="#FF6A3D" />
          <stop offset="1" stopColor="#D946EF" />
        </linearGradient>
      </defs>
      <circle cx="33.5" cy="33" r="18" fill="none" stroke="url(#lm-grad)" strokeWidth="3.2" opacity="0.95" />
      <circle cx="32.6" cy="32.4" r="12" fill="none" stroke="url(#lm-grad)" strokeWidth="3.2" opacity="0.6" />
      <circle cx="31.8" cy="31.8" r="6" fill="none" stroke="url(#lm-grad)" strokeWidth="3.2" opacity="0.9" />
      <circle cx="31.4" cy="31.6" r="2.2" fill="#F5A524" />
    </svg>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="wordmark" aria-label="Aevum Labs — home">
          <Logomark />
          <span>Aevum<span className="wordmark__labs">Labs</span></span>
        </a>
        <nav className="nav__links" aria-label="Products">
          {PRODUCTS.map((p) => (
            <a key={p.id} href={`#${p.id}`}>{p.name}</a>
          ))}
          <a href="#lab">The lab</a>
        </nav>
        <a href="#contact" className="nav__cta">Get in touch</a>
      </div>
    </header>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className="arrow">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Laptop({ src, alt }) {
  return (
    <div className="laptop">
      <div className="laptop__screen">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      <div className="laptop__base"><span /></div>
    </div>
  )
}

function Phone({ src, alt }) {
  return (
    <div className="phone">
      <div className="phone__island" aria-hidden="true" />
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  )
}

function Chapter({ p, index }) {
  const style = { '--c1': p.c1, '--c2': p.c2, '--glow': p.glow }
  return (
    <section id={p.id} className={`chapter chapter--${p.tone}`} style={style}>
      <div className="chapter__glow" aria-hidden="true" />
      <div className="chapter__inner">
        <header className="chapter__head" data-reveal>
          <p className="chapter__eyebrow">
            <span className="chapter__dot" aria-hidden="true" />
            {p.name} <span className="chapter__sep">·</span> {p.eyebrow}
          </p>
          <h2 className="chapter__title">
            <span className="grad">{p.headline[0]}</span>
            <br />
            {p.headline[1]}
          </h2>
          <p className="chapter__sub">{p.sub}</p>
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="chapter__link">
            Visit {p.domain} <Arrow />
          </a>
        </header>

        <div className="stage" data-reveal>
          <Laptop src={p.shots.desktop} alt={`${p.name} on a laptop`} />
          <Phone src={p.shots.mobile} alt={`${p.name} on a phone`} />
        </div>

        <div className="bento">
          {p.tiles.map((t, i) => (
            <article key={t.title} className="tile" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <p className="tile__big">{t.big}</p>
              <h3 className="tile__title">{t.title}</h3>
              <p className="tile__body">{t.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * App
 * ------------------------------------------------------------------ */

export default function App() {
  useReveal()
  const year = new Date().getFullYear()

  return (
    <div id="top" className="page">
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="aurora" aria-hidden="true">
          <span className="aurora__a" />
          <span className="aurora__b" />
          <span className="aurora__c" />
        </div>
        <div className="hero__inner">
          <p className="hero__eyebrow hero-anim" style={{ animationDelay: '0ms' }}>
            Aevum Labs · Independent product studio
          </p>
          <h1 className="hero__title">
            <span className="hero-anim" style={{ animationDelay: '80ms' }}>Software</span>{' '}
            <span className="hero-anim grad-hero" style={{ animationDelay: '180ms' }}>made to last.</span>
          </h1>
          <p className="hero__sub hero-anim" style={{ animationDelay: '300ms' }}>
            Three products. Live today. Engineered to endure.
          </p>
          <div className="hero__chips hero-anim" style={{ animationDelay: '420ms' }}>
            {PRODUCTS.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="chip" style={{ '--c1': p.c1, '--c2': p.c2 }}>
                <span className="chip__dot" aria-hidden="true" />
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT CHAPTERS */}
      {PRODUCTS.map((p, i) => (
        <Chapter key={p.id} p={p} index={i} />
      ))}

      {/* THE LAB */}
      <section id="lab" className="lab">
        <div className="lab__inner">
          <header className="lab__head" data-reveal>
            <p className="lab__eyebrow">The lab</p>
            <h2 className="lab__title">A lab, not an agency.</h2>
            <p className="lab__sub">
              Aevum Labs builds and owns its products — from the first sketch to the servers they run on.
              <em> Aevum</em> is Latin for a lifetime, an age. We build to that horizon.
            </p>
          </header>
          <div className="principles">
            {PRINCIPLES.map((pr, i) => (
              <article key={pr.title} className="principle" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <h3>{pr.title}</h3>
                <p>{pr.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="contact__inner" data-reveal>
          <h2 className="contact__title">
            <span className="grad-hero">Let’s build</span> what lasts.
          </h2>
          <p className="contact__sub">
            Founders, partners, and investors sizing up what’s next from the lab — the door is open.
          </p>
          <div className="contact__actions">
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--dark">Say hello <Arrow /></a>
            <a href="#zaamu" className="btn btn--ghost">Explore the products</a>
          </div>
          <p className="contact__email">{CONTACT_EMAIL}</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__brand"><Logomark size={20} /> Aevum Labs</span>
          <nav className="footer__links" aria-label="Product links">
            {PRODUCTS.map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
            ))}
          </nav>
          <span className="footer__note">Software made to last · Nairobi, Kenya · © {year}</span>
        </div>
      </footer>
    </div>
  )
}
