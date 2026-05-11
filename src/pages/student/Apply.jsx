import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Upload, CheckCircle, FileText, Trash2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

const STEPS = ['Programme', 'Personal Info', 'Statement', 'Documents', 'Review']
const DOC_TYPES = [
  { id: 'passport',   label: 'Passport / ID',           required: true  },
  { id: 'transcript', label: 'Academic Transcript',      required: true  },
  { id: 'ielts',      label: 'English Test Results',     required: false },
  { id: 'cv',         label: 'CV / Resumé',              required: false },
  { id: 'reference',  label: 'Reference Letter',         required: false },
  { id: 'other',      label: 'Other Supporting Document',required: false },
]

export default function StudentApply() {
  const { user } = useAuth()
  const { programs, submitApplication, getStudentApplications } = useData()
  const navigate = useNavigate()
  const { programId } = useParams()

  const [step, setStep] = useState(0)
  const [selectedProgram, setSelectedProgram] = useState(programId || '')
  const [personal, setPersonal] = useState({
    address: '', city: '', country: '', zipCode: '',
    emergencyName: '', emergencyPhone: '',
    highestQualification: '', institution: '', graduationYear: '',
  })
  const [statement, setStatement] = useState('')
  const [documents, setDocuments] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const activePrograms = programs.filter(p => p.active)
  const chosen = programs.find(p => p.id === selectedProgram)

  // Check for duplicate application
  const existing = getStudentApplications(user.id)
  const isDuplicate = existing.some(a => a.programId === selectedProgram && a.status !== 'rejected' && a.status !== 'withdrawn')

  const handleDoc = (e) => {
    const files = Array.from(e.target.files)
    const type  = e.target.dataset.type
    files.forEach(f => {
      const reader = new FileReader()
      reader.onload = () => {
        setDocuments(prev => [
          ...prev.filter(d => d.type !== type),
          { name: f.name, type, size: f.size, dataUrl: reader.result, uploadedAt: new Date().toISOString() },
        ])
      }
      reader.readAsDataURL(f)
    })
  }

  const removeDoc = (type) => setDocuments(prev => prev.filter(d => d.type !== type))

  const canNext = () => {
    if (step === 0) return !!selectedProgram && !isDuplicate
    if (step === 2) return statement.trim().length >= 100
    return true
  }

  const submit = () => {
    setError('')
    const reqDocs = DOC_TYPES.filter(d => d.required)
    const missing = reqDocs.filter(d => !documents.find(ud => ud.type === d.id))
    if (missing.length > 0) { setError(`Please upload: ${missing.map(m => m.label).join(', ')}`); return }

    setSubmitting(true)
    try {
      submitApplication({
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        programId: selectedProgram,
        personalStatement: statement,
        documents: documents.map(({ dataUrl, ...rest }) => rest), // don't store base64 in state
        additionalInfo: personal,
        recruiterId: null,
        recruiterName: null,
      })
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <PageLayout>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">Your application for <strong>{chosen?.name}</strong> has been submitted successfully. We'll review it and update you shortly.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setDone(false); setStep(0); setSelectedProgram(''); setStatement(''); setDocuments([]) }}
              className="btn-secondary">Apply Again</button>
            <Link to="/student/applications" className="btn-primary">Track Applications</Link>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="page-title">Apply for Admission</h1>
          <p className="text-gray-500 mt-1">Complete the form below to submit your application</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${i === step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="card">
          {/* STEP 0 — Programme Selection */}
          {step === 0 && (
            <div>
              <h2 className="section-title mb-4">Choose a Programme</h2>
              {isDuplicate && selectedProgram && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg p-3 mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  You have already applied to this programme. Please choose a different one.
                </div>
              )}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {activePrograms.map(p => (
                  <label key={p.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedProgram === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="radio" name="program" value={p.id} checked={selectedProgram === p.id}
                      onChange={() => setSelectedProgram(p.id)} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.faculty} · {p.duration} · {p.intake}</p>
                      <p className="text-xs text-blue-600 mt-0.5">${p.fee?.toLocaleString()} / year</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Personal Info */}
          {step === 1 && (
            <div>
              <h2 className="section-title mb-4">Personal & Academic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'address',           label: 'Street Address',        span: 2, type: 'text'   },
                  { name: 'city',              label: 'City',                  span: 1, type: 'text'   },
                  { name: 'country',           label: 'Country',               span: 1, type: 'text'   },
                  { name: 'emergencyName',     label: 'Emergency Contact Name',span: 1, type: 'text'   },
                  { name: 'emergencyPhone',    label: 'Emergency Contact Phone',span: 1,type: 'tel'    },
                  { name: 'highestQualification', label: 'Highest Qualification', span: 2, type: 'text' },
                  { name: 'institution',       label: 'Last Institution',      span: 1, type: 'text'   },
                  { name: 'graduationYear',    label: 'Graduation Year',       span: 1, type: 'number' },
                ].map(f => (
                  <div key={f.name} className={f.span === 2 ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                    <input type={f.type} name={f.name} value={personal[f.name]}
                      onChange={e => setPersonal(p => ({ ...p, [e.target.name]: e.target.value }))}
                      className="input-field" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Personal Statement */}
          {step === 2 && (
            <div>
              <h2 className="section-title mb-1">Personal Statement</h2>
              <p className="text-sm text-gray-500 mb-4">Explain why you want to study this programme, your goals, and relevant experience. Minimum 100 characters.</p>
              <textarea
                value={statement}
                onChange={e => setStatement(e.target.value)}
                rows={10}
                placeholder="I am applying for this programme because..."
                className="input-field resize-none"
              />
              <div className="flex justify-between mt-2">
                <p className={`text-xs ${statement.length < 100 ? 'text-red-500' : 'text-green-600'}`}>
                  {statement.length} / 100+ characters
                </p>
                <p className="text-xs text-gray-400">~{Math.ceil(statement.split(' ').length / 200)} min read</p>
              </div>
            </div>
          )}

          {/* STEP 3 — Documents */}
          {step === 3 && (
            <div>
              <h2 className="section-title mb-1">Upload Documents</h2>
              <p className="text-sm text-gray-500 mb-5">Upload your supporting documents. Accepted formats: PDF, JPG, PNG (max 5MB).</p>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}
              <div className="space-y-3">
                {DOC_TYPES.map(dt => {
                  const uploaded = documents.find(d => d.type === dt.id)
                  return (
                    <div key={dt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                      uploaded ? 'border-green-200 bg-green-50' : 'border-dashed border-gray-200'
                    }`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        uploaded ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {uploaded ? <CheckCircle className="w-4 h-4 text-green-600" /> : <FileText className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {dt.label}
                          {dt.required && <span className="text-red-500 ml-1 text-xs">*required</span>}
                        </p>
                        {uploaded && <p className="text-xs text-green-600 truncate">{uploaded.name}</p>}
                      </div>
                      {uploaded ? (
                        <button onClick={() => removeDoc(dt.id)} className="text-red-400 hover:text-red-600 p-1.5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <label className="cursor-pointer btn-secondary text-xs py-1.5 px-3">
                          <Upload className="w-3.5 h-3.5" /> Upload
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" data-type={dt.id}
                            onChange={handleDoc} className="hidden" />
                        </label>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4 — Review */}
          {step === 4 && (
            <div>
              <h2 className="section-title mb-5">Review Your Application</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Programme</p>
                  <p className="font-medium text-gray-900">{chosen?.name}</p>
                  <p className="text-sm text-gray-500">{chosen?.faculty} · {chosen?.intake}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Applicant</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Statement preview</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{statement}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Documents ({documents.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {documents.map(d => (
                      <span key={d.type} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs px-2.5 py-1 rounded-full text-gray-700">
                        <CheckCircle className="w-3 h-3 text-green-500" /> {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="btn-secondary">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-primary">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={submitting} className="btn-primary bg-green-600 hover:bg-green-700">
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
