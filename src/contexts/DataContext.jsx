import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_PROGRAMS = [
  {
    id: 'prog-1', name: 'Double Honour Graduate Program', faculty: 'Vocational Education & Research',
    level: 'Postgraduate', duration: '2 Years', fee: 8500, currency: 'EUR',
    intake: 'September 2026', seats: 60,
    description: 'A prestigious dual-degree programme awarded jointly by partner institutions in Portugal and Germany. Students earn two recognised graduate credentials, combining European academic excellence with African development focus.',
    requirements: ['Bachelor\'s Degree (any discipline)', 'Proficiency in English or Portuguese', 'Statement of Purpose', 'Two academic references', 'IELTS 6.5+ or equivalent'],
    active: true,
  },
  {
    id: 'prog-2', name: 'Dual Undergraduate Programs', faculty: 'Vocational Education & Research',
    level: 'Undergraduate', duration: '3 Years', fee: 6500, currency: 'EUR',
    intake: 'September 2026', seats: 80,
    description: 'An innovative dual-award undergraduate pathway enabling students to earn qualifications from two partner universities simultaneously — one in Cape Verde, one in Europe. Delivered across campuses in Praia, Lisbon, and Frankfurt.',
    requirements: ['High School Diploma or equivalent', 'English or Portuguese proficiency', 'Motivational letter', 'IELTS 6.0+ or equivalent'],
    active: true,
  },
  {
    id: 'prog-3', name: 'Dual Graduate Programs', faculty: 'Vocational Education & Research',
    level: 'Postgraduate', duration: '18 Months', fee: 7800, currency: 'EUR',
    intake: 'January 2027', seats: 50,
    description: 'Graduate-level joint degrees combining vocational education theory with cultural research methodologies. Graduates receive dual certification from LAGAI and a European partner institution, accredited under QAHE and Europass frameworks.',
    requirements: ['Bachelor\'s Degree', 'English proficiency (IELTS 6.5+)', 'Research proposal (500 words)', 'Professional CV', 'One professional reference'],
    active: true,
  },
  {
    id: 'prog-4', name: 'Dual Graduate Programs (Hybrid)', faculty: 'Vocational Education & Research',
    level: 'Postgraduate', duration: '18 Months', fee: 6900, currency: 'EUR',
    intake: 'September 2026', seats: 70,
    description: 'A flexible hybrid delivery of the Dual Graduate program, combining online modules with short in-person residencies in Cape Verde and Europe. Designed for working professionals who cannot relocate full-time.',
    requirements: ['Bachelor\'s Degree', 'Reliable internet access', 'English proficiency (IELTS 6.0+)', 'Professional CV', 'Statement of Purpose'],
    active: true,
  },
  {
    id: 'prog-5', name: 'Dual Postgraduate Diploma & Certificate', faculty: 'Professional Development',
    level: 'Postgraduate', duration: '12 Months', fee: 4500, currency: 'EUR',
    intake: 'September 2026', seats: 100,
    description: 'A focused postgraduate programme offering both a Diploma and Certificate award upon completion. Ideal for professionals seeking recognised qualifications in vocational education management, cultural studies, or community development.',
    requirements: ['Bachelor\'s Degree or 5 years relevant work experience', 'English or Portuguese proficiency', 'CV and cover letter'],
    active: true,
  },
  {
    id: 'prog-6', name: 'Youth Vocational Training Program', faculty: 'Youth & Community Development',
    level: 'Certificate', duration: '6 Months', fee: 1200, currency: 'EUR',
    intake: 'March 2027', seats: 150,
    description: 'A practical skills-based programme for young people aged 16–25, focused on employability, technical trades, entrepreneurship, and digital literacy. Delivered in partnership with EVBB and EVTA across Cape Verde.',
    requirements: ['Age 16–25', 'Completion of secondary education (or equivalent)', 'Interview', 'Parental consent (under 18)'],
    active: true,
  },
  {
    id: 'prog-7', name: 'Certificate & Award Programs', faculty: 'Professional Development',
    level: 'Certificate', duration: '3 Months', fee: 950, currency: 'EUR',
    intake: 'January 2027', seats: 200,
    description: 'Short-cycle professional certificates and awards recognised under Europass and the European Qualifications Framework (EQF). Topics include project management, digital skills, intercultural communication, and sustainable development.',
    requirements: ['Secondary school certificate or work experience', 'Basic English or Portuguese', 'Online application form'],
    active: true,
  },
  {
    id: 'prog-8', name: 'Train the Trainers Program', faculty: 'Educator Development',
    level: 'Certificate', duration: '4 Months', fee: 2200, currency: 'EUR',
    intake: 'September 2026', seats: 60,
    description: 'Designed for educators, coaches, and community leaders, this programme builds competencies in adult education, instructional design, and vocational training delivery. Graduates earn an internationally recognised Train the Trainers certificate aligned with EFVET and ALL Digital standards.',
    requirements: ['2+ years teaching, coaching, or training experience', 'English or Portuguese proficiency', 'CV and letter of intent', 'Institutional endorsement (preferred)'],
    active: true,
  },
  {
    id: 'prog-9', name: 'Languages & Ethics Programs', faculty: 'Languages & Cultural Research',
    level: 'Certificate', duration: '6 Months', fee: 1500, currency: 'EUR',
    intake: 'March 2027', seats: 120,
    description: 'Immersive language and intercultural ethics programmes connecting the Luso-German-African linguistic traditions. Offers instruction in Portuguese, German, and African languages alongside modules in research ethics, decolonial theory, and UNESCO 2030 Agenda frameworks.',
    requirements: ['Secondary school certificate', 'Basic literacy in one programme language', 'Motivation letter'],
    active: true,
  },
]

const SEED_APPLICATIONS = [
  {
    id: 'app-001',
    studentId: 'student-001',
    studentName: 'Maria Santos',
    studentEmail: 'student@demo.com',
    programId: 'prog-2',
    programName: 'Dual Undergraduate Programs',
    recruiterId: null,
    recruiterName: null,
    status: 'under_review',
    submittedAt: new Date('2026-03-15').toISOString(),
    updatedAt: new Date('2026-03-16').toISOString(),
    personalStatement: 'Growing up in Cape Verde, I witnessed firsthand the transformative power of vocational education in our communities. LAGAI\'s dual-award model will allow me to gain a European-recognised qualification while staying connected to the African context I care deeply about...',
    documents: [
      { name: 'passport.pdf', type: 'passport', uploadedAt: new Date('2026-03-15').toISOString() },
      { name: 'transcript.pdf', type: 'transcript', uploadedAt: new Date('2026-03-15').toISOString() },
    ],
    adminNotes: '',
    offerLetterUrl: null,
  },
  {
    id: 'app-002',
    studentId: 'student-001',
    studentName: 'Maria Santos',
    studentEmail: 'student@demo.com',
    programId: 'prog-4',
    programName: 'Dual Graduate Programs (Hybrid)',
    recruiterId: 'recruiter-001',
    recruiterName: 'Klaus Werner',
    status: 'accepted',
    submittedAt: new Date('2026-02-20').toISOString(),
    updatedAt: new Date('2026-03-01').toISOString(),
    personalStatement: 'As a working professional in adult education, the hybrid delivery model perfectly suits my schedule while enabling me to earn a dual European qualification...',
    documents: [
      { name: 'cv.pdf', type: 'cv', uploadedAt: new Date('2026-02-20').toISOString() },
    ],
    adminNotes: 'Strong candidate with relevant professional background. Scholarship under review.',
    offerLetterUrl: null,
    commissionPaid: false,
  },
]

const SEED_COMMISSIONS = [
  {
    id: 'com-001',
    recruiterId: 'recruiter-001',
    recruiterName: 'Klaus Werner',
    applicationId: 'app-002',
    studentName: 'Maria Santos',
    programName: 'Dual Graduate Programs (Hybrid)',
    programFee: 6900,
    rate: 10,
    amount: 690,
    status: 'approved',
    createdAt: new Date('2026-03-01').toISOString(),
  },
]

function load(key, seed) {
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw)
  localStorage.setItem(key, JSON.stringify(seed))
  return seed
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function DataProvider({ children }) {
  const [programs, setPrograms]       = useState(() => load('ua_programs', SEED_PROGRAMS))
  const [applications, setApplications] = useState(() => load('ua_applications', SEED_APPLICATIONS))
  const [commissions, setCommissions] = useState(() => load('ua_commissions', SEED_COMMISSIONS))

  // Persist to localStorage whenever state changes
  useEffect(() => { save('ua_programs', programs) },     [programs])
  useEffect(() => { save('ua_applications', applications) }, [applications])
  useEffect(() => { save('ua_commissions', commissions) }, [commissions])

  // ── Programs ──────────────────────────────────────────────────────────────
  const addProgram = (data) => {
    const p = { id: `prog-${Date.now()}`, ...data, active: true }
    setPrograms(prev => [...prev, p])
    return p
  }

  const updateProgram = (id, updates) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProgram = (id) => {
    setPrograms(prev => prev.filter(p => p.id !== id))
  }

  // ── Applications ──────────────────────────────────────────────────────────
  const submitApplication = (data) => {
    const program = programs.find(p => p.id === data.programId)
    const app = {
      id: `app-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      programName: program?.name ?? 'Unknown Program',
      adminNotes: '',
      offerLetterUrl: null,
      commissionPaid: false,
      ...data,
    }
    setApplications(prev => [...prev, app])

    // If there's a recruiter, create a pending commission
    if (data.recruiterId) {
      const rate = 10 // default 10%
      const comm = {
        id: `com-${Date.now()}`,
        recruiterId: data.recruiterId,
        recruiterName: data.recruiterName,
        applicationId: app.id,
        studentName: data.studentName,
        programName: app.programName,
        programFee: program?.fee ?? 0,
        rate,
        amount: Math.round((program?.fee ?? 0) * rate / 100),
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      setCommissions(prev => [...prev, comm])
    }

    return app
  }

  const updateApplication = (id, updates) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)
    )
  }

  const updateApplicationStatus = (id, status, adminNotes = '') => {
    setApplications(prev =>
      prev.map(a => a.id === id
        ? { ...a, status, adminNotes, updatedAt: new Date().toISOString() }
        : a)
    )

    // On acceptance, mark commissions as approved
    if (status === 'accepted') {
      setCommissions(prev =>
        prev.map(c => c.applicationId === id ? { ...c, status: 'approved' } : c)
      )
    }
    // On rejection, cancel commissions
    if (status === 'rejected') {
      setCommissions(prev =>
        prev.map(c => c.applicationId === id ? { ...c, status: 'cancelled' } : c)
      )
    }
  }

  // ── Commissions ───────────────────────────────────────────────────────────
  const updateCommission = (id, updates) => {
    setCommissions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const markCommissionPaid = (id) => {
    setCommissions(prev =>
      prev.map(c => c.id === id ? { ...c, status: 'paid', paidAt: new Date().toISOString() } : c)
    )
  }

  // ── Derived helpers ───────────────────────────────────────────────────────
  const getStudentApplications = (studentId) =>
    applications.filter(a => a.studentId === studentId)

  const getRecruiterApplications = (recruiterId) =>
    applications.filter(a => a.recruiterId === recruiterId)

  const getRecruiterCommissions = (recruiterId) =>
    commissions.filter(c => c.recruiterId === recruiterId)

  return (
    <DataContext.Provider value={{
      programs, applications, commissions,
      addProgram, updateProgram, deleteProgram,
      submitApplication, updateApplication, updateApplicationStatus,
      updateCommission, markCommissionPaid,
      getStudentApplications, getRecruiterApplications, getRecruiterCommissions,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
