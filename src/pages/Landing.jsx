import { Link } from 'react-router-dom'
import {
  GraduationCap, BookOpen, Users, ClipboardCheck, ArrowRight,
  Star, Globe, Award, CheckCircle, ChevronRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: BookOpen,       title: 'Browse Programs',     desc: 'Explore undergraduate and postgraduate programmes across all faculties.' },
  { icon: ClipboardCheck, title: 'Easy Applications',   desc: 'Apply to multiple programmes, upload documents, and track status in real-time.' },
  { icon: Users,          title: 'Recruiter Network',   desc: 'Accredited agents submit and manage student applications with commission tracking.' },
  { icon: Award,          title: 'Admin Oversight',     desc: 'Full control over applications, programs, and recruiter approvals.' },
]

const STATS = [
  { value: '8+',   label: 'Programmes Available' },
  { value: '500+', label: 'Students Enrolled'    },
  { value: '50+',  label: 'Partner Recruiters'   },
  { value: '95%',  label: 'Acceptance Rate'      },
]

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
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-700">
            <GraduationCap className="w-6 h-6" />
            UniApply
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 0%, transparent 60%), radial-gradient(circle at 75% 50%, white 0%, transparent 60%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm border border-white/20">
            <Star className="w-3.5 h-3.5 text-yellow-300" />
            <span>Free & Open-Source University Admissions Platform</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Your Future Starts
            <span className="block text-blue-300">Here.</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Apply to world-class university programmes, track your admission journey,
            and connect with accredited education recruiters — all on one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=student" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Apply as Student <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register?role=recruiter" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors border border-white/30 backdrop-blur-sm">
              Join as Recruiter <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Wave */}
        <svg className="w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="white">
          <path d="M0,60 C360,0 1080,60 1440,0 L1440,60 Z" />
        </svg>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-blue-700">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-gray-500 max-w-lg mx-auto">One platform for students, recruiters, and university administrators.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three portals ── */}
      <section className="py-20 bg-white">
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
                items: ['Browse all university programmes', 'Submit applications online', 'Upload required documents', 'Track admission status in real-time'],
              },
              {
                role: 'recruiter', color: 'purple', icon: Globe,
                title: 'Recruiter Portal', cta: 'Become a Recruiter',
                items: ['Submit applications on behalf of students', 'Track all student pipelines', 'View and manage commissions', 'Access programme information'],
              },
              {
                role: 'admin', color: 'gray', icon: Award,
                title: 'Admin Panel', cta: 'Admin Login',
                items: ['Review & process applications', 'Manage programme catalogue', 'Approve recruiter accounts', 'Track commissions & payouts'],
              },
            ].map(p => {
              const colors = {
                blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50 text-blue-700',   ring: 'ring-blue-100' },
                purple: { bg: 'bg-purple-600',  light: 'bg-purple-50 text-purple-700', ring: 'ring-purple-100' },
                gray:   { bg: 'bg-gray-800',    light: 'bg-gray-100 text-gray-700',  ring: 'ring-gray-200' },
              }[p.color]
              return (
                <div key={p.role} className={`rounded-2xl border-2 p-6 ring-4 ${colors.ring} border-transparent`}>
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

      {/* ── CTA Banner ── */}
      <section className="bg-blue-700 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
        <p className="text-blue-200 mb-8 max-w-md mx-auto">Join thousands of students who have already applied through UniApply.</p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
          Create Free Account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2 text-white font-semibold">
          <GraduationCap className="w-4 h-4" />
          UniApply
        </div>
        <p>© 2025 UniApply. Open-source university admissions platform.</p>
        <p className="mt-1 text-gray-500 text-xs">Built with React · Tailwind CSS · Supabase-ready</p>
      </footer>
    </div>
  )
}
