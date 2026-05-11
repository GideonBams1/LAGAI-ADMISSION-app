import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const user = login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin/dashboard'
        : user.role === 'recruiter' ? '/recruiter/dashboard'
        : '/student/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const DEMO_ACCOUNTS = [
    { label: 'Student Demo',   email: 'student@demo.com',   password: 'demo123',  color: 'blue'   },
    { label: 'Recruiter Demo', email: 'recruiter@demo.com', password: 'demo123',  color: 'purple' },
    { label: 'Admin Demo',     email: 'admin@uniapply.com', password: 'admin123', color: 'gray'   },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl">
            <GraduationCap className="w-7 h-7" />
            UniApply
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                name="email" type="email" autoComplete="email"
                value={form.email} onChange={handle}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPw ? 'text' : 'password'} autoComplete="current-password"
                  value={form.password} onChange={handle}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Register</Link>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="mt-6 bg-white/70 backdrop-blur rounded-2xl p-5 border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Demo Accounts (click to fill)</p>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map(a => {
              const cls = {
                blue:   'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
                gray:   'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
              }[a.color]
              return (
                <button key={a.email} type="button"
                  onClick={() => setForm({ email: a.email, password: a.password })}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${cls}`}>
                  <span className="font-semibold">{a.label}</span>
                  <span className="ml-2 opacity-70">{a.email}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
