import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle, Users, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [role, setRole] = useState(params.get('role') || 'student')
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', nationality: '', dob: '',
    // recruiter-specific
    agency: '', agencyCountry: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const user = register({ role, ...form })
      if (role === 'recruiter') {
        setSuccess(true)
      } else {
        navigate('/student/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">Your recruiter account is pending admin approval. You'll be able to log in once your account is approved.</p>
          <Link to="/login" className="btn-primary w-full justify-center py-2.5">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl">
            <GraduationCap className="w-7 h-7" />
            UniApply
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join UniApply and start your journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { v: 'student',   icon: User,  label: 'Student',  desc: 'Apply for programmes'    },
              { v: 'recruiter', icon: Users, label: 'Recruiter', desc: 'Submit for students'    },
            ].map(r => (
              <button key={r.v} type="button" onClick={() => setRole(r.v)}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                  role === r.v
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <r.icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{r.label}</span>
                <span className="text-xs opacity-70">{r.desc}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {role === 'recruiter' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-xs text-amber-700">
              ⚠️ Recruiter accounts require admin approval before login access is granted.
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Jane Doe" className="input-field" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                    placeholder="Min. 6 characters" className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle}
                  placeholder="Repeat password" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="+1-555-0000" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality</label>
                <input name="nationality" value={form.nationality} onChange={handle} placeholder="e.g. Nigerian" className="input-field" />
              </div>

              {role === 'student' && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                  <input name="dob" type="date" value={form.dob} onChange={handle} className="input-field" />
                </div>
              )}

              {role === 'recruiter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Agency / Company Name</label>
                    <input name="agency" value={form.agency} onChange={handle} placeholder="Global Education Partners" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <input name="agencyCountry" value={form.agencyCountry} onChange={handle} placeholder="United Kingdom" className="input-field" />
                  </div>
                </>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? 'Creating account…' : role === 'recruiter' ? 'Submit for Approval' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
