import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle,
  Users, User, Upload, FileText, X, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { GOOGLE_CLIENT_ID, initGoogleButton } from '../../lib/googleAuth'

// ── File upload helpers ────────────────────────────────────────────────────────
const MAX_FILE_BYTES = 2 * 1024 * 1024 // 2 MB

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── DocUpload sub-component ────────────────────────────────────────────────────
function DocUpload({ label, hint, required, doc, onFile, onRemove }) {
  const inputRef = useRef(null)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="ml-1 text-xs font-normal text-gray-400">{hint}</span>}
      </label>

      {doc ? (
        /* Uploaded state */
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-green-800 truncate">{doc.name}</p>
              <p className="text-xs text-green-600">{formatBytes(doc.size)}</p>
            </div>
          </div>
          <button type="button" onClick={onRemove}
            className="ml-3 p-1 rounded-lg text-green-700 hover:bg-green-200 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 font-medium">Click to upload</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF · max 2 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            className="hidden"
            onChange={onFile}
          />
        </div>
      )}
    </div>
  )
}

// ── Main Register component ────────────────────────────────────────────────────
export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const googleBtnRef = useRef(null)
  const googleCallbackRef = useRef(null)

  const [role, setRole] = useState(params.get('role') || 'student')
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', nationality: '', dob: '',
    agency: '', agencyCountry: '',
  })
  const [googleUser, setGoogleUser] = useState(null)
  const [docs, setDocs] = useState({ id: null, business: null })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Pre-fill from Google if redirected from Login "no account found" flow
  useEffect(() => {
    const stored = sessionStorage.getItem('google_prefill')
    if (stored) {
      try {
        const gData = JSON.parse(stored)
        sessionStorage.removeItem('google_prefill')
        setGoogleUser(gData)
        setForm(f => ({ ...f, name: gData.name || '', email: gData.email || '' }))
      } catch (_) {}
    }
  }, [])

  // Keep callback ref current without re-initialising the SDK
  googleCallbackRef.current = (payload) => {
    setGoogleUser({ name: payload.name, email: payload.email, googleId: payload.sub, picture: payload.picture })
    setForm(f => ({ ...f, name: payload.name || f.name, email: payload.email || f.email }))
    setError('')
  }

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const mount = () => {
      if (!googleBtnRef.current) return
      initGoogleButton(
        googleBtnRef.current,
        (payload) => googleCallbackRef.current(payload),
        'continue_with'
      )
    }

    if (window.googleSdkReady) {
      mount()
    } else {
      window.addEventListener('google-sdk-loaded', mount, { once: true })
    }
    return () => window.removeEventListener('google-sdk-loaded', mount)
  }, [])

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // ── File handling ────────────────────────────────────────────────────────────
  const handleFile = async (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" is too large. Maximum file size is 2 MB.`)
      e.target.value = ''
      return
    }

    try {
      const data = await fileToBase64(file)
      setDocs(d => ({ ...d, [type]: { name: file.name, size: file.size, mimeType: file.type, data } }))
    } catch {
      setError('Could not read the file. Please try again.')
    }
    e.target.value = ''
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault()
    setError('')

    const usingGoogle = !!googleUser

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.'); return
    }
    if (!usingGoogle) {
      if (!form.password) { setError('Please set a password.'); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
      if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    }
    if (role === 'recruiter' && !docs.id) {
      setError('Please upload your means of identification before submitting.')
      return
    }

    setLoading(true)
    try {
      const userData = {
        role,
        name:        form.name.trim(),
        email:       form.email.trim().toLowerCase(),
        phone:       form.phone,
        nationality: form.nationality,
        ...(role === 'student'   ? { dob: form.dob } : {}),
        ...(role === 'recruiter' ? { agency: form.agency, agencyCountry: form.agencyCountry } : {}),
        authMethod: usingGoogle ? 'google' : 'email',
        ...(usingGoogle
          ? { googleId: googleUser.googleId, picture: googleUser.picture }
          : { password: form.password }),
        ...(role === 'recruiter' ? {
          documents: {
            identification:       docs.id,
            businessRegistration: docs.business,
          },
        } : {}),
      }

      register(userData)

      if (role === 'recruiter') {
        setSuccess(true)
      } else {
        navigate('/student/dashboard')
      }
    } catch (err) {
      if (err.name === 'QuotaExceededError' || err.message?.includes('quota')) {
        setError('Storage limit reached. Try uploading smaller files (under 500 KB each).')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen (recruiter pending approval) ──────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Your recruiter account is pending admin approval. You'll receive access once reviewed.
            Your uploaded documents have been saved for verification.
          </p>
          <Link to="/login" className="btn-primary w-full justify-center py-2.5">Go to Login</Link>
        </div>
      </div>
    )
  }

  // ── Registration form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-900 font-bold text-xl">
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            LAGAI
          </Link>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Admissions Portal</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Apply to LAGAI and begin your journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { v: 'student',   icon: User,  label: 'Student',   desc: 'Apply for programmes' },
              { v: 'recruiter', icon: Users, label: 'Recruiter', desc: 'Submit for students'  },
            ].map(r => (
              <button key={r.v} type="button"
                onClick={() => { setRole(r.v); setDocs({ id: null, business: null }) }}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                  role === r.v
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                <r.icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{r.label}</span>
                <span className="text-xs opacity-70">{r.desc}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Recruiter approval notice */}
          {role === 'recruiter' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-xs text-amber-700 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
              Recruiter accounts require admin approval. Please have your government-issued ID
              and company documents ready to upload below.
            </div>
          )}

          {/* Google Sign-Up button (shown until Google is connected) */}
          {GOOGLE_CLIENT_ID && !googleUser && (
            <>
              <div ref={googleBtnRef} className="flex justify-center mb-4 min-h-[44px]" />
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or fill in the form</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          {/* Google connected banner */}
          {googleUser && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5">
              <div className="flex items-center gap-3 min-w-0">
                {googleUser.picture
                  ? <img src={googleUser.picture} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                  : <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                      {googleUser.name?.[0]?.toUpperCase()}
                    </div>
                }
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-blue-900 truncate">{googleUser.name}</p>
                  <p className="text-xs text-blue-600 truncate">{googleUser.email} · via Google</p>
                </div>
              </div>
              <button type="button"
                onClick={() => { setGoogleUser(null); setForm(f => ({ ...f, name: '', email: '' })) }}
                className="ml-3 text-blue-400 hover:text-blue-700 p-1 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">

            {/* Core fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handle}
                  placeholder="Jane Doe" className="input-field"
                  readOnly={!!googleUser} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handle}
                  placeholder="you@example.com" className="input-field"
                  readOnly={!!googleUser} />
              </div>

              {/* Password fields — hidden when signed in with Google */}
              {!googleUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                    <div className="relative">
                      <input name="password" type={showPw ? 'text' : 'password'} value={form.password}
                        onChange={handle} placeholder="Min. 6 characters" className="input-field pr-10" />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                    <input name="confirmPassword" type="password" value={form.confirmPassword}
                      onChange={handle} placeholder="Repeat password" className="input-field" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handle}
                  placeholder="+1-555-0000" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality</label>
                <input name="nationality" value={form.nationality} onChange={handle}
                  placeholder="e.g. Nigerian" className="input-field" />
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
                    <input name="agency" value={form.agency} onChange={handle}
                      placeholder="Global Education Partners" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <input name="agencyCountry" value={form.agencyCountry} onChange={handle}
                      placeholder="United Kingdom" className="input-field" />
                  </div>
                </>
              )}
            </div>

            {/* Document uploads — recruiters only */}
            {role === 'recruiter' && (
              <div className="border-t border-gray-100 pt-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Identity &amp; Company Documents</p>
                  <p className="text-xs text-gray-500">
                    Reviewed by LAGAI admin before your account is approved.
                    Files are stored securely and not shared with third parties.
                  </p>
                </div>

                <DocUpload
                  label="Means of Identification"
                  hint="Passport, National ID, or Driver's Licence"
                  required
                  doc={docs.id}
                  onFile={(e) => handleFile(e, 'id')}
                  onRemove={() => setDocs(d => ({ ...d, id: null }))}
                />

                <DocUpload
                  label="Business / Company Registration Certificate"
                  hint="Optional — if you represent a registered company"
                  doc={docs.business}
                  onFile={(e) => handleFile(e, 'business')}
                  onRemove={() => setDocs(d => ({ ...d, business: null }))}
                />
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading
                ? 'Submitting…'
                : role === 'recruiter'
                  ? 'Submit Application for Approval'
                  : 'Create Account'}
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
