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
    deep: '#C2410C', // solid accent for light grounds — passes contrast where the gradient couldn't
    glow: 'rgba(255, 122, 61, 0.28)',
    screenBg: '#faf7f1',
    eyebrow: 'Booking for barbershops, salons & spas',
    headline: ['Your shop’s booking page.', 'Your link, your customers.'],
    sub: 'Set up in ten minutes, share one link on WhatsApp, and the book fills itself.',
    shots: { desktop: '/shots/zaamu-desktop', mobile: '/shots/zaamu-mobile.webp' },
  },
  {
    id: 'pesascope',
    name: 'PesaScope',
    domain: 'pesascope.site',
    url: 'https://pesascope.site',
    tone: 'dark',
    c1: '#34D399',
    c2: '#0EA5A5',
    deep: '#0E9F6E',
    glow: 'rgba(52, 211, 153, 0.26)',
    screenBg: '#f7f9f8',
    eyebrow: 'Personal finance · privacy-first',
    headline: ['Your M‑Pesa statement,', 'decoded.'],
    sub: 'Safaricom’s locked PDF becomes a spending dashboard — reconciled to the cent, entirely on your device.',
    shots: { desktop: '/shots/pesascope-desktop', mobile: '/shots/pesascope-mobile.webp' },
  },
  {
    id: 'sampuli',
    name: 'Sampuli',
    domain: 'sampuli.site',
    url: 'https://sampuli.site',
    tone: 'light',
    c1: '#6366F1',
    c2: '#D946EF',
    deep: '#4F46E5',
    glow: 'rgba(99, 102, 241, 0.26)',
    screenBg: '#f3f5f3',
    eyebrow: 'Test data for software teams',
    headline: ['Synthetic data that', 'passes every check.'],
    sub: 'Format-valid test data for QA — from KRA PINs to Luhn-checked cards — that belongs to no real person.',
    shots: { desktop: '/shots/sampuli-desktop', mobile: '/shots/sampuli-mobile.webp' },
  },
  {
    id: 'mezani',
    name: 'Mezani',
    domain: 'mezani.health',
    url: 'https://mezani.health',
    tone: 'dark',
    c1: '#FB7185',
    c2: '#E11D48',
    deep: '#BE123C',
    glow: 'rgba(244, 63, 94, 0.22)',
    screenBg: '#fbf7f0',
    eyebrow: 'Meal planning for households',
    headline: ['A calm week of meals,', 'planned around your pantry.'],
    sub: 'Pick the week’s meals, get one shopping list, and keep a pantry the whole household can trust.',
    shots: { desktop: '/shots/mezani-desktop', mobile: '/shots/mezani-mobile.webp' },
  },
]

const PRINCIPLES = [
  { title: 'Built to last', body: 'Clean code, few dependencies, and products we can still ship confidently years from now. Longevity is a feature, not an afterthought.' },
  { title: 'Built for the real world', body: 'Messy statements, flaky networks, phones that aren’t new. If it doesn’t hold up on a Nairobi 3G connection, it isn’t done.' },
  { title: 'Privacy by default', body: 'PesaScope never uploads your statement. Sampuli invents data that belongs to no one. That’s a design constraint, not a policy page.' },
  { title: 'Small team, high craft', body: 'No committees, no slideware. Each product is designed and built end-to-end by the people who care about the details.' },
]

/* ------------------------------------------------------------------ *
 * Hooks
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
 * Shared pieces
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
  const [active, setActive] = useState('')
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    // Scrollspy: light up the section currently in the middle of the viewport
    const ids = [...PRODUCTS.map((p) => p.id), 'lab']
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!('IntersectionObserver' in window) || !sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
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
            <a key={p.id} href={`#${p.id}`} className={active === p.id ? 'is-active' : ''} aria-current={active === p.id ? 'true' : undefined}>
              {p.name}
            </a>
          ))}
          <a href="#lab" className={active === 'lab' ? 'is-active' : ''} aria-current={active === 'lab' ? 'true' : undefined}>The lab</a>
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
  // `src` is a basename; 1440w serves 1x screens, 2880w serves retina
  return (
    <div className="laptop">
      <div className="laptop__screen">
        <img
          src={`${src}-1440.webp`}
          srcSet={`${src}-1440.webp 1440w, ${src}-2880.webp 2880w`}
          sizes="(max-width: 720px) 90vw, 862px"
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="laptop__base"><span /></div>
    </div>
  )
}

function Phone({ src, alt, children, className = '' }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__island" aria-hidden="true" />
      {src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Product stories — one shape per product, scrubbed by scroll
 * ------------------------------------------------------------------ */

/* The journey as a film strip of REAL screens: every step visible at once
   on desktop; a native scroll-snap carousel on mobile. The page itself
   always scrolls normally — nothing pins, nothing can feel stuck. */
function Journey({ captions, images, alt }) {
  return (
    <div className="journey" role="list">
      {captions.map((c, i) => (
        <figure className="journey__step" role="listitem" key={c.title} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
          <Phone className="phone--journey">
            <img src={images[i]} alt={`${alt} — step ${i + 1}`} loading="lazy" decoding="async" />
          </Phone>
          <figcaption className="journey__caption">
            <p className="journey__num">{i + 1}</p>
            <h3>{c.title}</h3>
            <p className="journey__body">{c.body}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const ZAAMU_CAPTIONS = [
  { title: 'Choose a service.', body: 'Barber, massage or salon — real prices, real durations, the shop’s own menu.' },
  { title: 'Pick your person.', body: 'Real barbers with real bios — or “Any available” finds the soonest open chair.' },
  { title: 'Your details, then done.', body: 'Name and phone. No app, no account — confirmed in seconds.' },
]
const ZAAMU_SHOTS = ['/shots/zaamu-book-1.webp', '/shots/zaamu-book-2.webp', '/shots/zaamu-book-3.webp']

const MEZANI_SHOTS = ['/shots/mezani-app-1.webp', '/shots/mezani-app-2.webp', '/shots/mezani-app-3.webp']

const PESA_CAPTIONS = [
  { title: 'Drop in the locked PDF.', body: 'Safaricom’s password-protected statement, decrypted and read on your device only. Nothing uploads.' },
  { title: 'The statement becomes a picture.', body: 'Money in, money out, Fuliza and fees — every figure reconciled against the statement’s own summary.' },
  { title: 'Every shilling, findable.', body: 'Money flow over time, categories from Send money to Betting, and a list you can filter and export as CSV.' },
]
const PESA_SHOTS = ['/shots/pesascope-app-1.webp', '/shots/pesascope-app-2.webp', '/shots/pesascope-app-3.webp']

const SAMPULI_CAPTIONS = [
  { title: 'One value, one click.', body: 'Phone, ID, KRA PIN, SWIFT — always format-valid, re-rolled on tap.' },
  { title: 'A hundred records in a breath.', body: 'Tap a suggested field set and the batch appears instantly — export CSV, JSON, NDJSON or SQL.' },
  { title: 'Linked tables, real keys.', body: 'A customers parent and a transactions child joined by genuine foreign keys — reproducible with a seed.' },
]
const SAMPULI_SHOTS = ['/shots/sampuli-app-1.webp', '/shots/sampuli-app-2.webp', '/shots/sampuli-app-3.webp']

const MEZANI_CAPTIONS = [
  { title: 'The week, planned.', body: 'Twenty-one meals on one calm board — breakfast to dinner, adults and children.' },
  { title: 'One list for the whole week.', body: 'Every ingredient rolls up into a single shopping list, quantities merged across meals.' },
  { title: 'A pantry you can trust.', body: 'What’s already home stays counted — the list only asks for what’s missing.' },
]

/* ------------------------------------------------------------------ *
 * Tiles — a real thing in every tile: a measurement or working UI
 * ------------------------------------------------------------------ */

function ZaamuTiles() {
  return (
    <div className="bento">
      <article className="tile" data-reveal>
        <div className="demo">
          <div className="demo__booking">
            <div>
              <p className="demo__svc">Haircut &amp; Beard Trim</p>
              <p className="demo__meta">with James · 45 min</p>
            </div>
            <div className="demo__right">
              <p className="demo__kes">KES 800</p>
              <span className="demo__pill">● Confirmed</span>
            </div>
          </div>
        </div>
        <h3 className="tile__title">Walk-ins and online in one book</h3>
        <p className="tile__body">Receptionist roles, staff schedules, reschedules and no-show protection in a single calendar.</p>
      </article>
      <article className="tile" data-reveal>
        <div className="demo">
          <div className="demo__wa">
            <p>Karibu! Book your next visit here 👉 <b>zaamu.com/book/yankee-clippers</b></p>
          </div>
        </div>
        <h3 className="tile__title">Your link is the only door</h3>
        <p className="tile__body">Share it on WhatsApp or your status. No app for customers to install, ever.</p>
      </article>
      <article className="tile" data-reveal>
        <p className="tile__big">10 min</p>
        <h3 className="tile__title">Set up on the phone you have</h3>
        <p className="tile__body">No laptop, no onboarding call. Add services, staff and hours, and your page is live.</p>
      </article>
      <article className="tile" data-reveal>
        <p className="tile__big">Free</p>
        <h3 className="tile__title">While we grow</h3>
        <p className="tile__body">Self-serve and multi-tenant from day one, priced for how Kenyan shops actually run.</p>
      </article>
    </div>
  )
}

function PesaTiles() {
  return (
    <div className="bento">
      <article className="tile" data-reveal>
        <p className="tile__big">0 bytes</p>
        <h3 className="tile__title">Uploaded, ever</h3>
        <p className="tile__body">The PDF is unlocked and parsed on your device with pdf.js. Close the tab and it’s gone.</p>
      </article>
      <article className="tile" data-reveal>
        <div className="demo">
          <div className="demo__recon">
            <div><span>PAID IN</span><b>KES 245,180.00</b></div>
            <div><span>PAID OUT</span><b>KES 244,982.15</b></div>
            <p className="demo__ok">✓ Matches the statement’s own summary</p>
          </div>
        </div>
        <h3 className="tile__title">Reconciled to the cent</h3>
        <p className="tile__body">If a shilling doesn’t add up, the parser says so instead of guessing.</p>
      </article>
      <article className="tile" data-reveal>
        <p className="tile__big">100 pages</p>
        <h3 className="tile__title">Parsed in seconds</h3>
        <p className="tile__body">A full 3,784-row statement becomes people, merchants, fees and habits before you’ve scrolled.</p>
      </article>
      <article className="tile" data-reveal>
        <div className="demo">
          <div className="demo__search">
            <p className="demo__q">🔎 0712 345 678</p>
            <p className="demo__r">Sent 14 times · KES 36,400 · fees KES 218</p>
          </div>
        </div>
        <h3 className="tile__title">Search a name, a till, a receipt</h3>
        <p className="tile__body">Any counterparty’s full history — then export what you’re looking at as CSV.</p>
      </article>
    </div>
  )
}

function SampuliTiles() {
  return (
    <div className="bento">
      <article className="tile" data-reveal>
        <p className="tile__big">27</p>
        <h3 className="tile__title">Country packs, Kenya first</h3>
        <p className="tile__body">Africa’s fifteen largest economies plus Rwanda, and eleven major-currency markets.</p>
      </article>
      <article className="tile" data-reveal>
        <div className="demo">
          <div className="demo__card">
            <p className="demo__pan">4048 8912 3456 7893</p>
            <p className="demo__ok">✓ Passes the Luhn check · belongs to no one</p>
          </div>
        </div>
        <h3 className="tile__title">Real formats, no real people</h3>
        <p className="tile__body">Every value is generated in the browser and format-checked. Nothing is collected or stored.</p>
      </article>
      <article className="tile" data-reveal>
        <p className="tile__big">4 formats</p>
        <h3 className="tile__title">CSV · JSON · NDJSON · SQL</h3>
        <p className="tile__body">Plus linked datasets — customers and transactions with real foreign keys.</p>
      </article>
      <article className="tile" data-reveal>
        <p className="tile__big">220 tests</p>
        <h3 className="tile__title">On every release</h3>
        <p className="tile__body">Checksums, pack contracts and export shapes run green in CI before anything ships.</p>
      </article>
    </div>
  )
}

function MezaniTiles() {
  return (
    <div className="bento">
      <article className="tile" data-reveal>
        <div className="demo">
          <div className="demo__recon">
            <div><span>RICE</span><b>1.5 kg left</b></div>
            <div><span>EGGS</span><b>4 left</b></div>
            <p className="demo__ok">Low — added to Saturday’s trip</p>
          </div>
        </div>
        <h3 className="tile__title">The pantry writes the shopping list</h3>
        <p className="tile__body">Track what’s home; when staples run low they land on the next trip on their own.</p>
      </article>
      <article className="tile" data-reveal>
        <div className="demo">
          <div className="demo__invite">
            <p>✉️ You’re invited to join <b>the Amani household</b> on Mezani</p>
            <span className="demo__accept">Accept</span>
          </div>
        </div>
        <h3 className="tile__title">One home, every person</h3>
        <p className="tile__body">Profiles for everyone at home, sharing one plan and one pantry — joined by invite.</p>
      </article>
      <article className="tile" data-reveal>
        <p className="tile__big">Sundays</p>
        <h3 className="tile__title">The week plans itself</h3>
        <p className="tile__body">A calm email each Sunday lays out the week ahead so the plan is done before Monday.</p>
      </article>
      <article className="tile" data-reveal>
        <p className="tile__big">Free</p>
        <h3 className="tile__title">For every household</h3>
        <p className="tile__body">Feeding a home shouldn’t need a subscription. Mezani is free, for every household.</p>
      </article>
    </div>
  )
}

const TILES = { zaamu: ZaamuTiles, pesascope: PesaTiles, sampuli: SampuliTiles, mezani: MezaniTiles }
const STORIES = {
  zaamu: () => <Journey captions={ZAAMU_CAPTIONS} images={ZAAMU_SHOTS} alt="The real Zaamu booking flow" />,
  pesascope: () => <Journey captions={PESA_CAPTIONS} images={PESA_SHOTS} alt="The real PesaScope dashboard (sample statement)" />,
  sampuli: () => <Journey captions={SAMPULI_CAPTIONS} images={SAMPULI_SHOTS} alt="The real Sampuli generator" />,
  mezani: () => <Journey captions={MEZANI_CAPTIONS} images={MEZANI_SHOTS} alt="The real Mezani app" />,
}

/* ------------------------------------------------------------------ *
 * Chapter
 * ------------------------------------------------------------------ */

function Chapter({ p }) {
  const Tiles = TILES[p.id]
  const Story = STORIES[p.id]
  const style = { '--c1': p.c1, '--c2': p.c2, '--deep': p.deep, '--glow': p.glow, '--screen-bg': p.screenBg }
  return (
    <section id={p.id} className={`chapter chapter--${p.tone}`} style={style}>
      <div className="chapter__glow" aria-hidden="true" />
      <div className="chapter__inner">
        <header className="chapter__head" data-reveal>
          <p className="chapter__pill">
            <span className="chapter__dot" aria-hidden="true" />
            {p.name}
            <span className="chapter__cat">{p.eyebrow}</span>
          </p>
          <h2 className="chapter__title">
            <span className="chapter__accent">{p.headline[0]}</span>
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
          <div className="stage__floor" aria-hidden="true" />
        </div>
      </div>

      <Story />

      <div className="chapter__inner">
        <Tiles />
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
            Four products. Live today. Engineered to endure.
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

      {PRODUCTS.map((p) => (
        <Chapter key={p.id} p={p} />
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

      {/* CONTACT — dark, to bookend the hero */}
      <section id="contact" className="contact">
        <div className="contact__glow" aria-hidden="true" />
        <div className="contact__inner" data-reveal>
          <h2 className="contact__title">
            Let’s build <span className="grad-hero">what lasts.</span>
          </h2>
          <p className="contact__sub">
            Founders, partners, and investors sizing up what’s next from the lab — the door is open.
          </p>
          <div className="contact__actions">
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--light">Say hello <Arrow /></a>
            <a href="#zaamu" className="btn btn--outline">Explore the products</a>
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
          <span className="footer__note">
            No cookies, no trackers — this page collects nothing. · Software made to last · Nairobi, Kenya · © {year}
          </span>
        </div>
      </footer>
    </div>
  )
}
