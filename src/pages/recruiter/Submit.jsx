import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Upload, Trash2, FileText, ChevronRight, ChevronLeft } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

const STEPS = ['Student Info', 'Programme', 'Documents', 'Review & Submit']

const DOC_TYPES = [
  { id: 'passport',   label: 'Passport / ID',       required: true  },
  { id: 'transcript', label: 'Academic Transcript',  required: true  },
  { id: 'ielts',      label: 'English Test Results', required: false },
  { id: 'cv',         label: 'CV / Resumé',          required: false },
]

export default function RecruiterSubmit() {
  const { user } = useAuth()
  const { programs, submitApplication } = useData()

  const [step, setStep] = useState(0)
  const [student, setStudent] = useState({
    name: '', email: '', phone: '', nationality: '', dob: '',
    highestQualification: '', institution: '', graduationYear: '',
  })
  const [programId, setProgramId] = useState('')
  const [statement, setStatement] = useState('')
  const [documents, setDocuments] = useState([])
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const activePrograms = programs.filter(p => p.active)
  const chosen = programs.find(p => p.id === programId)

  const handleStudent = e => setStudent(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleDoc = (e) => {
    const files = Array.from(e.target.files)
    const type  = e.target.dataset.type
    files.forEach(f => {
      const reader = new FileReader()
      reader.onload = () => {
        setDocuments(prev => [
          ...prev.filter(d => d.type !== type),
          { name: f.name, type, size: f.size, uploadedAt: new Date().toISOString() },
        ])
      }
      reader.readAsDataURL(f)
    })
  }

  const removeDoc = type => setDocuments(prev => prev.filter(d => d.type !== type))

  const canNext = () => {
    if (step === 0) return student.name && student.email
    if (step === 1) return !!programId
    return true
  }

  const submit = () => {
    setError('')
    const missing = DOC_TYPES.filter(d => d.required && !documents.find(ud => ud.type === d.id))
    if (missing.length > 0) { setError(`Please upload: ${missing.map(m => m.label).join(', ')}`); return }

    submitApplication({
      studentId:        `student-ext-${Date.now()}`,
      studentName:      student.name,
      studentEmail:     student.email,
      programId,
      personalStatement: statement || 'Submitted by recruiter on behalf of student.',
      documents,
      additionalInfo:   student,
      recruiterId:      user.id,
      recruiterName:    user.name,
    })
    setDone(true)
  }

  if (done) {
    return (
      <PageLayout>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Application for <strong>{student.name}</strong> to <strong>{chosen?.name}</strong> has been submitted successfully.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setDone(false); setStep(0); setStudent({name:'',email:'',phone:'',nationality:'',dob:'',highestQualification:'',institution:'',graduationYear:''}); setProgramId(''); setStatement(''); setDocuments([]) }}
              className="btn-secondary">Submit Another</button>
            <Link to="/recruiter/students" className="btn-primary">View My Students</Link>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="page-title">Submit Student Application</h1>
          <p className="text-gray-500 mt-1">Submit an application on behalf of your student</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{i < step ? '✓' : i + 1}</div>
              <span className={`text-xs ${i === step ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="card">
          {/* STEP 0 — Student Info */}
          {step === 0 && (
            <div>
              <h2 className="section-title mb-4">Student Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'name',                  label: 'Full Name *',              span: 2, type: 'text'   },
                  { name: 'email',                 label: 'Email Address *',          span: 2, type: 'email'  },
                  { name: 'phone',                 label: 'Phone Number',             span: 1, type: 'tel'    },
                  { name: 'nationality',           label: 'Nationality',              span: 1, type: 'text'   },
                  { name: 'dob',                   label: 'Date of Birth',            span: 1, type: 'date'   },
                  { name: 'highestQualification',  label: 'Highest Qualification',    span: 1, type: 'text'   },
                  { name: 'institution',           label: 'Last Institution',         span: 1, type: 'text'   },
                  { name: 'graduationYear',        label: 'Graduation Year',          span: 1, type: 'number' },
                ].map(f => (
                  <div key={f.name} className={f.span === 2 ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                    <input type={f.type} name={f.name} value={student[f.name]} onChange={handleStudent} className="input-field" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Programme */}
          {step === 1 && (
            <div>
              <h2 className="section-title mb-1">Select Programme</h2>
              <p className="text-sm text-gray-500 mb-4">Choose the programme to apply for</p>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 mb-4">
                {activePrograms.map(p => (
                  <label key={p.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    programId === p.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input type="radio" name="program" value={p.id} checked={programId === p.id}
                      onChange={() => setProgramId(p.id)} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.faculty} · {p.duration} · {p.intake}</p>
                      <p className="text-xs text-purple-600">${p.fee?.toLocaleString()} / year</p>
                    </div>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Personal Statement (optional)</label>
                <textarea value={statement} onChange={e => setStatement(e.target.value)} rows={4}
                  placeholder="Student's personal statement or summary…"
                  className="input-field resize-none" />
              </div>
            </div>
          )}

          {/* STEP 2 — Documents */}
          {step === 2 && (
            <div>
              <h2 className="section-title mb-1">Student Documents</h2>
              <p className="text-sm text-gray-500 mb-4">Upload supporting documents for {student.name}</p>
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
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${uploaded ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {uploaded ? <CheckCircle className="w-4 h-4 text-green-600" /> : <FileText className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {dt.label}{dt.required && <span className="text-red-500 ml-1 text-xs">*required</span>}
                        </p>
                        {uploaded && <p className="text-xs text-green-600 truncate">{uploaded.name}</p>}
                      </div>
                      {uploaded ? (
                        <button onClick={() => removeDoc(dt.id)} className="text-red-400 hover:text-red-600 p-1.5"><Trash2 className="w-4 h-4" /></button>
                      ) : (
                        <label className="cursor-pointer btn-secondary text-xs py-1.5 px-3">
                          <Upload className="w-3.5 h-3.5" /> Upload
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" data-type={dt.id} onChange={handleDoc} className="hidden" />
                        </label>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <div>
              <h2 className="section-title mb-5">Review & Submit</h2>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">Student</p>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email} · {student.nationality}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Programme</p>
                  <p className="font-medium text-gray-900">{chosen?.name}</p>
                  <p className="text-sm text-gray-500">{chosen?.faculty} · Intake: {chosen?.intake}</p>
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
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
                  By submitting, you confirm that you have the student's consent to submit this application and that all information provided is accurate.
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="btn-secondary">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-primary bg-purple-600 hover:bg-purple-700">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} className="btn-primary bg-green-600 hover:bg-green-700">
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
