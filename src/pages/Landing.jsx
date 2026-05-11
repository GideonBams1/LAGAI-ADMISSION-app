import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, MapPin, Phone, Mail, ExternalLink, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// ── Count-up animation ────────────────────────────────────────────────────────
function CountUp({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [started, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ── Data ──────────────────────────────────────────────────────────────────────
const NATIONS = [
  {
    num: '01', country: 'Cape Verde', flag: '🇨🇻',
    img: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=600&q=80',
    desc: 'The mid-Atlantic anchor of the Lusophone world, bridging African roots and European ties through Morabeza.',
  },
  {
    num: '02', country: 'Portugal', flag: '🇵🇹',
    img: 'https://i0.wp.com/handluggageonly.co.uk/wp-content/uploads/2023/10/Coimbra-Portugal-1.jpg?resize=800%2C600&ssl=1',
    desc: 'Deep historical ties to Africa through language and culture, anchoring our Lusophone bridge in Lisbon.',
  },
  {
    num: '03', country: 'Germany', flag: '🇩🇪',
    img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80',
    desc: 'European powerhouse of engineering, precision, and dual vocational training excellence.',
  },
  {
    num: '04', country: 'United States', flag: '🇺🇸',
    img: 'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=600&q=80',
    desc: 'A global hub for finance, education, and professional development with deep African connections.',
  },
]

const PROGRAMMES = [
  { name: 'Double Honour Graduate Program',        level: 'Postgraduate',  duration: '2 Years',   fee: '€8,500' },
  { name: 'Dual Undergraduate Programs',           level: 'Undergraduate', duration: '3 Years',   fee: '€6,500' },
  { name: 'Dual Graduate Programs',                level: 'Postgraduate',  duration: '18 Months', fee: '€7,800' },
  { name: 'Dual Graduate Programs (Hybrid)',        level: 'Postgraduate',  duration: '18 Months', fee: '€6,900' },
  { name: 'Dual Postgraduate Diploma & Certificate',level: 'Postgraduate',  duration: '12 Months', fee: '€4,500' },
  { name: 'Youth Vocational Training Program',     level: 'Certificate',   duration: '6 Months',  fee: '€1,200' },
  { name: 'Certificate & Award Programs',          level: 'Certificate',   duration: '3 Months',  fee: '€950'   },
  { name: 'Train the Trainers Program',            level: 'Certificate',   duration: '4 Months',  fee: '€2,200' },
  { name: 'Languages & Ethics Programs',           level: 'Certificate',   duration: '6 Months',  fee: '€1,500' },
]

const ACCREDITATIONS = [
  { name: 'QAHE',        logo: 'https://laga-institute.org/wp-content/uploads/2026/02/Adobe-Express-file-9.webp',                         href: 'https://www.qahe.org/qahe-accreditation-announcement-lagai-institute/' },
  { name: 'Europass',    logo: 'https://laga-institute.org/wp-content/uploads/2026/02/WhatsApp-Image-2025-08-07-at-23.45.11_5e9fd1e0.webp', href: 'https://europa.eu/europass/' },
  { name: 'EVBB',        logo: 'https://laga-institute.org/wp-content/uploads/2026/04/EVBB.png',                                           href: 'https://evbb.eu/' },
  { name: 'EVTA',        logo: 'https://laga-institute.org/wp-content/uploads/2026/02/logo_EVTA_19.webp',                                  href: 'https://www.evta.eu/' },
  { name: 'ALL Digital', logo: 'https://laga-institute.org/wp-content/uploads/2026/02/Screenshot-2025-03-09-at-20.45.30-1.webp',           href: 'https://all-digital.org/' },
  { name: 'EFVET',       logo: 'https://laga-institute.org/wp-content/uploads/2026/02/WhatsApp-Image-2025-06-17-at-02.26.15_523fc9e7.webp', href: 'https://efvet.org/' },
  { name: 'ICDA',        logo: 'https://laga-institute.org/wp-content/uploads/2026/02/WhatsApp-Image-2025-06-01-at-02.25.00_f0d714d8.webp', href: 'https://www.internationalcommunitydevelopmentagency.org/' },
]

const SOCIALS = [
  { label: 'FB', href: 'https://www.facebook.com/people/Luso-Anglo-German-African-Institute/61579083904300/' },
  { label: 'X',  href: 'https://x.com/LagaInstitute' },
  { label: 'IG', href: 'https://www.instagram.com/laga_institute/' },
  { label: 'LI', href: 'https://www.linkedin.com/company/instituto-luso-anglo-alem%C3%A3o-africano-de-forma%C3%A7%C3%A3o-profissional-e-pesquisa-cultural' },
  { label: 'YT', href: 'https://www.youtube.com/@Luso-AngloGermanAfricanInstitu' },
  { label: 'WA', href: 'https://api.whatsapp.com/send/?phone=4917642954209&text=Hello%2C+I+am+interested+in+learning+more+about+LAGA-Institute.' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user) { navigate('/dashboard'); return null }

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ NAVBAR ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="https://laga-institute.org/wp-content/uploads/2026/03/cropped-Black_White_Modern_Monogram_CR_Logo_Design-removebg-preview-133x50.png"
              alt="LAGAI Institute" className="h-9 object-contain"
            />
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="https://laga-institute.org/academics/" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">Programmes</a>
            <a href="https://laga-institute.org/about-us/"  target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">About LAGAI</a>
            <a href="https://laga-institute.org/contact/"   target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:border-gray-500 transition-colors">
              Sign In
            </Link>
            <Link to="/register"
              className="text-sm font-bold text-white bg-zinc-900 px-5 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
              Apply Now — 2026
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center bg-zinc-950 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.prometheanworld.com/wp-content/uploads/2023/05/05224554/GettyImages-1339977039-1-1.jpg"
            alt="" className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-zinc-900/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/40 text-amber-400 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-10">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              2026 Admissions Now Open
            </div>

            {/* Heading */}
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight mb-8">
              Shape Your<br />
              Future with<br />
              <span style={{ color: '#C9A84C' }}>LAGAI</span>
            </h1>

            <p className="text-xl text-zinc-300 max-w-xl mb-3 leading-relaxed">
              A <strong className="text-white">German–Luso–African</strong> hub for vocational excellence
              and cultural research, connecting four nations through transformative education.
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-12">
              Luso Anglo German African Institute of Vocational Education &amp; Cultural Research
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register?role=student"
                className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-xl text-base transition-colors text-zinc-950"
                style={{ backgroundColor: '#C9A84C' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b8973f'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A84C'}>
                Find Your Programme <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register?role=recruiter"
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-base">
                Become a Recruiter <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 text-xs">
          <span>Scroll</span>
          <div className="w-px h-10 bg-zinc-700" />
        </div>
      </section>

      {/* ═══ STATS ════════════════════════════════════════════════════════════ */}
      <section className="bg-zinc-900 py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { target: 11, suffix: '',  label: 'Expertise Areas'      },
            { target: 9,  suffix: '',  label: 'Global Programmes'     },
            { target: 4,  suffix: '',  label: 'Partner Nations'       },
            { target: 7,  suffix: '+', label: 'Institutional Partners'},
          ].map(s => (
            <div key={s.label}>
              <p className="text-5xl font-black" style={{ color: '#C9A84C' }}>
                <CountUp target={s.target} suffix={s.suffix} />
              </p>
              <p className="text-zinc-400 text-xs mt-2 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT — ONE INSTITUTE, DUAL SYSTEMS ════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              Established Excellence
            </p>
            <h2 className="text-5xl font-black text-zinc-900 leading-tight mb-6">
              One Institute —<br />
              <em className="font-black italic text-zinc-400">Dual Systems</em>
            </h2>
            <p className="text-zinc-600 text-lg leading-relaxed mb-5">
              The <strong>Luso Anglo German African Institute (LAGAI)</strong> is a multi-disciplinary hub of
              innovation, drawing on rich educational traditions from four nations to create a unique and
              powerful learning ecosystem.
            </p>
            <p className="text-zinc-500 leading-relaxed mb-8">
              We blend European technical standards with African ingenuity, preparing students for a
              globalised workforce while deeply respecting local cultural legacies and identities.
            </p>
            <blockquote className="border-l-4 pl-5 italic text-zinc-500 text-sm leading-relaxed" style={{ borderColor: '#C9A84C' }}>
              "Part of the UNESCO Associated Schools Network vision 2030 — building bridges between
              civilisations through transformative vocational education."
            </blockquote>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80"
                alt="LAGAI education" className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl p-5 shadow-xl text-zinc-950" style={{ backgroundColor: '#C9A84C' }}>
              <p className="text-3xl font-black">9</p>
              <p className="text-sm font-bold">Programmes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GLOBAL REACH ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Our Global Footprint</p>
          <h2 className="text-4xl md:text-5xl font-black mb-14">Our Global Reach</h2>
          <div className="grid md:grid-cols-4 gap-5">
            {NATIONS.map(n => (
              <div key={n.country} className="group rounded-2xl overflow-hidden bg-zinc-900 hover:bg-zinc-800 transition-colors">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={n.img} alt={n.country}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold mb-1" style={{ color: '#C9A84C' }}>{n.num}</p>
                  <h3 className="font-bold text-lg mb-2">{n.flag} {n.country}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THREE PORTALS ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>Admissions Platform</p>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">Three Portals, One Platform</h2>
            <p className="text-zinc-500 max-w-md mx-auto">Role-specific dashboards for students, education recruiters, and LAGAI administrators.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01', bg: 'bg-blue-600', title: 'Student Portal', cta: 'Register as Student', link: '/register?role=student',
                items: ['Browse all LAGAI programmes', 'Submit your application online', 'Upload required documents', 'Track your admission status in real-time'],
              },
              {
                num: '02', bg: '', title: 'Recruiter Portal', cta: 'Become a Recruiter', link: '/register?role=recruiter', gold: true,
                items: ['Submit applications on behalf of students', 'Track your full student pipeline', 'View your commissions & earnings', 'Access the full programme catalogue'],
              },
              {
                num: '03', bg: 'bg-zinc-900', title: 'Admin Panel', cta: 'Admin Login', link: '/login',
                items: ['Review & process all applications', 'Manage the programme catalogue', 'Approve or suspend recruiters', 'Process commissions & payouts'],
              },
            ].map(p => (
              <div key={p.title} className="group border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-0.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${p.bg}`}
                  style={p.gold ? { backgroundColor: '#C9A84C' } : {}}>
                  <span className="text-white font-black text-sm">{p.num}</span>
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-5">{p.title}</h3>
                <ul className="space-y-3 mb-8">
                  {p.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-600">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={p.link}
                  className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 transition-all group-hover:gap-3"
                  style={{}}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#111' }}>
                  {p.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMMES ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>What We Offer</p>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900">Our Programmes</h2>
            </div>
            <a href="https://laga-institute.org/academics/" target="_blank" rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors">
              Explore on LAGAI.org <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {PROGRAMMES.map(p => (
              <div key={p.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    p.level === 'Undergraduate' ? 'bg-blue-50 text-blue-700' :
                    p.level === 'Postgraduate'  ? 'bg-purple-50 text-purple-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>{p.level}</span>
                  <span className="text-xs text-zinc-400">{p.duration}</span>
                </div>
                <h3 className="font-black text-zinc-900 mb-4 leading-snug text-base group-hover:transition-colors" style={{}}>
                  {p.name}
                </h3>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xl font-black text-zinc-900">
                    {p.fee}<span className="text-xs font-normal text-zinc-400 ml-0.5">/yr</span>
                  </span>
                  <Link to="/register?role=student"
                    className="text-xs font-bold flex items-center gap-1 transition-colors"
                    style={{ color: '#C9A84C' }}>
                    Apply <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DUAL SYSTEM ═════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          {/* European Standards */}
          <div className="bg-zinc-950 rounded-2xl p-10 text-white">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>01 · System One</p>
            <h3 className="text-4xl font-black leading-tight mb-1">European</h3>
            <h3 className="text-4xl font-black italic text-zinc-500 mb-7">Standards</h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Drawing on Germany's world-renowned dual vocational system and Portugal's academic rigour, LAGAI's
              European pillar ensures every qualification meets internationally recognised benchmarks.
            </p>
            <ul className="space-y-3">
              {['German dual system methodology', 'EVTA and QAHE accreditation', 'Europass digital credentials', 'ALL DIGITAL member institution'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C9A84C' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* African Ingenuity */}
          <div className="rounded-2xl p-10 text-zinc-950" style={{ backgroundColor: '#C9A84C' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-700">02 · System Two</p>
            <h3 className="text-4xl font-black leading-tight mb-1">African</h3>
            <h3 className="text-4xl font-black italic text-zinc-700 mb-7">Ingenuity</h3>
            <p className="text-zinc-700 leading-relaxed mb-8">
              Rooted in African cultural wisdom and the dynamism of emerging markets, LAGAI's African pillar
              brings contextual relevance, entrepreneurial spirit, and community-centred learning.
            </p>
            <ul className="space-y-3">
              {['Pan-African market integration', 'Cultural research methodology', 'Community entrepreneurship focus', 'Multilingual programme delivery'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-800">
                  <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ ACCREDITATIONS ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest mb-12">
            Affiliations &amp; Recognition
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {ACCREDITATIONS.map(a => (
              <a key={a.name} href={a.href} target="_blank" rel="noreferrer"
                className="grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                <img src={a.logo} alt={a.name} className="h-10 object-contain" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-zinc-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 25% 50%, rgba(201,168,76,0.12) 0%, transparent 60%), radial-gradient(ellipse at 75% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />
        <div className="relative max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to Begin<br />Your Journey?</h2>
          <p className="text-zinc-400 mb-12 text-lg max-w-xl mx-auto">
            Join a growing community of students and professionals earning internationally
            recognised qualifications across Cape Verde, Europe, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 font-bold px-10 py-4 rounded-xl text-base text-zinc-950 transition-colors"
              style={{ backgroundColor: '#C9A84C' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b8973f'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A84C'}>
              Start Your Application <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://laga-institute.org/contact/" target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors text-base">
              Get in Touch <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="md:col-span-2">
              <img
                src="https://laga-institute.org/wp-content/uploads/2026/03/cropped-Black_White_Modern_Monogram_CR_Logo_Design-removebg-preview-133x50.png"
                alt="LAGAI" className="h-10 object-contain mb-5" style={{ filter: 'brightness(10)' }}
              />
              <p className="text-sm leading-relaxed max-w-xs mb-6">
                Pioneering Institute of Vocational Education and Cultural Research. Where cultures,
                knowledge, and innovation converge to build a sustainable future.
              </p>
              <div className="flex items-center gap-3">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors"
                    style={{}}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A84C'; e.currentTarget.style.color = '#111' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-white font-bold text-sm mb-6">Quick Links</p>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'About LAGAI',       href: 'https://laga-institute.org/about-us/' },
                  { label: 'Academics',          href: 'https://laga-institute.org/academics/' },
                  { label: 'Campus Life',        href: 'https://laga-institute.org/campus-life/' },
                  { label: 'Become a Recruiter', href: 'https://laga-institute.org/become-a-recruiter/' },
                  { label: 'Contact Us',         href: 'https://laga-institute.org/contact/' },
                ].map(l => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors">
                    <ChevronRight className="w-3 h-3" />{l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-white font-bold text-sm mb-6">Campus</p>
              <div className="space-y-4 text-sm">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
                  Zona Achada S. Filipe, 1897 RC,<br />7200 Praia, Cape Verde
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A84C' }} />
                  +238 528 9397
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A84C' }} />
                  info@laga-institute.org
                </p>
                <a href="https://laga-institute.org" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 transition-colors hover:opacity-80"
                  style={{ color: '#C9A84C' }}>
                  <ExternalLink className="w-4 h-4" />laga-institute.org
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-600">
            <p>© 2026 LAGAI — Luso Anglo German African Institute of Vocational Education and Cultural Research. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="https://laga-institute.org/privacy-policy/" target="_blank" rel="noreferrer" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
              <a href="https://laga-institute.org/disclaimer/"     target="_blank" rel="noreferrer" className="hover:text-zinc-400 transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
