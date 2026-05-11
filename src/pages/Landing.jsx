import { Link } from 'react-router-dom'
import {
  GraduationCap, BookOpen, Users, ClipboardCheck, ArrowRight,
  Globe, Award, CheckCircle, ChevronRight, MapPin, Phone, Mail, ExternalLink
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: BookOpen,       title: 'Browse Programmes',   desc: 'Explore LAGAI\'s full catalogue of vocational, graduate, and certificate programmes.' },
  { icon: ClipboardCheck, title: 'Online Applications', desc: 'Apply in minutes — upload documents, write your statement, and track status in real-time.' },
  { icon: Users,          title: 'Recruiter Network',   desc: 'Accredited education agents submit and manage student applications with commission tracking.' },
  { icon: Award,          title: 'Admin Oversight',     desc: 'Full control over applications, programmes, recruiter approvals, and commission payouts.' },
]

const STATS = [
  { value: '9',    label: 'Programmes Available' },
  { value: '4',    label: 'Partner Nations'       },
  { value: '6+',   label: 'Accreditation Bodies'  },
  { value: '2026', label: 'Admissions Open'       },
]

const PARTNERS = [
  { country: 'Cape Verde', flag: '🇨🇻', role: 'Host Campus — Praia' },
  { country: 'Portugal',   flag: '🇵🇹', role: 'European Partner' },
  { country: 'Germany',    flag: '🇩🇪', role: 'European Partner' },
  { country: 'United States', flag: '🇺🇸', role: 'International Partner' },
]

const ACCREDITATIONS = ['QAHE', 'Europass', 'EVBB', 'EVTA', 'ALL Digital', 'EFVET', 'UNESCO 2030']

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-lg text-gray-900">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span>LAGAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="https://laga-institute.org" target="_blank" rel="noreferrer"
               className="flex items-center gap-1 hover:text-gray-900 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Institute Website
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">Apply Now</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 60%, #d4af37 0%, transparent 50%), radial-gradient(circle at 80% 30%, #ffffff 0%, transparent 50%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm border border-white/20">
            <Globe className="w-3.5 h-3.5 text-yellow-400" />
            <span>2026 Admissions Now Open</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Luso Anglo German African
            <span className="block text-yellow-400 mt-1">Institute</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-3 font-medium uppercase tracking-wider">
            Vocational Education &amp; Cultural Research
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A German–Luso–African hub for vocational excellence and cultural research,
            connecting four nations through transformative education. Accredited in Europe and Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=student"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg">
              Apply as Student <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register?role=recruiter"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors border border-white/30 backdrop-blur-sm">
              Become a Recruiter <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Wave */}
        <svg className="w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="white">
          <path d="M0,60 C360,0 1080,60 1440,0 L1440,60 Z" />
        </svg>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Partner Nations ── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Four Nations, One Vision</h2>
            <p className="text-gray-500">A truly international institute bridging continents through education.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PARTNERS.map(p => (
              <div key={p.country} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <p className="text-4xl mb-2">{p.flag}</p>
                <p className="font-semibold text-gray-900">{p.country}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Complete Admissions Platform</h2>
            <p className="text-gray-500 max-w-lg mx-auto">One portal for students, recruiters, and LAGAI administrators.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three portals ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Three Portals, One Platform</h2>
            <p className="text-gray-500">Role-specific dashboards built for every user type.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                role: 'student', color: 'blue', icon: GraduationCap,
                title: 'Student Portal', cta: 'Register as Student',
                items: ['Browse all LAGAI programmes', 'Submit applications online', 'Upload required documents', 'Track admission status in real-time'],
              },
              {
                role: 'recruiter', color: 'purple', icon: Globe,
                title: 'Recruiter Portal', cta: 'Become a Recruiter',
                items: ['Submit applications for students', 'Track all student pipelines', 'View and manage commissions', 'Access full programme catalogue'],
              },
              {
                role: 'admin', color: 'dark', icon: Award,
                title: 'Admin Panel', cta: 'Admin Login',
                items: ['Review & process applications', 'Manage programme catalogue', 'Approve recruiter accounts', 'Track commissions & payouts'],
              },
            ].map(p => {
              const colors = {
                blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50 text-blue-700',   ring: 'ring-blue-100' },
                purple: { bg: 'bg-purple-600',  light: 'bg-purple-50 text-purple-700', ring: 'ring-purple-100' },
                dark:   { bg: 'bg-gray-900',    light: 'bg-gray-100 text-gray-700',  ring: 'ring-gray-200' },
              }[p.color]
              return (
                <div key={p.role} className={`rounded-2xl border-2 p-6 ring-4 bg-white ${colors.ring} border-transparent`}>
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <p.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{p.title}</h3>
                  <ul className="space-y-2 mb-6">
                    {p.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={p.role === 'admin' ? '/login' : `/register?role=${p.role}`}
                    className={`inline-flex items-center gap-2 text-sm font-semibold ${colors.light} px-4 py-2 rounded-lg`}
                  >
                    {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Accreditations ── */}
      <section className="bg-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Internationally Recognised &amp; Accredited</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {ACCREDITATIONS.map(a => (
              <span key={a} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold border border-gray-200">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gray-900 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey with LAGAI?</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Join a growing community of students and professionals earning internationally
          recognised qualifications across Cape Verde, Europe, and beyond.
        </p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg">
          Start Your Application <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-500 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3 text-white font-bold text-lg">
                <GraduationCap className="w-5 h-5" />
                LAGAI
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Luso Anglo German African Institute of Vocational Education and Cultural Research.
                Connecting four nations through transformative education.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-white font-semibold mb-3">Contact</p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-500" />
                Zona Achada S. Filipe, 1897 RC, 7200 Praia, Cape Verde
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-500" />
                +238 528 9397
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-500" />
                info@laga-institute.org
              </p>
              <a href="https://laga-institute.org" target="_blank" rel="noreferrer"
                 className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors mt-1">
                <ExternalLink className="w-4 h-4" />
                laga-institute.org
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
            <p>© 2026 Luso Anglo German African Institute of Vocational Education and Cultural Research (LAGAI). All rights reserved.</p>
            <p className="text-gray-600">Admissions Portal · Built with React &amp; Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
